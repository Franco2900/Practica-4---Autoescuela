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


function hhmmAMinutos(hora) 
{
  const [hh, mm] = hora.split(':').map(Number);
  return hh * 60 + mm;
}


function minutosAhhmm(min) 
{
  const h = Math.floor(min / 60);
  const m = min % 60;
  return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
}

// Funciones para el armado de la tabla de clases

function armadoTablaClases(encabezadoTabla, clases, mensajeDeError, eventos)
{
  // Combino clases y eventos en un solo array de “items”
  const items = [];

  clases.forEach(c => {
    items.push({
      tipo:   'clase',
      fecha:  c.fecha,
      inicio: c.hora_desde.substring(0,5),
      fin:    c.hora_hasta.substring(0,5),
      datos:  c
    });
  });

  eventos.forEach(e => {
    items.push({
      tipo:   'evento',
      fecha:  e.fecha,
      inicio: e.hora_desde.substring(0,5),
      fin:    e.hora_hasta.substring(0,5),
      datos:  e
    });
  });


  // Ordeno por fecha y hora de inicio
  items.sort((a, b) => {
    
    const diaA = new Date(a.fecha).getTime();
    const diaB = new Date(b.fecha).getTime();
    
    if (diaA !== diaB) return diaA - diaB;
    return hhmmAMinutos(a.inicio) - hhmmAMinutos(b.inicio);
  });


  // Armo la tabla
  let tablaClases;

  // Si no hay clases ni eventos
  if( !clases.length && !eventos.length ) 
  {
    tablaClases = 
    `
      <div class="alert alert-info" role="alert">
        ${mensajeDeError}
      </div>
    `;
  }

  // Si hay clases
  else 
  {
    tablaClases =  
    `
      ${encabezadoTabla}
      
      <table class="table table-striped" id="tablaDeClases">
        
        <thead>
          <tr>
            <th scope="col">Fecha y Hora</th>
            <th scope="col">Estudiante</th>
            <th scope="col">Clase Nº</th>
            <th scope="col">Celular</th>
            <th scope="col">Estado</th>
            <th scope="col">Modificar / Eliminar</th>
          </tr>
        </thead>

        <tbody>
          ${crearFilas(items)}
        </tbody>
      
      </table>
    `;
  }
  
  return tablaClases;
}


const TURNOS = [
  { inicio: '09:00', fin: '13:00' }, // mañana
  { inicio: '14:00', fin: '18:00' }  // tarde
];


function determinarTurnoDeLaClase(horarioClase) 
{
  const minutosClase = hhmmAMinutos(horarioClase);

  for (let i = 0; i < TURNOS.length; i++) // Recorro todos los turnos
  {
    const turnoInicio = hhmmAMinutos(TURNOS[i].inicio); // Obtengo el horario de inicio del turno
    const turnoFinal  = hhmmAMinutos(TURNOS[i].fin);    // Obtengo el horario de fin del turno

    // Si el horario de la clase esta dentro del horario del turno, devuelvo la posición en el arreglo TURNO: 0 o 1
    if (minutosClase >= turnoInicio && minutosClase < turnoFinal) return i;
  }
  
  return null; // Si está exactamente en el fin de un turno o fuera de cualquier turno, no se devuelve nada
}


function crearFilas(items) // Los items son la combinación del arreglo de clases y del arreglo de eventos
{
  let htmlFilas = ``;

  for(let i = 0; i < items.length; i++)
  {
    const itemActual    = items[i];
    const itemSiguiente = items[i+1];
    const itemAnterior  = items[i - 1];

    // Me fijo si cambio de dia entre un item y otro
    const cambioDeDia =
    (  
      !itemAnterior ||
      new Date(itemAnterior.fecha).toDateString() !== new Date(itemActual.fecha).toDateString()
    );

    // Si cambio de día entre un item y otro
    if (cambioDeDia) 
    {
      htmlFilas += crearSeparadorCambioDeDia(itemActual); // Separador para indicar el cambio de día

      // Primer item del día
      const horaPrimerItem  = itemActual.datos.hora_desde.substring(0,5);
      const turnoPrimerItem = determinarTurnoDeLaClase(horaPrimerItem);

      // Si el primera item es a la mañana
      if (turnoPrimerItem === 0) 
      {
        // Muestro espacio libre desde inicio de la mañana hasta la primera clase/evento
        if ( hhmmAMinutos(horaPrimerItem) > hhmmAMinutos(TURNOS[0].inicio) )
          htmlFilas += crearFilaHorarioLibre( TURNOS[0].inicio, horaPrimerItem );
      } 
     
      // Si la primer item es a la tarde
      else if (turnoPrimerItem === 1) 
      {
        // 1) Muestro turno mañana completo como libre
        htmlFilas += crearFilaHorarioLibre( TURNOS[0].inicio, TURNOS[0].fin ); 

        // 2) Muestro espacio libre desde inicio de la tarde hasta la primera clase/evento
        if ( hhmmAMinutos(horaPrimerItem) > hhmmAMinutos(TURNOS[1].inicio) ) 
          htmlFilas += crearFilaHorarioLibre( TURNOS[1].inicio, horaPrimerItem );
      }

    }


    if ( itemActual.tipo === 'clase' )  htmlFilas += crearFilaClase(itemActual.datos);
    if ( itemActual.tipo === 'evento' ) htmlFilas += crearFilaEvento(itemActual.datos);
    
    htmlFilas += calcularSiguienteHorarioLibre(itemActual, itemSiguiente);
  }

  return htmlFilas;
}


function crearSeparadorCambioDeDia(itemActual)
{
  // --- Cabecera de día (ej: Lunes 25 de Agosto)
  const fechaObj   = new Date(itemActual.fecha);
      
  let diaSemana    = fechaObj.toLocaleDateString('es-AR', { weekday: 'long' });
  diaSemana        = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
  
  const diaNumero  = fechaObj.getDate();
      
  let mes          = fechaObj.toLocaleDateString('es-AR', { month: 'long' });
  mes              = mes.charAt(0).toUpperCase() + mes.slice(1);
      
  const cabecera   = `${diaSemana} ${diaNumero} de ${mes}`;

  // Devuelvo el separador
  return `
    <tr class="hr-separator"><td colspan="6"><hr /></td></tr>
    <tr class="day-header"><td colspan="6">${cabecera}</td></tr>
    <tr class="hr-separator"><td colspan="6"><hr /></td></tr>
  `;
  
}


function crearFilaClase(clase)
{
    const fechaObj = new Date(clase.fecha);
        
    let diaSemana = fechaObj.toLocaleDateString('es-AR', { weekday: 'long' });
        
    diaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
        
    const fechaFormateada = fechaObj.toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const horaDesde = (clase.hora_desde || '').substring(0, 5);
    const horaHasta = (clase.hora_hasta || '').substring(0, 5);
    const rangoHora = `${horaDesde} - ${horaHasta}`;

    // Uso los campos planos que devuelve tu modelo
    const nombreCompleto = `${clase.estudiante_nombre} ${clase.estudiante_apellido}`;
    const celular       = clase.estudiante_celular;

    // Armo el objeto que paso a abrirModalModificarClase
    const claseParaModal = {
      id:         clase.id,
      fecha:      clase.fecha,
      hora_desde: clase.hora_desde,
      hora_hasta: clase.hora_hasta,
      numero:     clase.numero,
      estudiante: {
        id:       clase.estudiante_id,
        nombre:   clase.estudiante_nombre,
        apellido: clase.estudiante_apellido,
        celular:  clase.estudiante_celular
      }
    };

    // JSON.stringify dentro de comillas simples para no romper el onclick
    const jsonParaOnclick = JSON.stringify(claseParaModal);

    // Calculo el estado de la clase
    const estadoClaseBadge = crearBagdeEstadoClase(fechaObj, horaDesde, horaHasta);
        
    // Creo la fila de la tabla
    return `
      <tr data-id="${clase.id}">

        <td>
        
          <div class="text-muted">
            <span class="badge bg-info text-dark me-2">${diaSemana}</span>
            <i class="bi bi-calendar3-fill me-1"></i>${fechaFormateada}
          </div>
          <span class="badge bg-primary rounded-pill fs-6">
            <i class="bi bi-clock-fill me-1"></i>${rangoHora}
          </span>

        </td>
        <td>${nombreCompleto}</td>
        <td>${clase.numero}</td>
        <td>${celular}</td>
        <td>${estadoClaseBadge}</td>
        
        <td>
          
          <button
            type="button"
            class="btn btn-sm btn-primary me-2 mb-2"
            data-bs-toggle="modal"
            data-bs-target="#claseModificacionModal"
            title="Modificar clase"
            onclick='abrirModalModificarClase(${jsonParaOnclick})'
          >
            <i class="fas fa-edit"></i>
          </button>
              
          <br>
              
          <button
            type="button"
            class="btn btn-sm btn-danger"
            title="Eliminar clase"
            aria-label="Eliminar clase"
            onclick='borrarClase(
              ${clase.id},
              ${JSON.stringify(fechaFormateada)},
              ${JSON.stringify(rangoHora)},
              ${JSON.stringify(nombreCompleto)},
              this
            )'
          >
            <i class="fas fa-trash"></i>
          </button>

        </td>
      </tr>
    `;
}


function calcularSiguienteHorarioLibre(itemActual, itemSiguiente) 
{    
  // Calculo si la siguiente clase es en el mismo dia que la clase actual
  const mismoDia = 
    itemSiguiente &&
    new Date(itemActual.fecha).toDateString() === new Date(itemSiguiente.fecha).toDateString();
  
  
  // Calculo hueco libre
  const finClaseActual       = hhmmAMinutos( itemActual.datos.hora_hasta.substring(0,5) );
  const inicioClaseSiguiente = mismoDia ? hhmmAMinutos( (itemSiguiente.datos.hora_desde || '').substring(0,5) ) : null;

  let html = '';

  // Recorro cada turno y calculo el tramo libre dentro del turno
  for (let i = 0; i < TURNOS.length; i++) 
  {
    const turnoInicio = hhmmAMinutos(TURNOS[i].inicio);
    const turnoFin    = hhmmAMinutos(TURNOS[i].fin);

    // slotStart: desde donde puede empezar el hueco de horario libre dentro de este turno
    const slotStart = Math.max(finClaseActual, turnoInicio);
    // slotEnd: hasta donde puede llegar el hueco de horario libre dentro de este turno
    const slotEnd = inicioClaseSiguiente !== null ? Math.min(inicioClaseSiguiente, turnoFin) : turnoFin;

    if (slotStart < slotEnd) html += crearFilaHorarioLibre(minutosAhhmm(slotStart), minutosAhhmm(slotEnd));
  }

  return html;
}



function crearFilaHorarioLibre(inicioHorarioLibre, finHorarioLibre)
{
  // Devuelvo fila que indica el horario libre hasta la siguiente clase
  return `
    <tr class="free-slot">
      <td colspan="6" class="text-center">
        <i class="bi bi-unlock-fill me-2 fs-5"></i>
        <span class="badge bg-success me-3">Libre</span>
        <strong>Horario libre:</strong>
        <span>${inicioHorarioLibre} - ${finHorarioLibre}</span>
      </td>
    </tr>
  `;
}


function crearFilaEvento(evento) 
{
  // Parseo la información para que me sea más comoda de trabajar 
  const horaDesde = (evento.hora_desde || '').substring(0, 5);
  const horaHasta = (evento.hora_hasta || '').substring(0, 5);
  const rangoHora = `${horaDesde} - ${horaHasta}`;

  const fechaObj = new Date(evento.fecha);
        
  const fechaFormateada = fechaObj.toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });


  // Armo el objeto que paso a abrirModalModificarEvento
  const eventoParaModal = {
    id:           evento.id,
    fecha:        evento.fecha,
    hora_desde:   evento.hora_desde,
    hora_hasta:   evento.hora_hasta,
    descripcion:  evento.descripcion
  };

  // JSON.stringify dentro de comillas simples para no romper el onclick
  const jsonParaOnclick = JSON.stringify(eventoParaModal);

  // Creo y Devuelvo una fila que indica un evento con señal de advertencia
  return `
    <tr class="warning-slot">

      <td colspan="5" class="text-center">
        <i class="bi bi-exclamation-triangle-fill me-2 fs-5 text-warning"></i>
        <span class="badge bg-warning text-dark me-3">¡Atención!</span>
        <strong>${evento.descripcion}:</strong>
        <span>${rangoHora}</span>
      </td>

      <td>
          
        <button
            type="button"
            class="btn btn-sm btn-primary me-2 mb-2"
            data-bs-toggle="modal"
            data-bs-target="#eventoModificacionModal"
            title="Modificar evento"
            onclick='abrirModalModificarEvento(${jsonParaOnclick})'
          >
            <i class="fas fa-edit"></i>
        </button>
              
        <br>
              
        <button
          type="button"
          class="btn btn-sm btn-danger"
          title="Eliminar evento"
          aria-label="Eliminar evento"
          onclick='borrarEvento(
            ${evento.id}, 
            ${JSON.stringify(evento.descripcion)}, 
            ${JSON.stringify(fechaFormateada)}, 
            ${JSON.stringify(rangoHora)}
          )'
        >
          <i class="fas fa-trash"></i>
        </button>

      </td>

    </tr>
  `;
}



function crearBagdeEstadoClase(fechaClase, horaDesde, horaHasta)
{
  // Obtengo la fecha y hora actual
  let fechaActual = new Date();
  fechaActual.setHours(0, 0, 0, 0); // Seteo la hora a la medianoche

  let horaActual  = obtenerHoraArgentinaActual();

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

  return estadoClaseBadge;
}



function deYYYYMMDDaDDMMYYYY(fecha)
{
  const [YYYY, MM, DD] = fecha.split("-");
  return `${DD}/${MM}/${YYYY}`;
}


function parseoTiempoStringATiempoDate(tiempoString)
{
  if(tiempoString.length == 5) tiempoString += ':00'; // El formulario devuelve hhmm mientras que la base de datos devuelve hhmmss

  const [hh, mm, ss] = tiempoString.split(':').map(Number);
  const hoy = new Date();
  const hoyConTiempo = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), hh, mm, ss);

  return hoyConTiempo;
}



async function comprobarSuperposicion(fecha, hora_desde, hora_hasta, id = null)
{
  // Métodos de consulta a la base de datos
  const { buscarEventosPorRangoDeFechas } = require('../models/eventoModel.js');
  const { buscarClasesPorRangoDeFechas }  = require('../models/claseModel.js');

  // Variables de entorno
  require('dotenv').config(); // Carga las variables del archivo .env en process.env
  const maxClasesSuperpuestas = process.env.MAX_CLASES;

  let haySuperposicion = false;
  let mensajeDeError = ''

  const inicioNuevo = parseoTiempoStringATiempoDate(hora_desde).getTime();
  const finNuevo    = parseoTiempoStringATiempoDate(hora_hasta).getTime();

  if (finNuevo <= inicioNuevo) 
  {
    haySuperposicion = true;
    mensajeDeError   = 'Horario inválido: la hora de fin debe ser posterior a la de inicio';
    return { haySuperposicion, mensajeDeError }; // retorno temprano
  }

  let contadorClasesSuperpuestas = 0;

  // Compruebo si fecha y horarios se superponen para la clase nueva y las clases ya existentes
  const clases = await buscarClasesPorRangoDeFechas(fecha, fecha);

  for (const clase of clases)
  {
    if( id != null && clase.id == id ) continue; // Para evitar problemas durante la modificacion, evito revisar la clase que voy a modificar. Paso a la siguiente iteracion

    const inicioExistente = parseoTiempoStringATiempoDate(clase.hora_desde).getTime();
    const finExistente    = parseoTiempoStringATiempoDate(clase.hora_hasta).getTime();

    // Comparo los horarios
    const horariosSuperpuestos = !(finNuevo <= inicioExistente || inicioNuevo >= finExistente);

    if( horariosSuperpuestos ) contadorClasesSuperpuestas++;

    if ( maxClasesSuperpuestas == contadorClasesSuperpuestas )
    {
      console.log('Error. Clase nueva superpuesta con otra clase existente');
      haySuperposicion = true;
      mensajeDeError = 'Clase nueva superpuesta con otra clase existente';
      return { haySuperposicion, mensajeDeError }; // retorno temprano
    }

  }


  // Compruebo si fecha y horarios se superponen para la clase nueva y los eventos ya existentes
  const eventos = await buscarEventosPorRangoDeFechas(fecha, fecha);

  for (const evento of eventos)
  {
    const inicioExistente = parseoTiempoStringATiempoDate(evento.hora_desde).getTime();
    const finExistente    = parseoTiempoStringATiempoDate(evento.hora_hasta).getTime();

    // Comparo los horarios
    const horariosSuperpuestos = !(finNuevo <= inicioExistente || inicioNuevo >= finExistente);

    if ( horariosSuperpuestos )
    {
      console.log('Error. Clase nueva superpuesta con un evento existente');
      haySuperposicion = true;
      mensajeDeError = 'Clase nueva superpuesta con un evento existente';
      return { haySuperposicion, mensajeDeError }; // retorno temprano
    }

  }

  return { haySuperposicion, mensajeDeError };
}



function comprobarDiaHorario(fecha, hora_desde, hora_hasta)
{
  let diaHorarioValido = true;
  let mensajeDeError = '';

  const horariosLaborales = {
    0: { primerTurnoDesde: '09:00', primerTurnoHasta: '13:00', segundoTurnoDesde: '14:00', segundoTurnoHasta: '18:00' }, // lunes
    1: { primerTurnoDesde: '09:00', primerTurnoHasta: '13:00', segundoTurnoDesde: '14:00', segundoTurnoHasta: '18:00' }, // martes
    2: { primerTurnoDesde: '09:00', primerTurnoHasta: '13:00', segundoTurnoDesde: '14:00', segundoTurnoHasta: '18:00' }, // miércoles
    3: { primerTurnoDesde: '09:00', primerTurnoHasta: '13:00', segundoTurnoDesde: '14:00', segundoTurnoHasta: '18:00' }, // jueves
    4: { primerTurnoDesde: '09:00', primerTurnoHasta: '13:00', segundoTurnoDesde: '14:00', segundoTurnoHasta: '18:00' }, // viernes
    5: { primerTurnoDesde: '09:00', primerTurnoHasta: '13:00', segundoTurnoDesde: null,    segundoTurnoHasta: null },  // sábado
    6: null,  // domingo cerrado
  };

  const inicioNuevo = parseoTiempoStringATiempoDate(hora_desde).getTime();
  const finNuevo    = parseoTiempoStringATiempoDate(hora_hasta).getTime();

  // Compruebo si los horarios de inicio y fin son validos
  if (finNuevo <= inicioNuevo) 
  {
    return { diaHorarioValido: false, mensajeDeError: 'Horario inválido: la hora de fin debe ser posterior a la de inicio' };
  }

  // Compruebo si la fecha es valida
  const diaDeLaSemana = new Date(fecha).getDay(); // Devuelve 0 para el domingo y 6 para el sabado
  
  if( diaDeLaSemana == 6 ) 
  {
    diaHorarioValido = false;
    mensajeDeError = 'Día invalido. Los domingos no se trabaja';
    return { diaHorarioValido, mensajeDeError }; // retorno temprano
  }

  // Compruebo si los horarios de inicio y fin estan dentro de las jornadas laborales
  const turnosLaborales =  horariosLaborales[diaDeLaSemana];

  const primerTurnoDesde  = parseoTiempoStringATiempoDate(turnosLaborales.primerTurnoDesde).getTime();
  const primerTurnoHasta  = parseoTiempoStringATiempoDate(turnosLaborales.primerTurnoHasta).getTime();
  const segundoTurnoDesde = turnosLaborales.segundoTurnoDesde ? parseoTiempoStringATiempoDate(turnosLaborales.segundoTurnoDesde).getTime() : null;
  const segundoTurnoHasta = turnosLaborales.segundoTurnoDesde ? parseoTiempoStringATiempoDate(turnosLaborales.segundoTurnoHasta).getTime() : null;

  if
  ( 
    !( // Si el horario de inicio NO esta dentro del horario laboral de ese dia
      ( inicioNuevo >= primerTurnoDesde  && inicioNuevo <= primerTurnoHasta  ) 
      ||
      ( inicioNuevo >= segundoTurnoDesde && inicioNuevo <= segundoTurnoHasta )
    )
  )
  {
    diaHorarioValido = false;
    mensajeDeError = 'Horario de inicio invalido';
    return { diaHorarioValido, mensajeDeError }; // retorno temprano
  }


  if
  ( 
    !( // Si el horario de fin NO esta dentro del horario laboral de ese dia
      ( finNuevo >= primerTurnoDesde  && finNuevo <= primerTurnoHasta  ) 
      ||
      ( finNuevo >= segundoTurnoDesde && finNuevo <= segundoTurnoHasta )
    )
  )
  {
    diaHorarioValido = false;
    mensajeDeError = 'Horario de fin invalido';
    return { diaHorarioValido, mensajeDeError }; // retorno temprano
  }


  // Reviso que el horario NO empiece en un turno y termine en otro
  if 
  ( 
    ( inicioNuevo >= primerTurnoDesde  && inicioNuevo <= primerTurnoHasta ) 
    && 
    ( finNuevo >= segundoTurnoDesde && finNuevo <= segundoTurnoHasta ) // NOTA: El caso inverso no se puede dar porque nos aseguramos de que el horario_desde siempre sea menor a horario_hasta
  ) 
  {
    diaHorarioValido = false; 
    mensajeDeError = 'La clase no puede empezar en un turno y terminar en otra';
    return { diaHorarioValido, mensajeDeError }; // retorno temprano
  }

  return { diaHorarioValido, mensajeDeError };
}


module.exports = { 
  armadoTablaClases, 
  deYYYYMMDDaDDMMYYYY,
  comprobarSuperposicion,
  comprobarDiaHorario
}