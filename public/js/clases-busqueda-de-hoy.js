async function buscarClasesDeHoy(checkbox) 
{
  // Obtengo los div en donde muestro las clases
  const contenedorHoyEnAdelante          = document.getElementById('clasesDeHoyEnAdelanteDiv');
  const contenedorBusquedaConFiltro      = document.getElementById('busquedaConFiltroDiv');

  try 
  {
    if (checkbox.checked)  // Si el checkbox esta marcado/tildado
    {
      // Oculto el listado general y muestro loader
      contenedorHoyEnAdelante.style.display       = 'none';
      document.getElementById('fechaDesde').value = '';
      document.getElementById('fechaHasta').value = '';
      contenedorBusquedaConFiltro.style.display   = '';
      contenedorBusquedaConFiltro.innerHTML       = '<p class="text-muted">Cargando...</p>';

      // Petición al servidor
      const response = await fetch(`${dominio}/clases/clasesDeHoy`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || response.statusText);
      }

      const tabla = await response.text();

      contenedorBusquedaConFiltro.innerHTML = tabla;
    } 
    else     
    {
      resetFiltros();
    }
  } 
  catch (error) 
  {
    console.error('Error al buscar las clases de hoy:', error);
    
    contenedorBusquedaConFiltro.style.display = '';
    contenedorBusquedaConFiltro.innerHTML = `
      <div class="alert alert-danger" role="alert">
        No se pudo cargar las clases de hoy: ${error.message}
      </div>
    `;
  }

}