// Metodos importados de 'utilController.js'
const { logURL } = require('./utilController.js');

// Metodos de consulta a la base de datos
const { 
    buscarClasesDelEstudiantePorID,
    buscarClasesDelEstudiantePorNombreYApellido,
    buscarTodasLasClasesDeHoyEnAdelante,
    buscarClasesDeHoy,
    buscarClasesPorRangoDeFechas,
    crearClase,
    modificarClase,
    borrarClase 
} = require('../models/claseModel.js');

const { buscarTodosLosEstudiantes }            = require('../models/estudianteModel.js');

const { 
    buscarTodosLosEventosDeHoyEnAdelante,
    buscarTodosLosEventosDeHoy,
    buscarEventosPorRangoDeFechas,
    buscarEventosPorNombreYApellido
} = require('../models/eventoModel.js');

// Metodos auxiliares de clasesController
const { 
    armadoTablaClases,
    deYYYYMMDDaDDMMYYYY,
    comprobarSuperposicion,
    comprobarDiaHorario
} = require('./clasesControllerHelper.js');

// Métodos del controller
async function getClasesDeHoyEnAdelante(req, res)
{
    logURL(`GET`, `/clasesDeHoyEnAdelante`);

    try
    {
        const encabezadoTabla       = `<h2>Mostrando clases de hoy en adelante</h2>`;
        const clasesDeHoyEnAdelante = await buscarTodasLasClasesDeHoyEnAdelante();
        const mensajeDeError        = `No hay clases para hoy en adelante`;

        const eventos = await buscarTodosLosEventosDeHoyEnAdelante();

        const htmlTablaClases = armadoTablaClases(encabezadoTabla, clasesDeHoyEnAdelante, mensajeDeError, eventos);

        const estudiantes = await buscarTodosLosEstudiantes();
       
        res.render('layout', {body: 'clasesView', clasesDeHoyEnAdelante, htmlTablaClases ,estudiantes} ); 
    }
    catch(error) // En caso de que haya un error
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al buscar las clases' });  // Envío respuesta de error al cliente
    }

}



async function getClasesDeHoy(req, res)
{
    logURL(`GET`, `/clasesDeHoy`);

    try
    {
        const encabezadoTabla = `<h2>Mostrando clases de hoy</h2>`;
        const clasesDeHoy     = await buscarClasesDeHoy();
        const mensajeDeError  = `No hay clases para hoy`;

        const eventos = await buscarTodosLosEventosDeHoy();

        const htmlTablaClases = armadoTablaClases(encabezadoTabla, clasesDeHoy, mensajeDeError, eventos);

        return res.status(200).send( htmlTablaClases );
    }
    catch(error) // En caso de que haya un error
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al buscar las clases' });  // Envío respuesta de error al cliente
    }

}



async function postClasesPorRangoDeFechas(req, res)
{
    logURL(`POST`, `/clasesPorRangoDeFechas`);
    const { fechaDesde, fechaHasta } = req.body;
    
    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('Rango de fechas a buscar:', req.body);
    else          res.status(400).send('No se recibió ninguna fecha');

    try // Regreso las clases
    {
        const encabezadoTabla = `<h2>Mostrando clases del ${deYYYYMMDDaDDMMYYYY(fechaDesde)} al ${deYYYYMMDDaDDMMYYYY(fechaHasta)}</h2>`;
        const clasesPorRangoDeFechas = await buscarClasesPorRangoDeFechas(fechaDesde, fechaHasta);
        const mensajeDeError  = `No hay clases para este rango de fechas: ${deYYYYMMDDaDDMMYYYY(fechaDesde)} - ${deYYYYMMDDaDDMMYYYY(fechaHasta)}`;

        const eventos = await buscarEventosPorRangoDeFechas(fechaDesde, fechaHasta);

        const htmlTablaClases = armadoTablaClases(encabezadoTabla, clasesPorRangoDeFechas, mensajeDeError, eventos);

        return res.status(200).send( htmlTablaClases );
    }
    catch(error) // En caso de que haya un error
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al buscar las clases' });  // Envío respuesta de error al cliente
    }
}


async function postClasesDelEstudiantePorID(req, res)
{
    logURL(`POST`, `/clasesDelEstudiantePorID`);
    const { id } = req.body;
    
    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('ID del estudiante a buscar sus clases:', req.body);
    else          res.status(400).send('No se recibió ningún ID');

    try // Regreso las clases del estudiante
    {
        const clasesDelEstudiante = await buscarClasesDelEstudiantePorID(id);
        return res.status(201).json( clasesDelEstudiante );
    }
    catch(error) // En caso de que haya un error
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al buscar las clases' });  // Envío respuesta de error al cliente
    }
}



async function postClasesDelEstudiantePorNombreYApellido(req, res)
{
    logURL(`POST`, `/clasesDelEstudiantePorNombreYApellido`);
    const { estudiante } = req.body;
    
    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('Nombre y apellido del estudiante a buscar sus clases:', req.body);
    else          res.status(400).send('No se recibió ningún estudiante');

    try // Regreso las clases del estudiante
    {
        const encabezadoTabla     = `<h2>Mostrando clases del estudiante ${estudiante}</h2>`;
        const clasesDelEstudiante = await buscarClasesDelEstudiantePorNombreYApellido(estudiante);
        const mensajeDeError      = `No hay clases para este estudiante: ${estudiante}`;

        const eventos = await buscarEventosPorNombreYApellido(estudiante);

        const htmlTablaClases = armadoTablaClases(encabezadoTabla, clasesDelEstudiante, mensajeDeError, eventos);

        return res.status(200).send( htmlTablaClases );
    }
    catch(error) // En caso de que haya un error
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al buscar las clases' });  // Envío respuesta de error al cliente
    }
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}


async function postCrearClase(req, res)
{
    logURL(`POST`, `/clases/crearClase`);
    let { fecha, hora_desde, hora_hasta, estudiante_id } = req.body;

    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('Datos de la clase a crear:', req.body);
    else          res.status(400).send('No se recibió ningún dato de la clase a crear');

    estudiante_id = parseInt(estudiante_id, 10);

    try 
    {
        // Verifico que la clase sea en un día y horario valido
        const consultaDiaHorario = comprobarDiaHorario(fecha, hora_desde, hora_hasta);
        if ( !consultaDiaHorario.diaHorarioValido ) throw new HttpError( 409, consultaDiaHorario.mensajeDeError );

        // Verifico si la clase no se superpone con otra
        const consultaSuperposicion = await comprobarSuperposicion(fecha, hora_desde, hora_hasta);
        if ( consultaSuperposicion.haySuperposicion ) throw new HttpError( 409, consultaSuperposicion.mensajeDeError );

        // Creo la clase
        await crearClase(fecha, hora_desde, hora_hasta, estudiante_id);
        return res.status(201).json({ success: true });
    }
    catch(error) // En caso de que haya un error al crear la clase
    {
        console.error('Error:', error);

        // Si el error tiene status, lo usamos; si no, 500
        const status  = error && error.status ? error.status : 500;
        const message = error && error.message ? error.message : 'Ocurrió un error al crear la clase';

        return res.status(status).json({ error: message }); // Envío respuesta de error al cliente
    }
}



async function putModificarClase(req, res)
{
    logURL(`PUT`, `/clases/modificarClase`);
    const { id, fecha, hora_desde, hora_hasta, estudiante_id } = req.body;

    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('Datos de la clase a modificar recibidos:', req.body);
    else          res.status(400).send('No se recibió ningún dato de la clase a modificar');

    try 
    {
        // Verifico que la clase sea en un día y horario valido
        const consultaDiaHorario = comprobarDiaHorario(fecha, hora_desde, hora_hasta);
        if ( !consultaDiaHorario.diaHorarioValido ) throw new HttpError( 409, consultaDiaHorario.mensajeDeError );

        // Verifico si la clase no se superpone con otra
        const consultaSuperposicion = await comprobarSuperposicion(fecha, hora_desde, hora_hasta, id);
        if ( consultaSuperposicion.haySuperposicion ) throw new HttpError( 409, consultaSuperposicion.mensajeDeError );

        // Modifico la clase
        await modificarClase(id, fecha, hora_desde, hora_hasta, estudiante_id);
        return res.status(201).json({ success: true });
    }
    catch(error) // En caso de que haya un error al modificar la clase
    {
        console.error('Error:', error);

        // Si el error tiene status, lo usamos; si no, 500
        const status  = error && error.status ? error.status : 500;
        const message = error && error.message ? error.message : 'Ocurrió un error al modificar la clase';

        return res.status(status).json({ error: message }); // Envío respuesta de error al cliente
    }
}



async function deleteBorrarClase(req, res)
{
    logURL(`DELETE`, `/clases/borrarClase`);
    const { id } = req.body;

    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('ID de la clase a borrar:', req.body);
    else          res.status(400).send('No se recibió ningún ID de clase');

    try // Borro la clase
    {
        await borrarClase(id);
        return res.status(201).json({ success: true });
    }
    catch(error) // En caso de que haya un error al borrar la clase
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al borrar clase' });  // Envío respuesta de error al cliente
    }
}


module.exports = { 
    getClasesDeHoyEnAdelante, 
    getClasesDeHoy,
    postClasesPorRangoDeFechas,
    postClasesDelEstudiantePorID,
    postClasesDelEstudiantePorNombreYApellido,

    postCrearClase,
    putModificarClase,
    deleteBorrarClase
};