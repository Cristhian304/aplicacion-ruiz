import AsyncStorage from '@react-native-async-storage/async-storage';

// Diccionario mejorado
const culinaryDictionary = {
  // Ingredientes
  'chicken': 'pollo', 'beef': 'carne', 'pork': 'cerdo', 'fish': 'pescado',
  'egg': 'huevo', 'milk': 'leche', 'cheese': 'queso', 'bread': 'pan',
  'rice': 'arroz', 'pasta': 'pasta', 'tomato': 'tomate', 'onion': 'cebolla',
  'garlic': 'ajo', 'carrot': 'zanahoria', 'potato': 'papa', 'oil': 'aceite',
  'salt': 'sal', 'pepper': 'pimienta', 'sugar': 'azúcar', 'water': 'agua',
  'flour': 'harina', 'butter': 'mantequilla', 'vinegar': 'vinagre',
  
  // Verbos de cocina
  'chop': 'picar', 'slice': 'cortar', 'dice': 'cortar en cubos', 'mix': 'mezclar',
  'stir': 'revolver', 'whisk': 'batir', 'beat': 'batir', 'blend': 'licuar',
  'fry': 'freír', 'sauté': 'saltear', 'boil': 'hervir', 'simmer': 'cocinar a fuego lento',
  'bake': 'hornear', 'roast': 'asar', 'grill': 'aspar', 'steam': 'cocinar al vapor',
  'marinate': 'marinar', 'season': 'sazonar', 'serve': 'servir', 'add': 'agregar',
  
  // Medidas
  'cup': 'taza', 'teaspoon': 'cucharadita', 'tablespoon': 'cucharada',
  'ounce': 'onza', 'pound': 'libra', 'gram': 'gramo', 'kilogram': 'kilogramo',
  'pinch': 'pizca', 'slice': 'rebanada', 'piece': 'pieza'
};

// Traducción con diccionario
const translateWithDictionary = (text) => {
  if (!text || typeof text !== 'string') return text || '';
  
  let result = text;
  for (const [english, spanish] of Object.entries(culinaryDictionary)) {
    const regex = new RegExp(english, 'gi');
    result = result.replace(regex, spanish);
  }
  
  return result;
};

// Las 3 APIs en orden fijo
const APIS = [
  {
    name: 'MyMemory',
    translate: async (text) => {
      try {
        const encodedText = encodeURIComponent(text);
        const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|es`;
        
        const response = await fetch(url);
        if (!response.ok) return null;
        
        const data = await response.json();
        const translated = data.responseData?.translatedText;
        
        if (translated) {
          return translated
            .replace(/%20/g, ' ')
            .replace(/%2C/g, ',')
            .replace(/%3A/g, ':')
            .replace(/<[^>]*>/g, '')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/\s+/g, ' ')
            .trim();
        }
        return null;
      } catch (error) {
        return null;
      }
    }
  },
  
  {
    name: 'LibreTranslate',
    translate: async (text) => {
      try {
        const response = await fetch('https://translate.argosopentech.com/translate', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            q: text, 
            source: 'en', 
            target: 'es',
            format: 'text'
          })
        });
        
        if (!response.ok) return null;
        
        const data = await response.json();
        return data.translatedText || null;
        
      } catch (error) {
        return null;
      }
    }
  },
  
  {
    name: 'GoogleTranslate',
    translate: async (text) => {
      try {
        const encodedText = encodeURIComponent(text);
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodedText}`;
        
        const response = await fetch(url);
        if (!response.ok) return null;
        
        const data = await response.json();
        const translated = data?.[0]?.map(item => item[0]).join('') || null;
        return translated;
        
      } catch (error) {
        return null;
      }
    }
  }
];

// Sistema simple de rotación
let currentApiIndex = 0;

// Función para traducir texto
const translateText = async (text) => {
  if (!text || text.trim().length === 0) return text;
  
  const cleanText = text.trim();
  
  // Si el texto es muy corto, usar solo diccionario
  const wordCount = cleanText.split(/\s+/).length;
  if (wordCount <= 3) {
    return translateWithDictionary(cleanText);
  }
  
  // Intentar con cada API en orden
  for (let attempt = 0; attempt < APIS.length; attempt++) {
    const api = APIS[currentApiIndex];
    currentApiIndex = (currentApiIndex + 1) % APIS.length;
    
    try {
      const result = await Promise.race([
        api.translate(cleanText),
        new Promise(resolve => setTimeout(() => resolve(null), 5000))
      ]);
      
      if (result) {
        return result;
      }
      
    } catch (error) {
      console.log(`❌ ${api.name} falló`);
    }
  }
  
  // Si todas fallan, usar diccionario
  return translateWithDictionary(cleanText);
};

// Función principal
export const translateRecipe = async (recipe) => {
  if (!recipe) return recipe;
  
  const cacheKey = `recipe_${recipe.id}_translated`;
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {}
  
  console.log('🔄 Traduciendo:', recipe.nombre);
  
  const baseTranslation = {
    ...recipe,
    nombre: translateWithDictionary(recipe.nombre || ''),
    categoria: translateWithDictionary(recipe.categoria || ''),
    area: translateWithDictionary(recipe.area || ''),
    ingredientes: (recipe.ingredientes || []).map(ing => ({
      ...ing,
      cantidad: translateWithDictionary(ing.cantidad || ''),
      producto: translateWithDictionary(ing.producto || '')
    }))
  };
  
  const translatedSteps = [];
  const pasos = recipe.pasos || [];
  
  for (let i = 0; i < pasos.length; i++) {
    const paso = pasos[i];
    const translatedPaso = await translateText(paso);
    translatedSteps.push(translatedPaso);
    
    if (i < pasos.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 400));
    }
  }
  
  const finalRecipe = {
    ...baseTranslation,
    pasos: translatedSteps
  };
  
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(finalRecipe));
  } catch (error) {}
  
  return finalRecipe;
};