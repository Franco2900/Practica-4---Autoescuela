const dominio = window.location.origin;

function resetFiltros() 
{
  document.getElementById('clasesDeHoyEnAdelanteDiv').style.display = ''; // Muestro las clases de hoy
  document.getElementById('busquedaConFiltroDiv').innerHTML = ''; // Vacio el HTML del div con la busqueda por filtro

  document.getElementById('fechaDesde').value = ''; // Vacio los inputs para busqueda con fechas
  document.getElementById('fechaHasta').value = '';

  document.getElementById('soloHoyDiv').style.display = '';
  document.getElementById('soloHoy').checked = false; // Desmarco el casillero de solo clases de hoy
}