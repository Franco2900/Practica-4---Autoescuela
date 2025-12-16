// Metodos importados
const { logURL } = require('./utilController.js');

const { 
    crearEstudiante, 
    buscarTodosLosEstudiantes,
    modificarEstudiante,
    borrarEstudiante
} = require('../models/estudianteModel.js');


// Métodos del controller
async function getEstudiantes(req, res)
{
    logURL(`GET`, `/estudiantes`);

    const estudiantes = await buscarTodosLosEstudiantes();

    res.render('layout', {body: 'estudiantesView', estudiantes} ); 
}


async function postCrearEstudiante(req, res)
{
    logURL(`POST`, `/estudiantes/crearEstudiante`);
    const { nombre, apellido, direccion, celular, nacionalidad, dni, email, notas } = req.body;

    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('Datos del nuevo estudiante recibidos:', req.body);
    else          res.status(400).send('No se recibió ningún dato del nuevo estudiante');

    try // Creo al estudiante
    {
        const insertId = await crearEstudiante(nombre, apellido, direccion, celular, nacionalidad, dni, email, notas);
        return res.status(201).json({ success: true, id: insertId });
    }
    catch(error) // En caso de que haya un error al crear al estudiante
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al crear al estudiantes' });  // Envío respuesta de error al cliente
    }
}


async function postModificarEstudiante(req, res)
{
    logURL(`POST`, `/estudiantes/modificarEstudiante`);
    const { id, nombre, apellido, direccion, celular, nacionalidad, dni, email, notas } = req.body;

    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('Datos del estudiante a modificar recibidos:', req.body);
    else          res.status(400).send('No se recibió ningún dato del estudiante a modificar');

    try // Modifico al estudiante
    {
        const insertId = await modificarEstudiante(id, nombre, apellido, direccion, celular, nacionalidad, dni, email, notas);
        return res.status(201).json({ success: true });
    }
    catch(error) // En caso de que haya un error al modificar al estudiante
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al modificar al estudiantes' });  // Envío respuesta de error al cliente
    }
}


async function deleteBorrarEstudiante(req, res)
{
    logURL(`DELETE`, `/estudiantes/borrarEstudiante`);
    const { id } = req.body;

    // Chequeo que los datos hayan llegado correctamente
    if (req.body) console.log('ID del estudiante a borrar:', req.body);
    else          res.status(400).send('No se recibió ningún ID del estudiante');

    try // Borro al estudiante
    {
        await borrarEstudiante(id);
        return res.status(201).json({ success: true });
    }
    catch(error) // En caso de que haya un error al borrar al estudiante
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al borrar al estudiante' });  // Envío respuesta de error al cliente
    }
}



async function postBuscarEstudiantePorNombre(req, res)
{
    logURL(`POST`, `/estudiantes/buscarEstudiantePorNombre`);

    try
    {
        const nombreEstudiante = req.body.nombreEstudiante.trim().toLowerCase(); // Nombre a buscar
        const estudiantes = await buscarTodosLosEstudiantes();

        // Busqueda de coincidencias parciales si contiene los caracteres
        const resultadosFiltro = estudiantes.filter(estudiante => estudiante.nombre.toLowerCase().includes(nombreEstudiante) );

        // Armado del body de la tabla de estudiantes (las filas incluyen los botones)
        let tabla = `<tbody>`;

        for (let i = 0; i < resultadosFiltro.length; i++)
        {
            const e = resultadosFiltro[i];
            const estudianteLiteral = JSON.stringify(e);

            tabla +=
            `
                <tr data-id="${e.id}">
                    <td>${e.nombre}</td>
                    <td>${e.apellido}</td>
                    <td>${e.direccion}</td>
                    <td>${e.celular}</td>
                    <td>${e.nacionalidad}</td>
                    <td>${e.dni}</td>
                    <td>${e.email}</td>s
                    <td>${e.notas == null ? 'Sin notas' : e.notas}</td>

                    <!-- Botón para ver clases -->
                    <td>
                      <button
                        type="button"
                        class="btn btn-sm btn-info me-2 mb-2"
                        title="Ver clases"
                        data-bs-toggle="modal"
                        data-bs-target="#estudianteClasesModal"
                        onclick="verClasesDelEstudiante(${e.id})"
                      >
                        <i class="fas fa-calendar-alt"></i>
                      </button>

                      <br>

                      <!-- Botón para ver pagos -->
                      <button
                        type="button"
                        class="btn btn-sm btn-success"
                        title="Ver pagos"
                        data-bs-toggle="modal"
                        data-bs-target="#estudiantePagosModal"
                        onclick="verPagosDelEstudiante(${e.id})"
                      >
                        <i class="fas fa-dollar-sign"></i>
                      </button>

                    </td>

                    <!-- Botones de modificar y eliminar estudiante -->
                    <td>

                      <!-- Botón para mostrar modal de edición -->
                      <button
                        type="button"
                        class="btn btn-sm btn-primary me-2 mb-2"
                        data-bs-toggle="modal"
                        data-bs-target="#estudianteModificacionModal"
                        title="Modificar estudiante"
                        onclick='mostrarModalDeModificacion(${estudianteLiteral})'
                      >
                        <i class="fas fa-edit"></i>
                      </button>

                      <br>

                      <!-- Botón para eliminar -->
                      <button
                        type="button"
                        class="btn btn-sm btn-danger"
                        title="Eliminar estudiante"
                        aria-label="Eliminar estudiante"
                        onclick="borrarEstudiante(${e.id}, '${escapeForOnclick(e.nombre)}', '${escapeForOnclick(e.apellido)}', this)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>

                    </td>
                </tr>
            `;
        }

        tabla += `</tbody>`;

        res.send(tabla); // Envio el body de la tabla
    }
    catch(error)
    {
        console.log("ERROR EN EL SERVIDOR: ");
        console.log(error);

        res.status(500).json( { mensaje: error.message });
    }
}


async function postBuscarEstudiantePorApellido(req, res)
{
    logURL(`POST`, `/estudiantes/buscarEstudiantePorApellido`);

    try
    {
        const apellidoEstudiante = req.body.apellidoEstudiante.trim().toLowerCase(); // Apellido a buscar
        const estudiantes = await buscarTodosLosEstudiantes();

        // Busqueda de coincidencias parciales si contiene los caracteres
        const resultadosFiltro = estudiantes.filter(estudiante => estudiante.apellido.toLowerCase().includes(apellidoEstudiante) );

        // Armado del body de la tabla de estudiantes
        let tabla = `<tbody>`;

        for (let i = 0; i < resultadosFiltro.length; i++)
        {
            const e = resultadosFiltro[i];
            // Serializo el objeto estudiante como literal JS para incrustarlo en el onclick de mostrarModalDeModificacion
            // Usamos JSON.stringify directamente para generar un literal de objeto válido en el HTML.
            const estudianteLiteral = JSON.stringify(e);

            tabla +=
            `
                <tr data-id="${e.id}">
                    <td>${e.nombre}</td>
                    <td>${e.apellido}</td>
                    <td>${e.direccion}</td>
                    <td>${e.celular}</td>
                    <td>${e.nacionalidad}</td>
                    <td>${e.dni}</td>
                    <td>${e.email}</td>
                    <td>${e.notas == null ? 'Sin notas' : e.notas}</td>

                    <!-- Botón para ver clases -->
                    <td>
                      <button
                        type="button"
                        class="btn btn-sm btn-info me-2 mb-2"
                        title="Ver clases"
                        data-bs-toggle="modal"
                        data-bs-target="#estudianteClasesModal"
                        onclick="verClasesDelEstudiante(${e.id})"
                      >
                        <i class="fas fa-calendar-alt"></i>
                      </button>

                      <br>

                      <!-- Botón para ver pagos -->
                      <button
                        type="button"
                        class="btn btn-sm btn-success"
                        title="Ver pagos"
                        data-bs-toggle="modal"
                        data-bs-target="#estudiantePagosModal"
                        onclick="verPagosDelEstudiante(${e.id})"
                      >
                        <i class="fas fa-dollar-sign"></i>
                      </button>

                    </td>

                    <!-- Botones de modificar y eliminar estudiante -->
                    <td>

                      <!-- Botón para mostrar modal de edición -->
                      <button
                        type="button"
                        class="btn btn-sm btn-primary me-2 mb-2"
                        data-bs-toggle="modal"
                        data-bs-target="#estudianteModificacionModal"
                        title="Modificar estudiante"
                        onclick='mostrarModalDeModificacion(${estudianteLiteral})'
                      >
                        <i class="fas fa-edit"></i>
                      </button>

                      <br>

                      <!-- Botón para eliminar -->
                      <button
                        type="button"
                        class="btn btn-sm btn-danger"
                        title="Eliminar estudiante"
                        aria-label="Eliminar estudiante"
                        onclick="borrarEstudiante(${e.id}, '${escapeForOnclick(e.nombre)}', '${escapeForOnclick(e.apellido)}', this)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>

                    </td>
                </tr>
            `;
        }

        tabla += `</tbody>`;

        res.send(tabla); // Envio el body de la tabla
    }
    catch(error)
    {
        console.log("ERROR EN EL SERVIDOR: ");
        console.log(error);

        res.status(500).json( { mensaje: error.message });
    }
}


// Helper para escapar comillas simples y caracteres que puedan romper el atributo onclick
function escapeForOnclick(str) {
    if (str == null) return '';
    return String(str)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
}


module.exports = { 
    getEstudiantes, 
    postCrearEstudiante,
    postModificarEstudiante,
    deleteBorrarEstudiante,

    postBuscarEstudiantePorNombre,
    postBuscarEstudiantePorApellido
};