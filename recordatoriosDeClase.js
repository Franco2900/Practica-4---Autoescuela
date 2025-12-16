// Modulos
const nodemailer = require('nodemailer'); // Modulo para enviar emails


// Variables de entorno
require('dotenv').config(); // Carga las variables del archivo .env en process.env
const emailEmisorio = process.env.EMAIL_EMISORIO;
const passwordEmail = process.env.PASSWORD_EMAIL;


// Métodos de consulta a la base de datos
const { buscarClasesDeHoy, recordatorioEnviado } = require('./models/claseModel.js');
const { buscarEstudiantePorId } = require('./models/estudianteModel.js');


// Configuración del SMTP (Simple Mail Transfer Protocol), protocolo usado para enviar los emails.
let transporter = nodemailer.createTransport({

    host: 'smtp.gmail.com', // Dirección del servidor SMTP de Gmail que recibe y procesa el envio
    port: 587,              // Puerto TCP en el que el servidor SMTP de Gmail escucha peticiones
    secure: false,          // Indico si la conexión esta cifrada
    auth: {                 // Datos de autentificación de la cuenta de email desde el que se envia el correo
        user: emailEmisorio,
        pass: passwordEmail
    }

});



async function mandarRecordatorio() 
{
    const minutosDeAntelacionParaAvisar = 1440; // Un día de anticipacion

    const hora_actual = hhmmAMinutos( obtenerHoraArgentinaActual() ); // Paso el horario actual a minutos

    // Recorro todas las clases de hoy
    const clasesDeHoy = await buscarClasesDeHoy();

    for (const clase of clasesDeHoy) 
    {
        let hora_de_clase = hhmmAMinutos(clase.hora_desde); // Paso el horario de comienzo de la clase a minutos
        const diferencia = hora_de_clase - hora_actual;     // Calculo la diferencia de tiempo entre la hora de la clase y la hora actual en minutos  

        const estudiante = await buscarEstudiantePorId(clase.estudiante_id); // Busco los datos del estudiante

        // Mando recordatorio de la clase si
        if
        ( 
            clase.recordatorioEnviado == 0 // El recordatorio de la clase todavía no fue enviado
            &&
            diferencia > 0 // La clase todavía no empezó
            &&
            diferencia <= minutosDeAntelacionParaAvisar // Faltan X minutos o menos para la clase del estudiante 
            &&
            ( estudiante.email != null && estudiante.email.length > 1 ) // El estudiante tiene email
        )
        {
            // Mensaje a enviar
            const htmlBody = `
                <p>
                    Hola ${estudiante.nombre} ${estudiante.apellido}. 
                    Este es un mensaje de la autoescuela My Way. <br>
                    No se olvide de su clase N° ${clase.numero} para la fecha ${clase.fecha} 
                    desde las ${clase.hora_desde} horas hasta las ${clase.hora_hasta} horas.
                    
                    <br></br>
                    
                    Nuestra información de contacto: <br>
                    Email: myway.autoescuela@live.com <br>
                    Télefono fijo: 4299-1750 <br>
                    Whatsapp: 11-4042-8870 

                    <br></br>

                    Mensaje automatico. Por favor, no responder.
                </p>
            `;
            
            // Envio el email
            await transporter.sendMail({
                from: { name: 'Autoescuela My Way', address: emailEmisorio },
                to: `${estudiante.email}`,                  // Email (o emails - separados por coma) del destinatario
                subject: 'Recordatorio de clase en My Way', // Asunto del correo
                html: htmlBody                              // Versión en HTML del cuerpo. Permite etiquetas, estilos y formatos enriquecidos.
            });

            await recordatorioEnviado(clase.id); // Actualizo el estado del recordatorio en la base de datos

            // Log para el CMD
            console.log(`Recordatorio de la clase N° ${clase.numero} enviado al estudiante ${estudiante.nombre} ${estudiante.apellido}`); 
        }

    };

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


// Exportación de funciones
module.exports = { mandarRecordatorio };