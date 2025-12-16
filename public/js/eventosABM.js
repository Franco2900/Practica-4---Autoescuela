async function crearEvento()
{
  // Obtengo los datos del formulario
  const form = document.getElementById('eventoCreacionForm');
  const formData = {
    fecha:       form.fecha.value,
    hora_desde:  form.hora_desde.value,
    hora_hasta:  form.hora_hasta.value,
    descripcion: form.descripcion.value
  };

  // Validación del formulario
  if (!formData.fecha || !formData.hora_desde || !formData.hora_hasta || !formData.descripcion) {
    alert('Llene todos los datos del evento.');
    return;
  }

  // Petición al servidor
  try 
  {
    const response = await fetch(`${window.location.origin}/eventos/crearEvento`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify( formData )
    });

    // Verifica que la respuesta sea exitosa
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || response.statusText);
    }

    // Parsea el JSON de respuesta
    const data = await response.json();
    console.log('Éxito:', data);

    alert(`Evento del ${formData.fecha} desde las ${formData.hora_desde} hasta las ${formData.hora_hasta} creado exitosamente`);
    window.location.href = '/clases';
  } 
  catch (error) 
  {
    console.error('Error al crear:', error);
    alert('Ocurrió un error al crear el evento: ' + error.message);  
  }

}


// MODIFICAR
function abrirModalModificarEvento(evento) 
{
    const fecha = new Date(evento.fecha);

    const yyyy = fecha.getFullYear();
    const mm   = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd   = String(fecha.getDate()).padStart(2, '0');
    const fechaInput = `${yyyy}-${mm}-${dd}`;

    // Rellenar campos
    document.getElementById('modificacionEventoID').value               = evento.id;
    document.getElementById('fechaModificacionEventoInput').value       = fechaInput;
    document.getElementById('horaDesdeModificacionEventoInput').value   = evento.hora_desde.substring(0,5);
    document.getElementById('horaHastaModificacionEventoInput').value   = evento.hora_hasta.substring(0,5);
    document.getElementById('descripcionModificacionEventoInput').value = evento.descripcion;
}


async function modificarEvento() 
{
  const form = document.getElementById('eventoModificacionForm');
  const formData = {
    id:          document.getElementById('modificacionEventoID').value,
    fecha:       form.fecha.value,
    hora_desde:  form.hora_desde.value + ':00',
    hora_hasta:  form.hora_hasta.value + ':00',
    descripcion: form.descripcion.value
  };

    try 
    {
      const resp = await fetch(`${window.location.origin}/eventos/modificarEvento`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData)
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || resp.statusText);
      }

      alert(`Evento modificado exitosamente`);
      window.location.href = '/clases';
    } 
    catch (err) 
    {
      console.error('Error al modificar evento:', err);
      alert('No se pudo modificar el evento: ' + err.message);
    }
}



async function borrarEvento(id, descripcion, fecha, rangoHora) 
{
  // Pregunto al usuario si de verdad quiere borrar el evento. Devuelve un booleano
  const confirmaBorrado = window.confirm(
    `¿De verdad desea eliminar el evento ${descripcion} del ${fecha} entre las ${rangoHora} horas?
  `);
    
  // Si el usuario cancela, se sale de la función
  if (!confirmaBorrado) return;
    
  // Petición al servidor
  try 
  {
    const response = await fetch(`${dominio}/eventos/borrarEvento`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify( { id } )
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || response.statusText);
    }

    alert(`Evento eliminado exitosamente`);
    window.location.href = '/clases';
  } 
  catch (error) 
  {
    console.error('Error al eliminar:', error);
    alert('No se pudo eliminar el evento: ' + error.message);
  }
}