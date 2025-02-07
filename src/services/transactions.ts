import { CommandType, translateTransactionType } from "~/utils/commandInterpreter";
import { fetchWithRetry } from "~/utils/retry";

/**
 * Registra una transacción
 * @param state 
 * @returns { type, message, data } o { type, message, error }
 */
const saveTransaction = async (payload: string) => {
    try {
        console.log("Procesando registro de la transacción...");
        console.log(payload);
        const response = await fetchWithRetry(() =>
            fetch("https://kallpadmin.vercel.app/api/transactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: payload,
            })
        );

        if(response.type== CommandType.ERROR)
            return response;

        console.log("===Respondió");
        console.log(response);
        return {
            type: CommandType.SUCCESS,
            message: `✅ Listo!! \n Registramos tu transacción N° *${response?.data?.code}* \n *${response?.data?.description}* \n como *${translateTransactionType(response?.data?.action)}* con monto: *${response?.data?.amount}* de forma exitosa`,
            payload: response
        };
    } catch (error: any) {
        console.error("❌ Error al registrar transacción:", error.message);
        return {
            type: CommandType.ERROR,
            message: "❌ Registro fallido, intenta nuevamente",
            error: error.message,
        };
    }
};

/**
 * Obtiene todas las transacciones
 * @returns { type, message, data } o { type, message, error }
 */
const getTransactions = async () => {
    try {
        console.log("Obteniendo transacciones...");
        const response = await fetchWithRetry(() =>
            fetch("https://kallpadmin.vercel.app/api/transactions", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
        );
        console.log("===Respondió");
        console.log(response);
        return {
            type: CommandType.SUCCESS,
            payload: response
        };
    } catch (error: any) {
        console.error("Error al obtener transacciones:", error.message);
        return {
            type: CommandType.ERROR,
            message: "Error al obtener transacciones, intenta nuevamente",
            error: error.message,
        };
    }
};

export { getTransactions, saveTransaction };
