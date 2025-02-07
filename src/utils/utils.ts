export function isImageMimeType(mimeType) {
    // Valida cualquier MIME type que comience con "image/"
    return mimeType ? /^image\/.+$/.test(mimeType) : false;
  }

const actualYear = new Date(). getFullYear();

export const TRANSACTION_MULTIMEDIA_PROMPT = `Somos una academia deportiva, Analiza y clasifica la siguiente transacción utilizando la descripción: '{prompt}' y los datos extraídos automáticamente desde la imagen. Sigue estas reglas:
              action: Identifica de la descripción si dice Ingreso o Egreso. Selecciona uno de los valores permitidos: ['INCOME', 'EXPENSE'].
                "INCOME": Ingreso de dinero. Esto incluye: ventas de productos, matrículas.
                "EXPENSE": Salida de dinero. Esto incluye: pagos a profesores, pagos de servicios (luz, agua, internet, etc.), compra de insumos.
              type: selecciona uno de los valores permitidos: ['ENROLLMENT' (Registro de Matrículas), 'PROFESSOR_PAYMENT' (Pago Profesor), 'PRODUCT_SALE'(Venta Producto), 'SERVICE_PAYMENT'(Pago de Servicios), 'OTHER'].
              productType: selecciona uno de los valores permitidos: ['POWERADE', 'SAN_MARCOS', 'FRUGOS', 'GATORADE', 'SUEROX', 'OTHER'] estos valores los puedes inferir de description
              amount: monto en formato numérico (ej. 2.50).
              description: Colocar siempre: '{prompt}'
              phone_origin: Colocar siempre '{phone_origin}' 
              date: fecha estandarizada en formato ISO 8601 ('yyyy-MM-ddTHH:mm:ss').
              operation_number: número de operación de la transacción, si está disponible.
              payment_method: selecciona uno de los valores permitidos: ['YAPE', 'PLIN', 'CASH', 'BANK_TRANSFER', 'OTHER'].
              
              Responde con un JSON estructurado

             Ejemplo de salida esperada (INCOME - Matrícula):
              {
                "amount": 150.00,
                "action": "INCOME",
                "type": "ENROLLMENT",
                "productType": null,
                "description": "Ingreso matrícula de Olga Fernández natación",
                "date": "2024-10-27T10:30:00",
                "operation_number": "001",
                "payment_method": "BANK_TRANSFER",
                "phone_origin": "99"
              }

              Ejemplo de salida esperada (EXPENSE - Pago Profesor):
              {
                "amount": 500.00,
                "action": "EXPENSE",
                "type": "PROFESSOR_PAYMENT",
                "productType": null,
                "description": "Pago a profesor Juan Pérez por clases de natación",
                "date": "2025-10-26T16:45:00",
                "operation_number": "012",
                "payment_method": "BANK_TRANSFER",
                "phone_origin": "99"
              }
              Si algún campo no está disponible, márcalo como null en el JSON. En caso de la imagen no se proporcione el año es: ${actualYear}`

export const TRANSACTION_TEXT_PROMPT = `Analiza la siguiente transacción utilizando la descripción proporcionada por el usuario: '{prompt}'. Sigue estas reglas para asignar los campos al JSON a responder:
              action: Selecciona uno de los valores permitidos: ['INCOME', 'EXPENSE'].
              type: selecciona uno de los valores permitidos: ['ENROLLMENT' (Registro de Matrículas), 'PROFESSOR_PAYMENT' (Pago Profesor), 'PRODUCT_SALE'(Venta Producto), 'SERVICE_PAYMENT'(Pago de Servicios), 'OTHER'].
              productType: selecciona uno de los valores permitidos: ['POWERADE', 'SAN_MARCOS', 'FRUGOS', 'GATORADE', 'SUEROX', 'OTHER'] estos valores los puedes inferir de description
              amount: monto en formato numérico (ej. 2.50).
              description: Colocar siempre '{prompt}' 
              phone_origin: Colocar siempre '{phone_origin}' 
              date: fecha estandarizada en formato ISO 8601 ('yyyy-MM-ddTHH:mm:ss').
              operation_number: número de operación de la transacción, si está disponible.
              payment_method: selecciona uno de los valores permitidos: ['YAPE', 'PLIN', 'CASH', 'BANK_TRANSFER', 'OTHER'].
              Responde con un JSON estructurado.

              Ejemplo de salida esperada (INCOME - Matrícula):
              {
                "amount": 150.00,
                "action": "INCOME",
                "type": "ENROLLMENT",
                "productType": null,
                "description": "Ingreso matrícula de Olga Fernández natación",
                "date": "2024-10-27T10:30:00",
                "operation_number": "001",
                "payment_method": "YAPE",
                "phone_origin": "99"
              }

              Ejemplo de salida esperada (EXPENSE - Pago Profesor):
              {
                "amount": 500.00,
                "action": "EXPENSE",
                "type": "PROFESSOR_PAYMENT",
                "productType": null,
                "description": "Pago a profesor Juan Pérez por clases de natación",
                "date": "2024-10-26T16:45:00",
                "operation_number": "012",
                "payment_method": "BANK_TRANSFER",
                "phone_origin": "99"
              }
              Si algún campo no está disponible, márcalo como null en el JSON. En caso de la imagen no se proporcione el año es: ${actualYear}`              