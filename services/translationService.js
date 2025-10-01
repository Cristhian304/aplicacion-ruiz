// services/translationService.js - VERSIÓN COMPLETA CON DICCIONARIO INTEGRADO
import AsyncStorage from '@react-native-async-storage/async-storage';

const MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';

// DICCIONARIO COMPLETO DE TÉRMINOS CULINARIOS (integrado en el mismo archivo)
const culinaryDictionary = {
  // 🍳 Técnicas de cocina
  'bake': 'hornear', 'baked': 'horneado', 'baking': 'horneando',
  'boil': 'hervir', 'boiled': 'hervido', 'boiling': 'hirviendo',
  'fry': 'freír', 'fried': 'frito', 'frying': 'friendose',
  'grill': 'asar a la parrilla', 'grilled': 'a la parrilla',
  'roast': 'asar', 'roasted': 'asado',
  'steam': 'cocinar al vapor', 'steamed': 'al vapor',
  'stew': 'guisar', 'stewed': 'guisado',
  'simmer': 'cocer a fuego lento', 'simmering': 'cociendo a fuego lento',
  'saute': 'saltear', 'sauteed': 'salteado',
  'whisk': 'batir', 'whisked': 'batido', 'whisking': 'batiendo',
  'stir': 'revolver', 'stirred': 'revolviendo', 'stirring': 'revolviendo',
  'mix': 'mezclar', 'mixed': 'mezclado', 'mixing': 'mezclando',
  'blend': 'licuar', 'blended': 'licuado', 'blending': 'licuando',
  'knead': 'amasar', 'kneaded': 'amasado', 'kneading': 'amasando',
  'fold': 'incorporar', 'folded': 'incorporado', 'folding': 'incorporando',
  'dice': 'cortar en cubos', 'diced': 'en cubos',
  'chopped': 'picado', 'chop': 'picar', 'chopping': 'picando',
  'slice': 'cortar en rodajas', 'sliced': 'en rodajas',
  'mince': 'picar fino', 'minced': 'picado fino',
  'grate': 'rallar', 'grated': 'rallado', 'grating': 'rallando',
  'peel': 'pelar', 'peeled': 'pelado', 'peeling': 'pelando',
  'crush': 'machacar', 'crushed': 'machacado',
  'mash': 'hacer puré', 'mashed': 'en puré',
  'season': 'sazonar', 'seasoned': 'sazonado', 'seasoning': 'sazonando',
  'garnish': 'decorar', 'garnished': 'decorado',
  'preheat': 'precalentar', 'preheated': 'precalentado',

  // 🍖 Carnes
  'beef': 'carne de res', 'chicken': 'pollo', 'pork': 'cerdo',
  'lamb': 'cordero', 'veal': 'ternera', 'turkey': 'pavo',
  'duck': 'pato', 'bacon': 'tocino', 'ham': 'jamón',
  'sausage': 'salchicha', 'steak': 'bistec', 
  'ground beef': 'carne molida', 'minced meat': 'carne picada',
  'ribs': 'costillas', 'breast': 'pechuga', 'thigh': 'muslo',
  'wing': 'ala', 'leg': 'pierna', 'fillet': 'filete', 'loin': 'lomo',

  // 🐟 Pescados
  'fish': 'pescado', 'salmon': 'salmón', 'tuna': 'atún',
  'cod': 'bacalao', 'trout': 'trucha', 'sardine': 'sardina',
  'shrimp': 'camarón', 'prawn': 'gamba', 'crab': 'cangrejo',
  'lobster': 'langosta', 'mussel': 'mejillón', 'clam': 'almeja',
  'squid': 'calamar', 'octopus': 'pulpo', 'seafood': 'mariscos',

  // 🥦 Vegetales
  'vegetable': 'vegetal', 'vegetables': 'vegetales',
  'onion': 'cebolla', 'garlic': 'ajo', 'tomato': 'tomate',
  'potato': 'papa', 'carrot': 'zanahoria', 'bell pepper': 'pimiento',
  'chili': 'chile', 'mushroom': 'champiñón', 'spinach': 'espinaca',
  'lettuce': 'lechuga', 'cabbage': 'repollo', 'broccoli': 'brócoli',
  'cauliflower': 'coliflor', 'celery': 'apio', 'cucumber': 'pepino',
  'zucchini': 'calabacín', 'eggplant': 'berenjena', 'asparagus': 'espárrago',
  'corn': 'maíz', 'pea': 'guisante', 'bean': 'frijol',
  'green bean': 'ejote', 'avocado': 'aguacate', 'olive': 'aceituna',

  // 🍎 Frutas
  'apple': 'manzana', 'banana': 'plátano', 'orange': 'naranja',
  'lemon': 'limón', 'lime': 'lima', 'strawberry': 'fresa',
  'grape': 'uva', 'watermelon': 'sandía', 'melon': 'melón',
  'pineapple': 'piña', 'mango': 'mango', 'peach': 'durazno',

  // 🧀 Lácteos
  'milk': 'leche', 'cheese': 'queso', 'butter': 'mantequilla',
  'cream': 'crema', 'yogurt': 'yogur', 'egg': 'huevo', 'eggs': 'huevos',

  // 🌾 Granos
  'rice': 'arroz', 'pasta': 'pasta', 'spaghetti': 'espagueti',
  'bread': 'pan', 'flour': 'harina', 'oat': 'avena',

  // 🧂 Condimentos
  'salt': 'sal', 'pepper': 'pimienta', 'sugar': 'azúcar',
  'oil': 'aceite', 'olive oil': 'aceite de oliva',
  'vinegar': 'vinagre', 'soy sauce': 'salsa de soya',
  'basil': 'albahaca', 'oregano': 'orégano', 'thyme': 'tomillo',
  'parsley': 'perejil', 'cilantro': 'cilantro', 'cumin': 'comino',

  // 🍽️ Utensilios
  'oven': 'horno', 'stove': 'estufa', 'pan': 'sartén',
  'pot': 'olla', 'bowl': 'tazón', 'knife': 'cuchillo',

  // 📝 Términos
  'recipe': 'receta', 'ingredient': 'ingrediente', 
  'direction': 'instrucción', 'step': 'paso',
  'serving': 'porción', 'preparation': 'preparación',

  // 🥄 Medidas
  'cup': 'taza', 'teaspoon': 'cucharadita', 'tablespoon': 'cucharada',
  'ounce': 'onza', 'pound': 'libra', 'gram': 'gramo',
  'pinch': 'pizca', 'clove': 'diente',

  // 🍲 Platos
  'appetizer': 'entrada', 'main course': 'plato principal',
  'dessert': 'postre', 'soup': 'sopa', 'salad': 'ensalada',
  'sauce': 'salsa', 'pizza': 'pizza', 'pasta': 'pasta',
  'burger': 'hamburguesa', 'taco': 'taco', 'sushi': 'sushi',

  // 🔥 Métodos
  'bake': 'hornear', 'fry': 'freír', 'grill': 'asar',
  'roast': 'asar', 'saute': 'saltear', 'simmer': 'hervir a fuego lento',

  // 📍 Conectores
  'and': 'y', 'or': 'o', 'with': 'con', 'without': 'sin',
  'in': 'en', 'on': 'en', 'to': 'a', 'for': 'para',
  'of': 'de', 'from': 'de', 'by': 'por'
};

// Función para usar el diccionario
const translateWithDictionary = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let translatedText = text;
  
  // Buscar palabras completas en el diccionario
  for (const [english, spanish] of Object.entries(culinaryDictionary)) {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    translatedText = translatedText.replace(regex, spanish);
  }
  
  return translatedText;
};

// Función para decodificar textos con encoding URL
const decodeText = (text) => {
  if (!text) return text;
  try {
    return decodeURIComponent(text.toString().replace(/\+/g, ' '));
  } catch (error) {
    return text.toString().replace(/%20/g, ' ').replace(/\+/g, ' ');
  }
};

// Función principal de traducción
export const translateText = async (text, targetLang = 'es') => {
  try {
    if (!text || text.trim() === '') return text;

    // DECODIFICAR EL TEXTO
    const cleanText = decodeText(text);
    if (cleanText.trim() === '') return cleanText;

    // PRIMERO USAR EL DICCIONARIO
    const dictionaryTranslation = translateWithDictionary(cleanText);
    
    // Si el diccionario hizo cambios, usarlo
    if (dictionaryTranslation !== cleanText) {
      console.log(`✅ Diccionario: "${cleanText.substring(0, 30)}..." -> "${dictionaryTranslation.substring(0, 30)}..."`);
      return dictionaryTranslation;
    }

    console.log(`🔤 API para: "${cleanText.substring(0, 30)}..."`);

    // Verificar cache
    const cacheKey = `trans_${cleanText}_${targetLang}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    
    if (cached) {
      console.log(`✅ Cache: "${cleanText.substring(0, 30)}..."`);
      return cached;
    }

    // Llamar a la API
    const response = await fetch(
      `${MYMEMORY_API_URL}?q=${encodeURIComponent(cleanText)}&langpair=en|${targetLang}`
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.responseData && data.responseData.translatedText) {
      let translated = data.responseData.translatedText;
      
      // Limpiar y mejorar con diccionario
      translated = cleanTranslation(translated);
      translated = translateWithDictionary(translated);
      
      console.log(`✅ Traducido: "${cleanText.substring(0, 30)}..." -> "${translated.substring(0, 30)}..."`);
      
      // Guardar en cache
      await AsyncStorage.setItem(cacheKey, translated);
      
      return translated;
    } else {
      return dictionaryTranslation;
    }
    
  } catch (error) {
    console.log('❌ Error, usando diccionario:', error.message);
    return translateWithDictionary(decodeText(text));
  }
};

// Función para traducir receta completa
export const translateRecipe = async (recipe) => {
  try {
    console.log('🚀 Traduciendo receta...');
    
    // DECODIFICAR RECETA
    const decodedRecipe = {
      ...recipe,
      nombre: decodeText(recipe.nombre),
      categoria: decodeText(recipe.categoria),
      area: decodeText(recipe.area),
      dificultad: decodeText(recipe.dificultad),
      ingredientes: recipe.ingredientes.map(ing => ({
        ...ing,
        cantidad: decodeText(ing.cantidad),
        producto: decodeText(ing.producto),
        indicacion: decodeText(ing.indicacion)
      })),
      pasos: recipe.pasos.map(paso => decodeText(paso))
    };
    
    // Traducir todo
    const translatedName = await translateText(decodedRecipe.nombre);
    
    const translatedIngredients = await Promise.all(
      decodedRecipe.ingredientes.map(async (ingrediente) => {
        const translatedProduct = await translateText(ingrediente.producto);
        const translatedCantidad = ingrediente.cantidad;
        const translatedIndicacion = ingrediente.indicacion ? 
          await translateText(ingrediente.indicacion) : '';
        
        return {
          ...ingrediente,
          cantidad: translatedCantidad,
          producto: translatedProduct,
          indicacion: translatedIndicacion
        };
      })
    );

    const translatedSteps = await Promise.all(
      decodedRecipe.pasos.map(async (paso) => {
        return await translateText(paso);
      })
    );

    const translatedCategory = decodedRecipe.categoria ? await translateText(decodedRecipe.categoria) : '';
    const translatedArea = decodedRecipe.area ? await translateText(decodedRecipe.area) : '';
    const translatedDifficulty = decodedRecipe.dificultad ? await translateText(decodedRecipe.dificultad) : '';

    console.log('✅ Traducción completada');
    
    return {
      ...decodedRecipe,
      nombre: translatedName,
      categoria: translatedCategory,
      area: translatedArea,
      dificultad: translatedDifficulty,
      ingredientes: translatedIngredients,
      pasos: translatedSteps
    };
    
  } catch (error) {
    console.log('❌ Error en traducción:', error);
    return {
      ...recipe,
      nombre: decodeText(recipe.nombre),
      categoria: decodeText(recipe.categoria),
      area: decodeText(recipe.area),
      dificultad: decodeText(recipe.dificultad),
      ingredientes: recipe.ingredientes.map(ing => ({
        ...ing,
        cantidad: decodeText(ing.cantidad),
        producto: decodeText(ing.producto),
        indicacion: decodeText(ing.indicacion)
      })),
      pasos: recipe.pasos.map(paso => decodeText(paso))
    };
  }
};

// Función para limpiar traducciones
const cleanTranslation = (text) => {
  if (!text) return text;
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
};