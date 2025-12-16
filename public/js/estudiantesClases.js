async function verClasesDelEstudiantePorID(id) 
{
  estudianteActualId = id;
  
  const row = document.querySelector(`tr[data-id="${id}"]`);
  const nombre = row.children[0].innerText;
  const apellido = row.children[1].innerText;
  estudianteActualNombre = `${nombre} ${apellido}`;

  // Cambio el titulo del modal
  document.getElementById('estudianteClasesModalLabel').innerText = `Clases del Estudiante ${estudianteActualNombre}`

  const modalEl = document.getElementById('estudianteClasesModal');
  const listadoDeClases = modalEl.querySelector('#listadoDeClases');

  try {
    // 1) Enviar petición al servidor
    const response = await fetch(
      `${window.location.origin}/clases/clasesDelEstudiantePorID`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    const data = await response.json();
    listadoDeClases.innerHTML = '';

    // 2) Si no hay clases, mostrar mensaje
    if (!data.length) 
    {
      listadoDeClases.innerHTML = `
        <li class="list-group-item text-center text-muted">
          No se encontraron clases para este estudiante
        </li>`;
    } 
    else 
    {
      // 3) Ordenar clases por fecha ascendente
      data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

      // 4) Obtengo la fecha y hora actual
      let fechaActual = new Date();
      fechaActual.setHours(0, 0, 0, 0); // Seteo la hora a la medianoche

      let horaActual  = obtenerHoraArgentinaActual();

      // 5) Renderizar cada clase
      data.forEach(clase => {

        const fechaClase = new Date(clase.fecha);

        let diaSemana = fechaClase.toLocaleDateString('es-AR', { weekday: 'long' });
        diaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

        const fechaFormateada = fechaClase.toLocaleDateString('es-AR', {
          day:   '2-digit',
          month: '2-digit',
          year:  'numeric'
        });

        const horaDesde = clase.hora_desde.substring(0, 5);
        const horaHasta = clase.hora_hasta.substring(0, 5);
        const rangoHora = `${horaDesde} - ${horaHasta}`;

        // Determina si la clase ya paso o no
        const pasoClase = (
          fechaActual.getTime() > fechaClase.getTime() || // Me fijo si ya paso la fecha de la clase 
          ( fechaActual.getTime() === fechaClase.getTime() && hhmmAMinutos(horaActual) > hhmmAMinutos(horaHasta) ) // Si la fecha de la clase es hoy, me fijo si ya paso el horario de la clase
        );

        // Determina si la clase esta en progreso
        const claseEnProgreso = ( 
          fechaActual.getTime() === fechaClase.getTime() &&
          hhmmAMinutos(horaActual) > hhmmAMinutos(horaDesde) &&
          hhmmAMinutos(horaActual) < hhmmAMinutos(horaHasta)
        )

        let estadoClaseBadge; // Etiqueta HTML para representar el estado de la clase

        if(claseEnProgreso)
        {
          estadoClaseBadge = `<span class="badge bg-warning badge-status text-dark"><i class="bi bi-clock-history"></i> En Progreso </span>`
        }
        else
        {
          estadoClaseBadge = pasoClase
          ? `<span class="badge bg-secondary badge-status text-white"><i class="bi bi-check2-circle"></i> Pasada </span>`
          : `<span class="badge bg-success badge-status text-white"><i class="bi bi-clock-history"></i> Próxima </span>`;
        }


        // Creo el HTML de la clase
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';

        item.innerHTML = `
          <div>
            <h6 class="mb-1">
              Clase <small class="text-muted">#${clase.numero}</small>
            </h6>
            <div class="text-muted">
              <span class="badge bg-info text-dark me-2">${diaSemana}</span>
              <i class="bi bi-calendar3-fill me-1"></i>${fechaFormateada}
            </div>
          </div>

          <div>
            <span class="badge bg-primary rounded-pill fs-6">
              <i class="bi bi-clock-fill me-1"></i>${rangoHora}
            </span>
             ${estadoClaseBadge}
          </div>`;

        // Añado el HTML de la clase al listado
        listadoDeClases.appendChild(item);
      });
    }

  } 
  catch (error) 
  {
    console.error('Error al buscar las clases del estudiante:', error);

    listadoDeClases.innerHTML = `
      <li class="list-group-item text-center text-danger">
        Ocurrió un error al cargar las clases
      </li>`;
  }
}



// Funciones auxiliares

function obtenerHoraArgentinaActual() 
{
    const ahora = new Date();
    const fmt = new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/Argentina/Buenos_Aires'
    });
    
    // formatToParts permite extraer cada parte y unirlas en HH:MM:SS
    const partes = fmt.formatToParts(ahora);
    const hh = partes.find(p => p.type === 'hour').value;
    const mm = partes.find(p => p.type === 'minute').value;

    return `${hh}:${mm}`;
}


function hhmmAMinutos(hora) {
  const [hh, mm] = hora.split(':').map(Number);
  return hh * 60 + mm;
}