import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

export const defaultWelcome = addKeyword<Provider, Database>(utils.setEvent('DEFAULT_WELCOME'))
.addAnswer(`Hola 👋, Te Saluda Luis de la Academia Kallpa, tenemos estas opciones para ti:

1. Desea información Natación
2. Desea información Bunker GymBox (Gimnasio Funcional)
3. Desea información Balance Food(Comida Saludable)\n
☝️ *Recuerda escribirme solo el número de tu elección para poder ayudarte.*👆🏻
\n
Contáctanos al 902937359 o visítanos en Av. Talara 450 Jesús Maria`, { capture: true }, async (ctx, { gotoFlow, fallBack }) => {
   console.log(ctx.body)
    if (ctx.body.includes("1")) {
        await gotoFlow(swimmingInfo);
    } else if (ctx.body.includes("2")) {
        await gotoFlow(gymInfo);
    } else if (ctx.body.includes("3")) {
        await gotoFlow(balanceFoodInfo);
    } else {
        return fallBack(`No pude entenderte, recuerda colocar solo el número de tu opción favorita 😁
            1. Desea información Natación
            2. Desea información Bunker GymBox (Gimnasio Funcional)
            3. Desea información Balance Food(Comida Saludable)\n
☝️ *Recuerda escribirme solo el número de tu elección para poder ayudarte.*👆🏻`)
    }
})

export const gymInfo = addKeyword<Provider, Database>(utils.setEvent('GYM_INFO'))
.addAnswer(`📢 ¡Entrena con Nosotros! 🏋️‍♂️🔥

Somos un gimnasio funcional donde recibirás:
✅ Trainer dedicado para guiarte en cada sesión
✅ Grupos limitados para mayor atención personalizada
✅ Tú escoges tus horarios (Mañana 6am - 9pm)
✅ Asesoría nutricional para potenciar tus resultados
✅ Seguimiento a tu progreso para que alcances tus metas

💪 Promos Especiales:
🔥 Opción 1: 2 meses + 1 mes GRATIS por S/249 (antes S/380)
🔥 Opción 2: 5 meses + 1 mes GRATIS + 15 días de congelamiento por S/349 (antes S/480)

💳 Válido solo con YAPE o PLIN 📲🥳

💰 Promoción adicional:
✅ 1er mes: S/19.90
✅ 2do mes: S/109.90
✅ Desde el 3er mes: Mantenimiento de S/99 (puedes cancelar antes)

📅 Opciones de pago:
🔹 Plan anual 📆
🔹 Afiliación a débito automático mes a mes 💳
`, { capture: true }, async (ctx, { gotoFlow, endFlow }) => {
//await gotoFlow();
return endFlow(`Perfecto 😁, para cerrar la matrícula déjame tus datos (Nombre Completo, Edad y confírmame el curso).
    Puede hacer el pago de forma presencial en Av Talara 450, o enviarnos el voucher de pago a este número vía yape/plin 955882306 \n `);
})

export const balanceFoodInfo = addKeyword<Provider, Database>(utils.setEvent('BALANCE_FLOW'))
.addAnswer(`🥗 ¡Almuerzos Balanceados y Saludables! 🍽️✨

Disfruta de comidas ricas y equilibradas, diseñadas según tu objetivo:
💪 Aumento muscular o 🔥 Reducción de grasa

📦 Incluye:
✅ Almuerzo según tu meta (400-600 cal)
✅ Snack de media mañana 🍏
✅ Hidratación detox o digestiva 🥤

📅 Planes disponibles:
📍 Diario: S/15.00
📍 Semanal (L-V): S/72.50
📍 2 semanas (L-V): S/145.00
📍 Mensual (20 almuerzos): S/284.00

💡 ¡Solo dinos tu objetivo y nosotros nos encargamos del resto! 🍽️🔥`, { capture: true }, async (ctx, { endFlow, flowDynamic }) => {
   console.log(ctx.body)
   return endFlow();
})


export const swimmingInfo = addKeyword<Provider, Database>(utils.setEvent('SWIMMING_FLOW'))
.addAnswer(`¿Las clases de natación son para adulto o menor?
    1. Si serán para un adulto
    2. Es para un menor
`, { capture: true }, async (ctx, { gotoFlow, flowDynamic, fallBack }) => {
    if (ctx.body.includes("1")) {
        return gotoFlow(swimmingAdultInfo);
    }
    else if (ctx.body.includes("2")) {
        await flowDynamic(`🌊 ¡Diversión y aprendizaje en el agua con Kallpa Triatlón! 🏊‍♂️👦✨

            Clases de natación para niños desde 5 años en Jesús María 🏅:
            
            📍 Piscina Círculo Militar
            🔹 Lunes, Miércoles y Viernes: 6:00 PM | 7:00 PM
            🔹 Sábados: 1:00 PM
            
            📍 Piscina Teresa González Fanning
            🔹 Domingos: 10:00 AM
            
            👦 Ambiente seguro y divertido con entrenadores especializados.
            
            📲 ¡Inscríbelo hoy!
            📞 902937359 | 955882306
            📍 Te esperamos en Av. Talara 450, Jesús María.
            
            ¡Que tu peque disfrute y aprenda en el agua! 🚀💦`);
    }
    else {
        return fallBack("No pude entenderte, recuerda colocar solo el número de tu opción favorita 😁")
    }
})

 export const swimmingAdultInfo = addKeyword<Provider, Database>(utils.setEvent('SWIMMING_FLOW'))
.addAnswer(`¿Empezará de cero o ya sabe nadar (Mín 25 mts seguidos)? 
    1. De cero
    2. Ya sé nadar
`, { capture: true }, async (ctx, { endFlow, flowDynamic, fallBack }) => {
    console.log(ctx.body)
    if (ctx.body.includes("1")) {
        await flowDynamic(`🌊 ¡Sumérgete en la experiencia Kallpa Triatlón! 🏊‍♂️✨

        Te presento nuestros horarios de clases de natación en Jesús María para niveles Básico I, II e Inicial:

        📍 Piscina Círculo Militar
        🔹 Lunes, Miércoles y Viernes: 7:00 AM | 7:00 PM
        🔹 Martes y Jueves: 6:00 AM | 7:00 AM | 9:00 PM

        📍 Piscina Teresa González Fanning
        🔹 Martes y Jueves: 9:00 PM
        🔹 Sábados: 2:00 PM
        🔹 Domingos: 9:00 AM

        🌟 Grupos reducidos y entrenadores especializados para que avances con confianza.

        📲 ¡Reserva tu cupo ahora!
        📞 902937359 | 955882306
        📍 Te esperamos en Av. Talara 450, Jesús María.

        ¡No pierdas la oportunidad de mejorar tu técnica y disfrutar del agua! 🚀💦`);
        return endFlow();
    } else if (ctx.body.includes("2")) {
        await flowDynamic(`🌊 ¡Lleva tu natación al siguiente nivel con Kallpa Triatlón! 🏊‍♂️🔥

Clases para niveles Intermedios y Avanzados en Jesús María:

📍 Piscina Círculo Militar
🔹 Lunes, Miércoles y Viernes: 6:00 AM - 7:00 AM
🔹 Martes y Jueves: 6:00 AM - 7:00 AM

📍 Piscina Teresa González Fanning
🔹 Lunes, Miércoles y Viernes: 9:00 PM - 10:00 PM

🌊 Natación en el Mar 🌅
🔹 Sábados: 7:00 AM (playas variadas)

💪 Mejora tu resistencia, técnica y velocidad con entrenadores especializados.

📲 ¡Reserva tu cupo hoy!
📞 902937359 | 955882306
📍 Te esperamos en Av. Talara 450, Jesús María.

¡Prepárate para desafiar tus límites en el agua! 🚀💦`);
        return endFlow();
    } else {
        return fallBack("No pude entenderte, recuerda colocar solo el número de tu opción favorita 😁")
    }
 })



