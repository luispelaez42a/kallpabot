import { CommandType } from "~/utils/commandInterpreter";
import { fetchWithRetry } from "~/utils/retry";

/**
 * Obtiene la lista de estudiantes
 * @returns { type, message, data } o { type, message, error }
 */
const getStudents = async () => {
    try {
        const response = await fetchWithRetry(() => fetch("https://kallpadmin.vercel.app/api/students"));
        return response;
    } catch (error: any) {
        console.error("Error al obtener estudiantes:", error.message);
        return {
            type: CommandType.ERROR,
            message: "Error al procesar la solicitud",
            error: error.message,
        };
    }
};

/**
 * Agrega un estudiante
 * @param state 
 * @returns { type, message, data } o { type, message, error }
 */
const saveStudent = async (state: { payload: object }) => {
    try {
        console.log("Procesando registro del estudiante...");
        console.log(JSON.stringify(state.payload))
        const response = await fetchWithRetry(() =>
            fetch("https://kallpadmin.vercel.app/api/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(state.payload),
            })
        );
        console.log("===Respondio");
        console.log(response);
        return response;
    } catch (error: any) {
        console.error("Error al registrar estudiante:", error.message);
        return {
            type: CommandType.ERROR,
            message: "Registro Fallido, intenta nuevamente",
            error: error.message,
        };
    }
};

export { getStudents, saveStudent };