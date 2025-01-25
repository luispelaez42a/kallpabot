export function isImageMimeType(mimeType) {
    // Valida cualquier MIME type que comience con "image/"
    return mimeType ? /^image\/.+$/.test(mimeType) : false;
  }

export const TRANSACTION_MULTIMEDIA_PROMPT = `Analiza y clasifica la siguiente transacción utilizando la descripción: '{prompt}' y los datos extraídos automáticamente desde la imagen. Sigue estas reglas:
              Clasifica action como 'INCOME' (ingreso) o 'EXPENSE' (egreso).
              Para type, selecciona uno de los valores permitidos: ['PROFESSOR_PAYMENT' (Pago Profesor), 'PRODUCT_SALE'(Venta Producto), 'SERVICE_PAYMENT'(Pago de Servicios), 'OTHER'].
              Para productType, selecciona uno de los valores permitidos: ['POWERADE', 'SAN_MARCOS', 'FRUGOS', 'GATORADE', 'SUEROX', 'OTHER'] estos valores los puedes inferir de description
              Asegúrate de extraer correctamente los siguientes campos desde el texto extraído:
              amount: monto en formato numérico (ej. 2.50).
              description: Colocar en el campo description: '{prompt}' 
              date: fecha estandarizada en formato ISO 8601 ('yyyy-MM-ddTHH:mm:ss').
              operation_number: número de operación de la transacción, si está disponible.
              payment_method: selecciona uno de los valores permitidos: ['YAPE', 'PLIN', 'CASH', 'BANK_TRANSFER', 'OTHER'].
              Responde con un JSON estructurado.

              Ejemplo de salida esperada:
              {
                "amount": 2.50,
                "action": "EXPENSE",
                "type": "PROFESSOR_PAYMENT",
                "productType": "POWERADE",
                "description": "Ingreso Pago",
                "date": "2025-01-14T09:04:00",
                "operation_number": "008",
                "payment_method": "YAPE"
              }
              Si algún campo no está disponible, márcalo como null en el JSON.`


export const TRANSACTION_TEXT_PROMPT = `Analiza y clasifica la siguiente transacción utilizando la descripción proporcionada por el usuario: '{prompt}'. Sigue estas reglas:
Clasifica action como 'INCOME' (ingreso) o 'EXPENSE' (egreso).
Para type, selecciona uno de los valores permitidos: ['PROFESSOR_PAYMENT' (Pago Profesor), 'PRODUCT_SALE'(Venta Producto), 'SERVICE_PAYMENT'(Pago de Servicios), 'OTHER'].
Para productType, selecciona uno de los valores permitidos: ['POWERADE', 'SAN_MARCOS', 'FRUGOS', 'GATORADE', 'SUEROX', 'OTHER'] estos valores los puedes inferir de description
Asegúrate de extraer correctamente los siguientes campos desde el texto extraído:
amount: monto en formato numérico (ej. 2.50).
description: Colocar en el campo description la descripción del usuario
date: fecha estandarizada en formato ISO 8601 ('yyyy-MM-ddTHH:mm:ss').
operation_number: número de operación de la transacción, si está disponible.
payment_method: selecciona uno de los valores permitidos: ['YAPE', 'PLIN', 'CASH', 'BANK_TRANSFER', 'OTHER'].
Responde con un JSON estructurado, NO agregues formato o prefijos adicionales solo el payload.

Ejemplo de salida esperada:
{
"amount": 2.50,
"action": "EXPENSE",
"type": "PROFESSOR_PAYMENT",
"productType": "POWERADE",
"description": "Pago realizado Luis",
"date": "2025-01-14T09:04:00",
"operation_number": "008",
"payment_method": "YAPE"
}
Si algún campo no está disponible, márcalo como null en el JSON.`              