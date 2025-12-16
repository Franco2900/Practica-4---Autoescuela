async function buscarClasesPorNombreYApellido()
{
  // Obtengo los div en donde muestro las clases
  const contenedorHoyEnAdelante     = document.getElementById('clasesDeHoyEnAdelanteDiv');
  const contenedorBusquedaConFiltro = document.getElementById('busquedaConFiltroDiv');  

  // Recupero el valor del input
  const estudiante = document.getElementById('buscarClasesPorNombreYApellido').value.trim();
  console.log(`Estudiante a buscar: ${estudiante}`);

  if(estudiante.length >= 1) // Si hay algo escrito en el input
  {
    // Oculto los otros listados y muestro loading
    contenedorHoyEnAdelante.style.display     = 'none';
    contenedorBusquedaConFiltro.style.display = '';
    contenedorBusquedaConFiltro.innerHTML = '<p class="text-muted">Cargando...</p>';
  }
  else // Si el input esta vacio
  {
    // Reinicio filtros y salgo temprano de la función
    resetFiltros(); 
    return;
  }
  
  try 
  {
    // 1) Enviar petición al servidor
    const response = await fetch(
      `${window.location.origin}/clases/clasesDelEstudiantePorNombreYApellido`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ estudiante })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    const tabla = await response.text();

    contenedorBusquedaConFiltro.innerHTML = tabla;
  }
  catch (error) 
  {
    console.error('Error al buscar las clases del estudiante:', error);

    contenedorBusquedaConFiltro.style.display = '';
  
    contenedorBusquedaConFiltro.innerHTML = 
    `
      <div class="alert alert-danger" role="alert">
        No se pudo cargar las clases: ${error.message}
      </div>
    `;
  }

}