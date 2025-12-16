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

  let haySuperposicion = false;
  let mensajeDeError = ''

  const inicioNuevo     = parseoTiempoStringATiempoDate(hora_desde).getTime();
  const finNuevo        = parseoTiempoStringATiempoDate(hora_hasta).getTime();

  if (finNuevo <= inicioNuevo) return { haySuperposicion: true, mensajeDeError: 'Horario inválido: la hora de fin debe ser posterior a la de inicio' };
  
  // Compruebo si fecha y horarios se superponen para el evento nuevo y las clases ya existentes
  const clases = await buscarClasesPorRangoDeFechas(fecha, fecha);

  for (const clase of clases)
  {
    const inicioExistente = parseoTiempoStringATiempoDate(clase.hora_desde).getTime();
    const finExistente    = parseoTiempoStringATiempoDate(clase.hora_hasta).getTime();

    // Comparo los horarios
    const horariosSuperpuestos = !(finNuevo <= inicioExistente || inicioNuevo >= finExistente);

    if ( horariosSuperpuestos )
    {
      console.log('Error. Evento superpuesto con una clase existente');
      haySuperposicion = true;
      mensajeDeError = 'Evento superpuesto con una clase existente';
      return { haySuperposicion, mensajeDeError }; // retorno temprano
    }

  }


  // Compruebo si fecha y horarios se superponen para el evento nuevo y los eventos ya existentes
  const eventos = await buscarEventosPorRangoDeFechas(fecha, fecha);

  for (const evento of eventos)
  {
    if( id != null && evento.id == id ) continue; // Para evitar problemas durante la modificacion, evito revisar el evento que voy a modificar. Paso a la siguiente iteracion

    const inicioExistente = parseoTiempoStringATiempoDate(evento.hora_desde).getTime();
    const finExistente    = parseoTiempoStringATiempoDate(evento.hora_hasta).getTime();

    // Comparo los horarios
    const horariosSuperpuestos = !(finNuevo <= inicioExistente || inicioNuevo >= finExistente);

    if ( horariosSuperpuestos )
    {
      console.log('Error. Evento nuevo superpuesto con un evento existente');
      haySuperposicion = true;
      mensajeDeError = 'Evento nuevo superpuesto con un evento existente';
      return { haySuperposicion, mensajeDeError }; // retorno temprano
    }

  }

  return { haySuperposicion, mensajeDeError };
}


module.exports = { 
  comprobarSuperposicion
}