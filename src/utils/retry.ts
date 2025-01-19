export const fetchWithRetry = async (
    fetchFunction: () => Promise<Response>, // Función para realizar la solicitud
    options = { retries: 4, minTimeout: 2000, factor: 2 } // Configuración de reintentos
) => {
    const { retries, minTimeout, factor } = options;

    let attempt = 0; // Contador de intentos

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); // Función para esperar

    while (attempt <= retries) {
        try {
            console.log(`Intento ${attempt + 1}/${retries + 1}`);
            const response = await fetchFunction();

            // Verificar si la solicitud fue exitosa
            if (!response.ok) {
                // Si el error es 4xx, no reintentar y devolver el error
                if (response.status >= 400 && response.status < 500) {
                    const errorResponse = await response.json();
                    return {
                        type: "ERROR",
                        message: `${
                            errorResponse.message || "Error desconocido"
                        }`,
                        error: errorResponse,
                    };
                }

                // Si el error no es 4xx, lanzar para reintentar
                throw new Error(`HTTP Error ${response.status}`);
            }

            // Si la solicitud fue exitosa, retornar el resultado
            const data = await response.json();
            return {
                type: "SUCCESS",
                message: "Solicitud procesada correctamente",
                data,
            };
        } catch (error: any) {
            attempt++;
            console.error(`Error en intento ${attempt}: ${error.message}`);

            if (attempt > retries) {
                // Si excedimos el número de intentos, lanzamos el error final
                return {
                    type: "ERROR",
                    message: "Error al procesar la solicitud",
                    error: error.message,
                };
            }

            // Esperar antes del siguiente intento
            const timeout = minTimeout * Math.pow(factor, attempt - 1);
            console.log(`Esperando ${timeout}ms antes del próximo intento...`);
            await delay(timeout);
        }
    }
};