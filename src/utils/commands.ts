// Importa las dependencias de cada flujo
import { registerStudent } from '../flows/registerStudent';
import { listStudents } from '../flows/listStudents';
//import { sellProductFlow } from '../flows/sellProduct';
//import { renewStudentFlow } from '../flows/renewStudent';
import { listCommands } from '../flows/listCommands';
import { registerMovement } from '~/flows/registerMovement';

export const validCommands = {
  registrarAlumno: registerStudent,
  listarAlumnos: listStudents,
  registrarProducto: null,
  renovarAlumno: null,
  ventaProducto: null,
  listar: listCommands,
  registrarMovimiento: registerMovement,
  rm: registerMovement,
};
