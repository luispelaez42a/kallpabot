export function isImageMimeType(mimeType) {
    // Valida cualquier MIME type que comience con "image/"
    return mimeType ? /^image\/.+$/.test(mimeType) : false;
  }

export const MEDIA_COMMAND = "@bot media"
export const DEFAULT_ERROR_MESSAGE_BOT = "❌ Problemas entendiendo lo que me comentas ¿Podrías repetirlo? \n *Ingresa @bot rm*"

export function isDefaultUser(from: string): boolean {
  return from.includes("51947144701");
}

export function cleanJSON(rawBody: string): any {
  try {
      const cleanedString = rawBody
          .replace(/`/g, '') // Elimina todas las comillas invertidas
          .replace(/^\s*json\s*/i, '') // Elimina el prefijo "json " al inicio (si existe)
          .trim(); // Elimina espacios adicionales al inicio y al final  

      return JSON.parse(cleanedString); // Intenta convertirlo en un objeto JSON
  } catch (error) {
      console.error('Error parsing JSON:', error);
      return null; // Devuelve null si no es un JSON válido
  }
}

export function cleanJSONString(rawBody: string): any {
  try {
    return rawBody
          .replace(/`/g, '') // Elimina todas las comillas invertidas
          .replace(/^\s*json\s*/i, '') // Elimina el prefijo "json " al inicio (si existe)
          .trim(); // Elimina espacios adicionales al inicio y al final  
  } catch (error) {
      console.error('Error parsing JSON:', error);
      return null; // Devuelve null si no es un JSON válido
  }
}

export function mergeJSON(a: any, b: any): any {
    if (!a) return b;
    if (!b) return a;

    if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) {
        return a; // Si alguno no es un objeto, retorna `a` sin cambios
    }

    for (const key in b) {
        if (b[key] !== undefined) {
            a[key] = b[key]; // Copia el valor de `b` a `a`
        }
    }

    return a; // Retorna el objeto `a` actualizado
}
