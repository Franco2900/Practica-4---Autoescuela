async function crearEstudiante() 
{
    // Campos del formulario
    const nombre       = document.getElementById('nombreCreacionInput').value.trim();
    const apellido     = document.getElementById('apellidoCreacionInput').value.trim();
    const direccion    = document.getElementById('direccionCreacionInput').value.trim();
    const celular      = document.getElementById('celularCreacionInput').value.trim();
    const nacionalidad = document.getElementById('nacionalidadCreacionSelect').value;
    const dni          = document.getElementById('dniCreacionInput').value.trim();

    // Normalización de campos opcionales (Si está vacío, pasa a ser null)
    const emailCrudo   = document.getElementById('emailCreacionInput').value.trim();
    const email = emailCrudo === '' ? null : emailCrudo;

    const notasCrudas  = document.getElementById('notasCreacionInput').value.trim();
    const notas        = notasCrudas === '' ? null : notasCrudas; 

    
    // Validación del formulario
    if ( !nombre || !apellido || !direccion || !celular || !nacionalidad || !dni ) {
        alert('Nombre, apellido, dirección, celular, nacionalidad y DNI son obligatorios.');
        return;
    }

    // Petición al servidor
    try {
        const response = await fetch(`${window.location.origin}/estudiantes/crearEstudiante`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                apellido,
                direccion,
                celular,
                nacionalidad,
                dni,
                email,
                notas
            })
        });

        // Verifica que la respuesta sea exitosa
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || response.statusText);
        }

        // Parsea el JSON de respuesta
        const data = await response.json();

        console.log('Éxito:', data);
        alert(`Alumno "${nombre} ${apellido}" creado exitosamente`);
        window.location.reload();
    } catch (error) {
        console.error('Error al crear:', error);
        alert('Ocurrió un error al crear el estudiante: ' + error.message);
    }
}




// Precarga el formulario del modal de modificación con los datos originales
function mostrarModalDeModificacion(estudiante) 
{
  // Rellenar campos
  document.getElementById('modificacionID').value                 = estudiante.id;
  document.getElementById('nombreModificacionInput').value        = estudiante.nombre;
  document.getElementById('apellidoModificacionInput').value      = estudiante.apellido;
  document.getElementById('direccionModificacionInput').value     = estudiante.direccion;
  document.getElementById('celularModificacionInput').value       = estudiante.celular;
  document.getElementById('nacionalidadModificacionSelect').value = estudiante.nacionalidad;
  document.getElementById('dniModificacionInput').value           = estudiante.dni;
  document.getElementById('emailModificaciconInput').value        = estudiante.email || '';
  document.getElementById('notasModificacionInput').value         = estudiante.notas || '';
}

async function modificarEstudiante()
{
    // Campos del formulario
    const id           = document.getElementById('modificacionID').value;
    const nombre       = document.getElementById('nombreModificacionInput').value.trim();
    const apellido     = document.getElementById('apellidoModificacionInput').value.trim();
    const direccion    = document.getElementById('direccionModificacionInput').value.trim();
    const celular      = document.getElementById('celularModificacionInput').value.trim();
    const nacionalidad = document.getElementById('nacionalidadModificacionSelect').value;
    const dni          = document.getElementById('dniModificacionInput').value.trim();

    // Normalización de campos opcionales (Si está vacío, pasa a ser null)
    const emailCrudo   = document.getElementById('emailModificaciconInput').value.trim();
    const email = emailCrudo === '' ? null : emailCrudo;

    const notasCrudas  = document.getElementById('notasModificacionInput').value.trim();
    const notas        = notasCrudas === '' ? null : notasCrudas; 

    // Validación del formulario
    if ( !nombre || !apellido || !direccion || !celular || !nacionalidad || !dni ) {
        alert('Nombre, apellido, dirección y celular son obligatorios.');
        return;
    }

    // Petición al servidor
    try 
    {
        const response = await fetch(`${window.location.origin}/estudiantes/modificarEstudiante`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                nombre,
                apellido,
                direccion,
                celular,
                nacionalidad,
                dni,
                email,
                notas
            })
        });

        // Verifica que la respuesta sea exitosa
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || response.statusText);
        }

        // Parsea el JSON de respuesta
        const data = await response.json();
        
        console.log('Éxito:', data);
        alert(`Alumno "${nombre} ${apellido}" modificado exitosamente`);
        window.location.href = '/estudiantes';
    } 
    catch (error) 
    {
        console.error('Error al modificar:', error);
        alert('Ocurrió un error al modificar el estudiante: ' + error.message);
    }
}



async function borrarEstudiante(id, nombre, apellido, boton) 
{
    // Pregunto al usuario si de verdad quiere borrar al estudiante. Devuelve un booleano
    const confirmaBorrado = window.confirm(`
      ¿De verdad desea eliminar al estudiante ${nombre} ${apellido}?\n
      Borrar a un estudiante borra también todas sus clases y sus pagos
      `);
    
    // Si el usuario cancela, se sale de la función
    if (!confirmaBorrado) return;
    
    // Petición al servidor
    try 
    {
        const response = await fetch(`${dominio}/estudiantes/borrarEstudiante`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify( { id } )
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || response.statusText);
        }

        //Metodo para quitar al alumno sin reinicia la página

        // Remueve la fila del estudiante
        const filaDelEstudiante = boton.closest('tr');
        filaDelEstudiante.remove();
        
        // Bajo la cantidad de estudiantes del contador en 1
        let cantidadAlumnos = parseInt(document.getElementById('cantidadEstudiantes').textContent, 10);
        document.getElementById('cantidadEstudiantes').textContent = cantidadAlumnos - 1;

        alert(`Estudiante ${nombre} ${apellido} eliminado correctamente`);
    } 
    catch (error) 
    {
        console.error('Error al eliminar:', error);
        alert('No se pudo eliminar el estudiante: ' + error.message);
    }
}