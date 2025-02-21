import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
//import { getStudents } from "~/services/students";
/*import { CommandType } from '~/utils/commandInterpreter';

export const listStudents = addKeyword<Provider, Database>(utils.setEvent('GET_STUDENTS_FLOW'))
.addAction(async (_, { flowDynamic, state }) => {
    console.log('ENTROOO GET STUDENTS')
    const response = await getStudents()
    console.log(JSON.stringify(response))

    if (response.type === CommandType.SUCCESS && Array.isArray(response.data)) {
        console.log('NO ENTROOO GET STUDENTS')

        for (const student of response.data) { // Itera solo si response.data es un arreglo
            await flowDynamic(`${JSON.stringify(student)}`); // Envía cada mensaje dinámicamente
        }
    } else {
        console.error('Error: Los datos obtenidos no son válidos o no es una lista.');
        await flowDynamic('No se pudo obtener la lista de estudiantes.');
    }
})*/
  