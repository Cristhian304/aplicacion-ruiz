import AsyncStorage from '@react-native-async-storage/async-storage';

// Diccionario culinario para traducción instantánea de términos comunes
const culinaryDictionary = {
  'chicken': 'pollo', 'beef': 'carne', 'pork': 'cerdo', 'fish': 'pescado',
  'egg': 'huevo', 'milk': 'leche', 'cheese': 'queso', 'bread': 'pan',
  'rice': 'arroz', 'pasta': 'pasta', 'tomato': 'tomate', 'onion': 'cebolla',
  'cup': 'taza', 'teaspoon': 'cucharadita', 'tablespoon': 'cucharada',
  'bake': 'hornear', 'fry': 'freír', 'boil': 'hervir', 'chop': 'picar'
  // ... (manteniendo solo los términos más esenciales para el ejemplo)
};

// Codificación segura para URLs de APIs
const encodeTextForAPI = (text) => {
  return text ? text.toString().replace(/\s+/g, '+').replace(/&/g, '%26') : '';
};

// Traducción rápida usando diccionario local (sin llamadas a API)
export const translateWithDictionary = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let translated = text;
  // Ordenar por longitud para coincidencias más específicas primero
  const entries = Object.entries(culinaryDictionary).sort((a, b) => b[0].length - a[0].length);
  
  for (const [english, spanish] of entries) {
    if (text.toLowerCase().includes(english.toLowerCase())) {
      const regex = new RegExp(english, 'gi');
      translated = translated.replace(regex, spanish);
    }
  }
  
  return translated;
};

// ==================== SISTEMA MULTI-API ====================

// Configuración de las 3 APIs de traducción con balance inteligente
const TRANSLATION_APIS = [
  {
    name: 'MyMemory',
    url: (text) => `https://api.mymemory.translated.net/get?q=${encodeTextForAPI(text)}&langpair=en|es`,
    parser: (data) => data.responseData?.translatedText,
    priority: 3
  },
  {
    name: 'LibreTranslate', 
    url: (text) => `https://translate.argosopentech.com/translate`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: (text) => JSON.stringify({ q: text, source: 'en', target: 'es' }),
    parser: (data) => data.translatedText,
    priority: 2
  },
  {
    name: 'GoogleTranslate',
    url: (text) => `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeTextForAPI(text)}`,
    parser: (data) => data?.[0]?.map(item => item[0]).join(''),
    priority: 1
  }
];

// Sistema de estadísticas para balanceo inteligente
let apiStats = {};

// Inicializar estadísticas para cada API
const initializeStats = () => {
  TRANSLATION_APIS.forEach(api => {
    apiStats[api.name] = { successes: 0, failures: 0, lastUsed: 0, consecutiveFails: 0 };
  });
};

// Cargar estadísticas históricas desde almacenamiento local
const loadApiStats = async () => {
  try {
    const stats = await AsyncStorage.getItem('translation_api_stats');
    if (stats) apiStats = JSON.parse(stats);
    initializeStats();
  } catch (error) {
    console.log('Error cargando estadísticas');
    initializeStats();
  }
};

// Guardar estadísticas para persistencia entre sesiones
const saveApiStats = async () => {
  try {
    await AsyncStorage.setItem('translation_api_stats', JSON.stringify(apiStats));
  } catch (error) {
    console.log('Error guardando estadísticas');
  }
};

// Algoritmo de selección inteligente basado en rendimiento histórico
const selectBestAPI = () => {
  const now = Date.now();
  const availableAPIs = [];
  
  TRANSLATION_APIS.forEach(api => {
    const stats = apiStats[api.name];
    const totalAttempts = stats.successes + stats.failures;
    const successRate = totalAttempts > 0 ? stats.successes / totalAttempts : 0.5;
    
    // Calcular score con penalizaciones por fallos recientes y uso frecuente
    const score = api.priority + successRate + 
                 (stats.consecutiveFails > 3 ? -2 : 0) +
                 ((now - stats.lastUsed) < 30000 ? -1 : 0);
    
    availableAPIs.push({ api, score, stats });
  });
  
  // Seleccionar API con mejor score
  availableAPIs.sort((a, b) => b.score - a.score);
  return availableAPIs[0].api;
};

// Traducción individual con una API específica
const translateWithSpecificAPI = async (text, apiConfig) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    let requestOptions = {
      method: apiConfig.method || 'GET',
      signal: controller.signal,
      headers: apiConfig.headers || {}
    };
    
    if (apiConfig.method === 'POST') {
      requestOptions.body = apiConfig.body(text);
    }
    
    const response = await fetch(apiConfig.url(text), requestOptions);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    const translatedText = apiConfig.parser(data);
    if (!translatedText) throw new Error('No translation received');
    
    // Actualizar estadísticas de éxito
    apiStats[apiConfig.name].successes++;
    apiStats[apiConfig.name].lastUsed = Date.now();
    apiStats[apiConfig.name].consecutiveFails = 0;
    await saveApiStats();
    
    return translatedText
      .replace(/<[^>]*>/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .trim();
    
  } catch (error) {
    // Actualizar estadísticas de fallo
    apiStats[apiConfig.name].failures++;
    apiStats[apiConfig.name].lastUsed = Date.now();
    apiStats[apiConfig.name].consecutiveFails++;
    await saveApiStats();
    
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Sistema principal de traducción con fallback entre múltiples APIs
const translateWithAPI = async (text) => {
  await loadApiStats();
  const attemptedAPIs = new Set();
  
  for (let attempt = 0; attempt < TRANSLATION_APIS.length * 2; attempt++) {
    const api = selectBestAPI();
    if (Array.from(attemptedAPIs).filter(name => name === api.name).length >= 2) continue;
    
    attemptedAPIs.add(api.name);
    
    try {
      return await translateWithSpecificAPI(text, api);
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }
  
  throw new Error('Todas las APIs fallaron');
};

// ==================== TRADUCCIÓN DE RECETAS COMPLETA ====================

// Función principal que orquesta la traducción completa de recetas
export const translateRecipe = async (recipe) => {
  const cacheKey = `recipe_${recipe.id}_translated`;
  
  // Verificar cache para evitar retraducciones
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      console.log('✅ Usando traducción en cache');
      return JSON.parse(cached);
    }
  } catch (error) {
    console.log('Error leyendo cache');
  }

  console.log('🔄 Traduciendo:', recipe.nombre);

  // Primera fase: traducción rápida con diccionario
  const baseTranslation = {
    ...recipe,
    nombre: translateWithDictionary(recipe.nombre),
    categoria: translateWithDictionary(recipe.categoria),
    area: translateWithDictionary(recipe.area),
    ingredientes: recipe.ingredientes.map(ing => ({
      ...ing,
      cantidad: translateWithDictionary(ing.cantidad),
      producto: translateWithDictionary(ing.producto)
    }))
  };

  // Segunda fase: traducción de pasos con APIs (más lenta pero más precisa)
  try {
    const translatedSteps = [];
    
    for (let i = 0; i < recipe.pasos.length; i++) {
      try {
        const translatedPaso = await translateWithAPI(recipe.pasos[i]);
        translatedSteps.push(translatedPaso);
        if (i < recipe.pasos.length - 1) await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        // Fallback a diccionario si todas las APIs fallan
        translatedSteps.push(translateWithDictionary(recipe.pasos[i]));
      }
    }
    
    const fullTranslatedRecipe = { ...baseTranslation, pasos: translatedSteps };
    
    // Guardar en cache para uso futuro
    try {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(fullTranslatedRecipe));
    } catch (error) {
      console.log('Error guardando cache');
    }
    
    return fullTranslatedRecipe;
    
  } catch (error) {
    // Fallback completo: solo diccionario
    return {
      ...baseTranslation,
      pasos: recipe.pasos.map(paso => translateWithDictionary(paso))
    };
  }
};

// Funciones auxiliares para monitoreo del sistema
export const getTranslationStats = () => apiStats;

export const resetTranslationStats = async () => {
  TRANSLATION_APIS.forEach(api => {
    apiStats[api.name] = { successes: 0, failures: 0, lastUsed: 0, consecutiveFails: 0 };
  });
  await saveApiStats();
};

// Inicializar el sistema al cargar el módulo
loadApiStats();