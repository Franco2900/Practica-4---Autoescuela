// Metodos importados de 'utilController.js'
const { logURL } = require('./utilController.js');

const { 
    crearPago,
    modificarPago,
    borrarPago,
    buscarPagosDelEstudiante
} = require('../models/pagoModel.js');

// Métodos del controller
async function postCrearPago(req, res)
{
    logURL(`POST`, `/pagos/crearPago`);
    let { cantidadPagada, fecha, hora, estudiante_id } = req.body;

    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('Datos del pago a crear:', req.body);
    else          res.status(400).send('No se recibió ningún dato de la clase a crear');

    hora          = hora + ":00";
    estudiante_id = parseInt(estudiante_id, 10);

    try // Creo el pago
    {
        await crearPago(cantidadPagada, fecha, hora, estudiante_id);
        return res.status(201).json({ success: true });
    }
    catch(error) // En caso de que haya un error al crear el pago
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al crear el pago' });  // Envío respuesta de error al cliente
    }
}



async function putModificarPago(req, res)
{
    logURL(`PUT`, `/pagos/modificarPago`);
    let { id, cantidad_pagada, fecha, hora } = req.body;

    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('Datos del pago a modificar recibidos:', req.body);
    else          res.status(400).send('No se recibió ningún dato del pago a modificar');

    id = parseInt(id, 10);
    cantidad_pagada = parseInt(cantidad_pagada, 10);

    try // Modifico el pago
    {
        await modificarPago(id, cantidad_pagada, fecha, hora);
        return res.status(201).json({ success: true });
    }
    catch(error) // En caso de que haya un error al modificar el pago
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al modificar el pago' });  // Envío respuesta de error al cliente
    }
}


async function deleteBorrarPago(req, res)
{
    logURL(`DELETE`, `/pagos/borrarPago`);
    const { id } = req.body;

    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('ID del pago a borrar:', req.body);
    else          res.status(400).send('No se recibió ningún ID del pago');

    try // Borro el pago
    {
        await borrarPago(id);
        return res.status(201).json({ success: true });
    }
    catch(error) // En caso de que haya un error al borrar el pago
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al borrar el pago' });  // Envío respuesta de error al cliente
    }
}



async function postPagosDelEstudiante(req, res)
{
    logURL(`POST`, `/pagosDelEstudiante`);
    const { estudiante_id } = req.body;
    
    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('ID del estudiante a buscar sus pagos:', req.body);
    else          res.status(400).send('No se recibió ningún ID');

    try // Regreso los pagos del estudiante
    {
        const pagosDelEstudiante = await buscarPagosDelEstudiante(estudiante_id);
        return res.status(201).json( pagosDelEstudiante );
    }
    catch(error) // En caso de que haya un error
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al buscar los pagos' });  // Envío respuesta de error al cliente
    }
}


module.exports = { 
    postCrearPago,
    putModificarPago,
    deleteBorrarPago,
    postPagosDelEstudiante
};