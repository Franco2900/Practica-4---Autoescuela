// Variables globales para guardar la tabla original
let BodyTablaOriginalHTML = '';
let tablaGuardada = false;

async function buscarEstudiantePorNombre()
{
    const tablaEstudiantesBody = document.getElementById('tablaEstudiantesBody');

    // Recupero el texto del input
    const nombreEstudiante = document.getElementById('buscarEstudiantePorNombre').value.trim();
    console.log(`Nombre a buscar: ${nombreEstudiante}`);

    // Si no hay input
    if(!nombreEstudiante || nombreEstudiante.length === 0)          
    {

        if (tablaGuardada) 
        {
            tablaEstudiantesBody.innerHTML = BodyTablaOriginalHTML; // Vuelvo a mostrar el body de la tabla original
            tablaGuardada = false;
        }

        document.getElementById('manejoTablaBusquedaPorApellido').style.visibility = ''; // Hago visible los botones de paginación
        
        return; // Salgo temprano para no ejecutar el resto del código
    }

    // Si es la primera vez que se escribe algo en el input (Guarda la tabla original solo al primer carácter que escriba el usuario)
    if (!tablaGuardada) 
    {
      BodyTablaOriginalHTML = tablaEstudiantesBody.innerHTML; // Guardo la tabla original
      tablaGuardada = true;
    }

    // Si hay input
    document.getElementById('manejoTablaBusquedaPorApellido').style.visibility = 'hidden'; // Hago invisible los botones de paginación

    const url = `${dominio}/estudiantes/buscarEstudiantePorNombre`;
    try 
    {
        // Hago fetch al backend
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { nombreEstudiante } ) 
        });

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        
        const bodyNuevoHTML = await response.text(); // Respuesta del servidor
        tablaEstudiantesBody.innerHTML = bodyNuevoHTML;    // Reemplazo la tabla actual por la nueva
    } 
    catch (error) 
    {
        console.error('Fetch fallido:', error);
    }
}


async function buscarEstudiantePorApellido()
{
    const tablaEstudiantesBody = document.getElementById('tablaEstudiantesBody');

    // Recupero el texto del input
    const apellidoEstudiante = document.getElementById('buscarEstudiantePorApellido').value.trim();
    console.log(`Apellido a buscar: ${apellidoEstudiante}`);

    // Si no hay input
    if(!apellidoEstudiante || apellidoEstudiante.length === 0)          
    {

        if (tablaGuardada) 
        {
            tablaEstudiantesBody.innerHTML = BodyTablaOriginalHTML; // Vuelvo a mostrar el body de la tabla original
            tablaGuardada = false;
        }

        document.getElementById('manejoTablaBusquedaPorNombre').style.visibility = ''; // Hago visible los botones de paginación
        
        return; // Salgo temprano para no ejecutar el resto del código
    }

    // Si es la primera vez que se escribe algo en el input (Guarda la tabla original solo al primer carácter que escriba el usuario)
    if (!tablaGuardada) 
    {
      BodyTablaOriginalHTML = tablaEstudiantesBody.innerHTML; // Guardo la tabla original
      tablaGuardada = true;
    }

    // Si hay input
    document.getElementById('manejoTablaBusquedaPorNombre').style.visibility = 'hidden'; // Hago invisible los botones de paginación

    const url = `${dominio}/estudiantes/buscarEstudiantePorApellido`;
    try 
    {
        // Hago fetch al backend
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { apellidoEstudiante } ) 
        });

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        
        const bodyNuevoHTML = await response.text(); // Respuesta del servidor
        tablaEstudiantesBody.innerHTML = bodyNuevoHTML;    // Reemplazo la tabla actual por la nueva
    } 
    catch (error) 
    {
        console.error('Fetch fallido:', error);
    }
}