import { parse, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { validCommands } from './commands';
import { CommandType } from './commandEnum';

const validPrefixes = ['@bot', '@kbot'];

const transactionTypes = {
  INCOME: "Ingreso",
  EXPENSE: "Egreso"
};

export function translateTransactionType(type) {
  if (!type) return "transacción"; 
  return transactionTypes[type] || "transacción";
}

const parseDate = (input) => {
    const formats = [
      "EEEE d 'de' MMMM",      // lunes 16 de diciembre
      "d 'de' MMMM",           // 16 de diciembre
      "dd/MM/yyyy",            // 16/12/2025
      "dd-MM-yyyy",            // 16-12-2025
    ];
  
    let parsedDate = null;
  
    for (const formatStr of formats) {
      try {
        parsedDate = parse(input, formatStr, new Date(), { locale: es });
        // Validar que la fecha sea válida
        if (!isNaN(parsedDate)) break;
      } catch (error) {
        // Continúa intentando con otros formatos
      }
    }
  
    if (!parsedDate || isNaN(parsedDate)) {
      throw new Error(`Formato de fecha no reconocido: ${input}`);
    }
  
    return format(parsedDate, 'dd-MM-yyyy'); // Devuelve el formato deseado
};

// Valida si el prefijo es válido
export const validateCommand = (prefix) => validPrefixes.includes(prefix);
const shouldParse = (input) => {
    // Si la entrada contiene más de una línea, debe parsearse
    const lines = input.split('\n');
    return lines.length > 1 || /:/.test(input);
};
  
// Función para procesar el registro de alumnos
const parseStudentData = (args) => {
  const lines = args.split('\n');
  const validationErrors = [];
  const data = lines.reduce(
    (acc, line) => {
      const [key, ...valueParts] = line.split(':');
      const keyTrimmed = key.trim().toLowerCase();
      const value = valueParts.join(':').trim();

      switch (keyTrimmed) {
        case 'curso':
          acc.course = value;
          break;
        case 'nombre':
          acc.name = value;
          break;
        case 'nombre apoderado':
          acc.parentName = value;
          break;
        case 'telf apoderado':
          acc.parentPhone = value.replace(/\D/g, '');
          break;
        case 'dni':
          acc.dni = value.replace(/\D/g, '');
          break;
        case 'correo':
          acc.email = value;
          break;
        case 'turno':
          acc.schedule = value;
          break;
        case 'edad':
          acc.age = value ? parseInt(value.replace(/\D/g, ''), 10) : null;
          if (isNaN(acc.age)) validationErrors.push('La edad no es válida');
          break;
        case 'nivel':
          acc.level = value;
          break;
        case 'inicio':
          try {
            acc.courseStartDay = parseDate(value);
          } catch (error) {
            validationErrors.push('Fecha Inicio incorrecta');
          }
          break;
        case 'fin':
          try {
            acc.courseEndDay = parseDate(value);
          } catch (error) {
            validationErrors.push('Fecha Fin incorrecta');
          }
          break;
        case 'telf':
          acc.phone = value.replace(/\D/g, '');
          if (!/^\d+$/.test(acc.phone)) validationErrors.push('Teléfono inválido');
          break;
        case 'monto pagado':
          acc.amountCancelled = value.replace(/\D/g, '');
          break;
        case 'menor de edad':
          acc.isMinor = value.toLowerCase() === 'sí' || value.toLowerCase() === 'true';
          break;
        case 'registro sin capacidad':
          acc.haveToRegisterWithoutCapacity = value.toLowerCase() === 'sí' || value.toLowerCase() === 'true';
          break;
        default:
          acc.others.push({ key: keyTrimmed, value });
          break;
      }
      return acc;
    },
    {
      course: '',
      name: '',
      phone: '',
      courseStartDay: '',
      courseEndDay: '',
      age: null,
      parentName: '',
      parentPhone: '',
      level: '',
      email: '',
      dni: '',
      amountCancelled: '',
      isMinor: null,
      haveToRegisterWithoutCapacity: null,
      others: [],
    }
  );

  if (validationErrors.length > 0) {
    return {
      error: `Revisar el formato, presenta los siguientes errores: ${validationErrors.join(', ')}`,
    };
  }

  // Validar campos obligatorios
  const missingFields = [];
  if (!data.course) missingFields.push('Curso');
  if (!data.name) missingFields.push('Nombre');
  if (!data.courseStartDay) missingFields.push('Inicio del curso');
  if (!data.courseEndDay) missingFields.push('Fin del curso');
  if (data.isMinor==null && !data.age) missingFields.push('Edad');
  if (!data.phone && !data.dni) missingFields.push('Teléfono o DNI');

  if (missingFields.length > 0) {
    return {
      error: `Faltan campos obligatorios: ${missingFields.join(', ')}`,
    };
  }

  return { student: data };
};

type RenewAlumnoData = {
    curso?: string;
    id?: string;
    duracion?: string;
    otros?: { key: string; value: string }[];
  };

const parseRenewAlumno = (input) => {
    const data: RenewAlumnoData = {};
    const lines = input.split('\n');
  
    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      const keyTrimmed = key.trim().toLowerCase();
      const value = valueParts.join(':').trim();
  
      switch (keyTrimmed) {
        case 'curso':
          data.curso = value;
          break;
        case 'id':
          data.id = value.replace(/\D/g, ''); // Solo números para el ID
          break;
        case 'duración':
          data.duracion = value || '1 mes'; // Por defecto, 1 mes
          break;
        default:
          data.otros = data.otros || [];
          data.otros.push({ key: keyTrimmed, value });
      }
    });
  
    // Validación básica
    if (!data.curso || !data.id || !data.duracion) {
      throw new Error('Campos obligatorios: Curso, ID, Duración.');
    }
  
    return data;
};

export function splitInput(input:String) {
  return input.trim().split(/\s+/);
}

// Procesador de comandos
const processCommand = async function processCommand(input, isMultimedia = false) {
  // Divide la entrada en palabras
  const [prefix, command, ...args] = splitInput(input);

  // Validar el prefijo
  if (!validateCommand(prefix)) {
    return { type: CommandType.IGNORE, message: 'Prefijo No Válido' };
  }

  // Validar y ejecutar el comando
  if (validCommands[command]) {
    try {
      return {
        type: CommandType.SUCCESS,
        command: command,
        flow: validCommands[command]
      };
    } catch (error) {
      return { type: 'ERROR', message: `Error al ejecutar el comando ${command}: ${error.message}` };
    }
  }

  return {
    type: 'ERROR',
    message: `Comando no reconocido. Escribe *@bot listar* para ver los comandos disponibles.`,
  };
};

export { processCommand, CommandType, parseStudentData, shouldParse };