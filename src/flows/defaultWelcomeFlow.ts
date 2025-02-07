import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

export const defaultWelcome = addKeyword<Provider, Database>(utils.setEvent('DEFAULT_WELCOME'))
.addAnswer(`Hola 👋, Te Saluda Luis de la Academia Kallpa, para atenderl@ con prontitud elija una de las opciones?
\n
*1. Desea información por WhatsApp?*
*2. Desea que lo llamemos por celular 📱?*\n
☝️ *Recuerda escribirme el número de tu elección para poder ayudarte.*👆🏻😁
\n
Contáctanos al 902937359 o visítanos en Av. Talara 450 Jesús Maria`, { capture: true }, async (ctx, { endFlow, flowDynamic }) => {
   console.log(ctx.body)
    if (ctx.body == "2") {
        return endFlow("Muchas Gracias por su respuesta 😁, ya la hemos agendado, en breve nos comunicamos desde este número 902937359.\n 👀 Gracias x contactarnos 😁");
    } else {
        await flowDynamic(`*Hola Soy Luis👋, Entrenador de KALLPA Triatlon*`)
        await flowDynamic(`Ya estamos matriculando para Marzo
Sede Jesús Maria
Nuestros Horarios 😎 2025
👉 *Adultos*

*Martes, Jueves y Sábados*

- 06 am Nivel Cero, Básico I, II y III
- 07 am Clase Personalizadas
- 09 pm Nivel Cero, Basicos I, II y III
NOTA: Los Sábados las clases son a las 2pm

*Lunes, Miércoles y Viernes*

- 06 am Nivel Intermedio, Avanzados, Basicos III
- 07am Nivel Cero, Básico I, Básico II y III
- 09 pm Nivel Intermedio y Avanzados y Basicos III

*Horarios Menores - Acuatlon*
Correr 🏃& Nadar 🏊
Sábado y Domingo
Entrenamiento dura 2 horas
Sábado 1pm
Domingo 8am
☝️Este curso tiene un costo de  S/. 280 (para alumnos de la selección S/. 200)

👛 *INVERSION*
🪙 PAQUETE DE 12 CLASES
- S/ 320
- *OFERTA 2 meses* x S/ 570

🪙 PAQUETE DE 08 CLASES
- S/ 260
- *OFERTA 2 meses* x S/ 490

🪙 *CLASES Personalizadas*
- S/ 60 x hora
- Dscto por 8 o 12 sesiones

*Si eres alumno de natación, lleva tu potencial a otro nivel a nuestro Gym, por tan solo S/ 60 soles adicionales.*

🤔 ¿Tiene alguna duda o consulta adicional? 🤔

*Kallpa, Hallamos tu Fortaleza* 🏊🏾‍♂️🚴🏾‍♂️🏃🏼‍♂️🏋🏼‍♀️🏆`);
    }
})
