import { parse, format } from 'date-fns';
import { es } from 'date-fns/locale';


const validPrefixes = ['@bot', '@kbot'];
const validCommands = [
  'registrarAlumno',
  'registrarProducto',
  'renovarAlumno',
  'ventaProducto',
  'listar',
];

const CommandType = {
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  IGNORE: 'IGNORE',
};

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
const validateCommand = (prefix) => validPrefixes.includes(prefix);
const shouldParse = (input) => {
    // Si la entrada contiene más de una línea, debe parsearse
    const lines = input.split('\n');
    return lines.length > 1 || /:/.test(input);
  };
  
// Función para procesar el registro de alumnos
const parseStudentData = (args) => {
    const lines = args.split('\n');
    const data = lines.reduce((acc, line) => {
      const [key, ...valueParts] = line.split(':');
      const keyTrimmed = key.trim().toLowerCase();
      const value = valueParts.join(':').trim();
  
      switch (keyTrimmed) {
        case 'curso':
          acc.curso = value;
          break;
        case 'nombre':
          acc.nombre = value;
          break;
        case 'edad':
          acc.edad = value ? parseInt(value.replace(/\D/g, ''), 10) : null;
          break;
        case 'telf':
          acc.telefono = value.replace(/\D/g, '');
          break;
        case 'tiempo':
          acc.tiempo = value.replace(/\D/g, '');
          break;  
        case 'inicio':
          try {
            acc.fechaInicio = parseDate(value); // Utiliza el método para normalizar la fecha
          } catch (error) {
            acc.fechaInicioError = error.message; // Captura errores de fecha
          }
          break;
        default:
          acc.otros.push({ key: keyTrimmed, value });
          break;
      }
      return acc;
    }, { curso: '', nombre: '', telefono: '', fechaInicio: '', edad: null, otros: [] });
  
    // Validar campos obligatorios
    const missingFields = [];
    if (!data.curso) missingFields.push('Curso');
    if (!data.nombre) missingFields.push('Nombre');
    if (!data.telefono) missingFields.push('Número de Teléfono');
    if (!data.fechaInicio) missingFields.push('Fecha de Inicio');
  
    if (missingFields.length > 0) {
      return { error: `Faltan campos obligatorios: ${missingFields.join(', ')}` };
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

// Procesador de comandos
const processCommand = async function processCommand(input) {
  // Divide la entrada en palabras
  const [prefix, command, ...args] = input.trim().split(/\s+/);

  // Validar el prefijo
  if (!validateCommand(prefix)) {
    return { type: CommandType.IGNORE, message: 'Prefijo No Válido' };
  }

  // Procesar el comando
  switch (command) {
    case 'registrarAlumno':
      return { type: CommandType.SUCCESS, message: `Registrando alumno con datos: ${args.join(' ')}` };
    case 'registrarProducto':
      return { type: CommandType.SUCCESS, message: `Registrando producto con datos: ${args.join(' ')}` };
    case 'renovarAlumno':
      return { type: CommandType.SUCCESS, message: `Renovando alumno con datos: ${args.join(' ')}` };
    case 'venderProducto':
      return { type: CommandType.SUCCESS, message: `Procesando venta de producto con datos: ${args.join(' ')}` };
    case 'listar':
      return { type: CommandType.SUCCESS, message: `Comandos disponibles:\n *${validCommands.join('* \n *')}*` };
    default:
      return { type: CommandType.ERROR, message: 'Comando no reconocido. \nSi deseas conocerlos escribe *@bot listar* y luego inténtalo de nuevo.' };
  }
};

export { processCommand, CommandType, parseStudentData, shouldParse };