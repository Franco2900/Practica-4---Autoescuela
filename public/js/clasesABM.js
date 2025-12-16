async function crearClase()
{
  // Obtengo los datos del formulario
  const form = document.getElementById('claseCreacionForm');
  const formData = {
    fecha:         form.fecha.value,
    hora_desde:    form.hora_desde.value,
    hora_hasta:    form.hora_hasta.value,
    estudiante_id: form.estudiante_id.value
  };

  // Validación del formulario
  if (!formData.fecha || !formData.hora_desde || !formData.hora_hasta || !formData.estudiante_id) {
    alert('Llene todos los datos de la clase.');
    return;
  }

  // Petición al servidor
  try 
  {
    const response = await fetch(`${window.location.origin}/clases/crearClase`, {
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

    alert(`Clase del ${formData.fecha} desde las ${formData.hora_desde} hasta las ${formData.hora_hasta} creada exitosamente`);
    window.location.href = '/clases';
  } 
  catch (error) 
  {
    console.error('Error al crear:', error);
    alert('Ocurrió un error al crear la clase: ' + error.message);  
  }

}



function abrirModalModificarClase(clase) 
{
    const fecha = new Date(clase.fecha);

    const yyyy = fecha.getFullYear();
    const mm   = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd   = String(fecha.getDate()).padStart(2, '0');
    const fechaInput = `${yyyy}-${mm}-${dd}`;

    // Rellenar campos
    document.getElementById('modificacionClaseID').value          = clase.id;
    document.getElementById('fechaModificacionClaseInput').value       = fechaInput;
    document.getElementById('horaDesdeModificacionClaseInput').value   = clase.hora_desde.substring(0,5);
    document.getElementById('horaHastaModificacionClaseInput').value   = clase.hora_hasta.substring(0,5);
    document.getElementById('estudianteModificacionClaseSelect').value = clase.estudiante.id;
}



async function modificarClase() 
{
    const form = document.getElementById('claseModificacionForm');
    const formData = {
      id:         document.getElementById('modificacionClaseID').value,
      fecha:      form.fecha.value,
      hora_desde: form.hora_desde.value + ':00',
      hora_hasta: form.hora_hasta.value + ':00',
      estudiante_id: form.estudiante_id.value
    };

    try 
    {
      const resp = await fetch(`${window.location.origin}/clases/modificarClase`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData)
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || resp.statusText);
      }

      alert(`Clase modificada exitosamente`);
      window.location.href = '/clases';
    } 
    catch (err) 
    {
      console.error('Error al modificar clase:', err);
      alert('No se pudo modificar la clase: ' + err.message);
    }
}



async function borrarClase(id, fecha, hora, alumno, boton) 
{
    // Pregunto al usuario si de verdad quiere borrar la clase. Devuelve un booleano
    const confirmaBorrado = window.confirm(
      `¿De verdad desea eliminar la clase del ${fecha} a las ${hora} horas del estudiante ${alumno}?
    `);
    
    // Si el usuario cancela, se sale de la función
    if (!confirmaBorrado) return;
    
    // Petición al servidor
    try 
    {
      const response = await fetch(`${dominio}/clases/borrarClase`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify( { id } )
      });

      if (!response.ok) {
          const text = await response.text();
          throw new Error(text || response.statusText);
      }

      //Metodo para quitar al alumno sin reiniciar la página
      //const filaDeLaClase = boton.closest('tr'); 
      //filaDeLaClase.remove(); // Remueve la fila del estudiante

      alert(`Clase eliminada exitosamente`);
      window.location.href = '/clases';
    } 
    catch (error) 
    {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar la clase: ' + error.message);
    }
}