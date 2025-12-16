async function buscarPorRangoFecha() 
{
  // Obtengo los div en donde muestro las clases
  const contenedorHoyEnAdelante     = document.getElementById('clasesDeHoyEnAdelanteDiv');
  const contenedorBusquedaConFiltro = document.getElementById('busquedaConFiltroDiv');

  // Oculto los otros listados y muestro loading
  contenedorHoyEnAdelante.style.display = 'none';
  contenedorBusquedaConFiltro.style.display = '';
  contenedorBusquedaConFiltro.innerHTML = '<p class="text-muted">Cargando...</p>';

  try 
  {
    // Obtengo los valores de los input de fecha
    const fechaDesde = document.getElementById('fechaDesde').value;
    const fechaHasta = document.getElementById('fechaHasta').value;

    // Validación de fechas. Si falta alguna fecha, le informo al usuario y salgo temprano de la funcion
    if (!fechaDesde || !fechaHasta) 
    {
      if (!fechaDesde && !fechaHasta) 
      {
        contenedorBusquedaConFiltro.innerHTML =
          `<div class="alert alert-warning">Falta seleccionar la fecha Desde y la fecha Hasta</div>`;
      }
      else if (!fechaDesde) 
      {
      contenedorBusquedaConFiltro.innerHTML =
          `<div class="alert alert-warning">Falta seleccionar la fecha Desde</div>`;
      }
      else 
      {
        contenedorBusquedaConFiltro.innerHTML =
          `<div class="alert alert-warning">Falta seleccionar la fecha Hasta</div>`;
      }

      return;
    }

    // Validación de fechas. Si la fecha hasta es menor a la fecha desde, le informo al usuario y salgo temprano de la funcion
    if (new Date(fechaDesde) > new Date(fechaHasta)) {
      contenedorBusquedaConFiltro.innerHTML =
        `<div class="alert alert-warning">El rango es inválido. La fecha Hasta es menor a la fecha Desde</div>`;
      return;
    }

    // Petición al servidor
    const response = await fetch(`${dominio}/clases/clasesPorRangoDeFechas`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ fechaDesde, fechaHasta })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || response.statusText);
    }

    const tabla = await response.text();

    contenedorBusquedaConFiltro.innerHTML = tabla;
  }
  catch (error) 
  {
    console.error('Error al buscar las clases del rango de fechas:', error);

    contenedorBusquedaConFiltro.style.display = '';
    contenedorBusquedaConFiltro.innerHTML = `
      <div class="alert alert-danger" role="alert">
        No se pudo cargar las clases del rango de fechas: ${error.message}
      </div>
    `;
  }
}