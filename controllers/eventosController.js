// Metodos importados de 'utilController.js'
const { logURL } = require('./utilController.js');

// Funciones de consulta a la base de datos
const { 
    crearEvento,
    modificarEvento,
    borrarEvento
} = require('../models/eventoModel.js');


const { comprobarSuperposicion } = require('./eventosControllerHelper.js');

// Funciones del controller

// NO SE USA
/*async function getEventos(req, res)
{
    logURL(`GET`, `/eventos`);

    try
    {
        const eventos = await buscarTodosLosEventos();

        return res.status(201).json({ success: true });
    }
    catch(error) // En caso de que haya un error
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al buscar los eventos' });  // Envío respuesta de error al cliente
    }
    
}*/


class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function postCrearEvento(req, res)
{
    logURL(`POST`, `/eventos/crearEvento`);
    let { fecha, hora_desde, hora_hasta, descripcion } = req.body;

    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('Datos del evento a crear:', req.body);
    else          res.status(400).send('No se recibió ningún dato del evento a crear');

    try 
    {
        // Verifico si el evento no se superpone con otro
        const consultaSuperposicion = await comprobarSuperposicion(fecha, hora_desde, hora_hasta);
        if ( consultaSuperposicion.haySuperposicion ) throw new HttpError( 409, consultaSuperposicion.mensajeDeError );

        // Creo el evento
        await crearEvento(fecha, hora_desde, hora_hasta, descripcion);
        return res.status(201).json({ success: true });
    }
    catch(error) // En caso de que haya un error al crear el evento
    {
        console.error('Error:', error);

        // Si el error tiene status, lo usamos; si no, 500
        const status  = error && error.status ? error.status : 500;
        const message = error && error.message ? error.message : 'Ocurrió un error al crear el evento';

        return res.status(status).json({ error: message }); // Envío respuesta de error al cliente
    }
}


async function putModificarEvento(req, res)
{
    logURL(`PUT`, `/eventos/modificarEvento`);
    const { id, fecha, hora_desde, hora_hasta, descripcion } = req.body;

    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('Datos del evento a modificar recibidos:', req.body);
    else          res.status(400).send('No se recibió ningún dato del evento a modificar');

    try
    {
        // Verifico si el evento no se superpone con otro
        const consultaSuperposicion = await comprobarSuperposicion(fecha, hora_desde, hora_hasta, id);
        if ( consultaSuperposicion.haySuperposicion ) throw new HttpError( 409, consultaSuperposicion.mensajeDeError );

        // Modifico el evento
        await modificarEvento(id, fecha, hora_desde, hora_hasta, descripcion);
        return res.status(201).json({ success: true });
    }
    catch(error) // En caso de que haya un error al modificar el evento
    {
        console.error('Error:', error);

        // Si el error tiene status, lo usamos; si no, 500
        const status  = error && error.status ? error.status : 500;
        const message = error && error.message ? error.message : 'Ocurrió un error al modificar el evento';

        return res.status(status).json({ error: message }); // Envío respuesta de error al cliente
    }
}


async function deleteBorrarEvento(req, res)
{
    logURL(`DELETE`, `/eventos/borrarEvento`);
    const { id } = req.body;

    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('ID del evento a borrar:', req.body);
    else          res.status(400).send('No se recibió ningún ID de evento');

    try // Borro el evento
    {
        await borrarEvento(id);
        return res.status(201).json({ success: true });
    }
    catch(error) // En caso de que haya un error al borrar el evento
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al borrar evento' });  // Envío respuesta de error al cliente
    }
}


module.exports = { 
    /*getEventos,*/
    postCrearEvento,
    putModificarEvento,
    deleteBorrarEvento
};