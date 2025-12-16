async function verPagosDelEstudiante(estudiante_id) 
{
  estudianteActualId = estudiante_id;
  
  const row = document.querySelector(`tr[data-id="${estudiante_id}"]`);
  const nombre = row.children[0].innerText;
  const apellido = row.children[1].innerText;
  estudianteActualNombre = `${nombre} ${apellido}`;

  // Cambio el titulo del modal
  document.getElementById('estudiantePagosModalLabel').innerText = `Pagos del Estudiante ${estudianteActualNombre}`

  const modalEl = document.getElementById('estudiantePagosModal');
  const listadoDePagos = modalEl.querySelector('#listadoDePagos');

  try {
    // 1) Enviar petición al servidor
    const response = await fetch(
      `${window.location.origin}/pagos/pagosDelEstudiante`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ estudiante_id })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    const data = await response.json();
    listadoDePagos.innerHTML = '';

    // 2) Si no hay pagos, mostrar mensaje
    if (!data.length) {
      listadoDePagos.innerHTML = `
        <li class="list-group-item text-center text-muted">
          No se encontraron pagos de este estudiante
        </li>`;
      return;
    }

    // 3) Ordenar pagos por fecha ascendente
    data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Formateador de moneda ARS
    const nf = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

    // 4) Renderizar cada pago
    data.forEach(pago => {
      const fechaObj = new Date(pago.fecha);

      let diaSemana = fechaObj.toLocaleDateString('es-AR', { weekday: 'long' });
      diaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

      const fechaFormateada = fechaObj.toLocaleDateString('es-AR', {
        day:   '2-digit',
        month: '2-digit',
        year:  'numeric'
      });

      // hora provista como 'HH:MM:SS' -> tomar HH:MM
      const hora = (typeof pago.hora === 'string') ? pago.hora.substring(0, 5) : new Date(`1970-01-01T${pago.hora}`).toTimeString().substring(0,5);

      const item = document.createElement('li');
      item.className = 'list-group-item d-flex justify-content-between align-items-center';
      item.innerHTML = `
        <div>
          <h6 class="mb-1">
            Pago <small class="text-muted">#${pago.numero}</small>
          </h6>
          <div class="text-muted mb-1">
            <span class="badge bg-info text-dark me-2">${diaSemana}</span>
            <i class="bi bi-calendar3-fill me-1"></i>${fechaFormateada}
          </div>
          <div class="fw-semibold">
            ${nf.format(pago.cantidad_pagada)}
          </div>
        </div>

        <!-- Hora de pago -->
        <span class="badge bg-primary rounded-pill fs-6">
          <i class="bi bi-clock-fill me-1"></i>${hora}
        </span>


        <div class="d-flex justify-content-center gap-2 mt-2">
          
        <!-- Botón para mostrar modal de edición -->
         
          <button
            type="button"
            class="btn btn-sm btn-primary"
            data-bs-dismiss="modal"
            data-bs-toggle="modal"
            data-bs-target="#pagoModificacionModal"
            title="Modificar pago"
            onclick='abrirModalModificarPago(${JSON.stringify(pago)})'
          >
            <i class="fas fa-edit"></i>
          </button>
        
          <!-- Botón para eliminar -->
          <button
            type="button"
            class="btn btn-sm btn-danger"
            title="Eliminar pago"
            aria-label="Eliminar pago"
            onclick="borrarPago(${pago.id}, this)"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      listadoDePagos.appendChild(item);
    });
  } catch (error) {
    console.error('Error al buscar los pagos del estudiante:', error);

    listadoDePagos.innerHTML = `
      <li class="list-group-item text-center text-danger">
        Ocurrió un error al cargar los pagos
      </li>`;
  }
}



function abrirModalCrearPago() 
{
  // Fecha y hora actuales locales
  const now = new Date();

  // Formatea fecha a yyyy-MM-dd
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const fechaValue = `${year}-${month}-${day}`;

  // Formatea hora a HH:mm
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const horaValue = `${hours}:${minutes}`;

  // Asigna valores a los inputs
  document.getElementById('fechaCreacionInput').value = fechaValue;
  document.getElementById('horaCreacionInput').value  = horaValue;
  document.getElementById('estudianteCreacionSelect').value = estudianteActualId; // Variable global
  
  // Deshabilita el select  
  document.getElementById('estudianteCreacionSelect').disabled = true;

  // Cambio el titulo del modal
  document.getElementById('pagoCreacionModalLabel').innerText = `Creación de pago para el estudiante ${estudianteActualNombre}`
}



async function crearPago()
{
  // Obtengo los datos del formulario
  const form = document.getElementById('pagoCreacionForm');
  const formData = {
    cantidadPagada: form.cantidad_pagada.value,
    fecha:          form.fecha.value,
    hora:           form.hora.value,
    estudiante_id:  form.estudiante_id.value
  };

  // Validación del formulario
  if ( !formData.cantidadPagada || !formData.fecha || !formData.hora || !formData.estudiante_id) {
    alert('Llene todos los datos del pago.');
    return;
  }

  // Petición al servidor
  try 
  {
    const response = await fetch(`${window.location.origin}/pagos/crearPago`, {
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
    alert('Ocurrió un error al crear el estudiante: ' + error.message);  
  }

}



function abrirModalModificarPago(pago) 
{
  const fechaObj = new Date(pago.fecha);
  const fechaFormateada = fechaObj.toISOString().split('T')[0];

  document.getElementById('pagoIdModificacionInput').value   = pago.id;
  document.getElementById('cantidadModificacionInput').value = pago.cantidad_pagada;
  document.getElementById('fechaModificacionInput').value    = fechaFormateada;
  document.getElementById('horaModificacionInput').value     = pago.hora;
}



async function modificarPago()
{
  const id              = document.getElementById('pagoIdModificacionInput').value;
  const cantidad_pagada = document.getElementById('cantidadModificacionInput').value;
  const fecha           = document.getElementById('fechaModificacionInput').value;
  const hora            = document.getElementById('horaModificacionInput').value;

  // Validación del formulario
  if ( !cantidad_pagada || !fecha || !hora) {
    alert('Llene todos los datos del formulario');
    return;
  }

  // Petición al servidor
  try 
  {
    const response = await fetch(`${window.location.origin}/pagos/modificarPago`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify( { id, cantidad_pagada, fecha, hora } )
    });

    // Verifica que la respuesta sea exitosa
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || response.statusText);
    }

    // Parsea el JSON de respuesta
    const data = await response.json();
        
    console.log('Éxito:', data);
    alert(`Pago modificado exitosamente`);
    window.location.href = '/estudiantes';
  } 
  catch (error) 
  {
    console.error('Error al modificar:', error);
    alert('Ocurrió un error al modificar el pago: ' + error.message);
  }

}


async function borrarPago(id ,boton) 
{
    // Pregunto al usuario si de verdad quiere borrar el pago. Devuelve un booleano
    const confirmaBorrado = window.confirm(`¿De verdad desea eliminar el pago?`);
    
    // Si el usuario cancela, se sale de la función
    if (!confirmaBorrado) return;
    
    // Petición al servidor
    try 
    {
        const response = await fetch(`${dominio}/pagos/borrarPago`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify( { id } )
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || response.statusText);
        }

        //Metodo para quitar el pago sin reiniciar la página

        // Eliminar el <li> del DOM
        const item = boton.closest('li.list-group-item');
        if (item) item.remove();

        // Si ya no quedan ítems, muestro el mensaje de “sin pagos”
        const listado = document.querySelector('#listadoDePagos');

        if (!listado.querySelector('li.list-group-item')) {
          listado.innerHTML = `
            <li class="list-group-item text-center text-muted">
              No se encontraron pagos de este estudiante
            </li>`;
        }
    
        alert(`Pago eliminado correctamente`);
    } 
    catch (error) 
    {
        console.error('Error al eliminar:', error);
        alert('No se pudo eliminar el estudiante: ' + error.message);
    }
}