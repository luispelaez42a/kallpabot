// Importa las dependencias de cada flujo
//import { registerStudent } from '../flows/registerStudent';
//import { listStudents } from '../flows/listStudents';
//import { sellProductFlow } from '../flows/sellProduct';
//import { renewStudentFlow } from '../flows/renewStudent';
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { registerMovement, registerMovementPendingDescription } from '~/flows/registerMovement';

export const listCommands = addKeyword<Provider, Database>(utils.setEvent('GET_COMMANDS'))
.addAction(async (_, { flowDynamic, state }) => {
   return await flowDynamic(`Comandos disponibles:\n *${Object.keys(validCommands).join('* \n *')}*`)
})

export const validCommands = {
 // registrarAlumno: registerStudent,
 // listarAlumnos: listStudents,
  registrarProducto: null,
  renovarAlumno: null,
  ventaProducto: null,
  listar: listCommands,
  registrarMovimiento: registerMovement,
  rm: registerMovement,
  media: registerMovementPendingDescription
};
