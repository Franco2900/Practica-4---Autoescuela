// ================== MÓDULOS Y DEPENDENCIAS ==================
const express      = require('express');         // Modulo para la navegación web y creación del servidor
const session      = require('express-session'); // Modulo para usar variables de sesion
const bodyParser   = require('body-parser');     // Modulo para parsear los cuerpos de las solicitudes HTTP
const path         = require('path');
const randomstring = require("randomstring");    // Modulo para generar string al azar


// ================== CONFIGURACIÓN DE LA APP ==================
const app = express(); // Inicialización de la aplicación Express

// Variables de entorno
require('dotenv').config(); // Carga las variables del archivo .env en process.env
const puerto  = process.env.PUERTO;
const dominio = process.env.DOMINIO;


// ================== CONFIGURACIÓN DEL MOTOR DE PLANTILLAS ==================
app.set('views', path.join(__dirname, 'views')); // Indico que las vistas estan en la carpeta 'views'
app.set('view engine', 'ejs');                   // Indico que motor de plantillas uso


// ================== MIDDLEWARES GLOBALES ================== 
// Los middlewares en Express son funciones que se ejecutan antes de que una solicitud 
// llegue a una ruta específica. Estos se aplican a **todas** las solicitudes de la aplicación

app.use(bodyParser.urlencoded({ extended: true })); // Permite parsear formularios
app.use(express.json());                            // Permite parsear JSON

// Defino la sesión
app.use(session({                    
    secret: randomstring.generate(), // Clave secreta usada para firmar y validar la cookie de sesión.
    resave: false,                   // Evita que la sesión se guarde de nuevo en el servidor si no ha sido modificada.
    saveUninitialized: false,        // No guarda sesiones de usuarios no autenticados
    cookie: {
        maxAge: 1000 * 60 * 60 * 24  // Duración de la cookie de sesión: 1 dia
    }
}));

// Asigno distintos datos para que esten disponible en todas las vistas EJS 
app.use((req, res, next) => {
    
    res.locals.usuario = req.session;

    next(); // Se continúa al siguiente middleware o ruta
});


// ================== MIDDLEWARES PARA RUTAS ESPECÍFICAS ==================
// Algunos middlewares solo se aplican a ciertas rutas, permitiendo modificar 
// su comportamiento sin afectar a toda la aplicación. 

// ================== ARCHIVOS ESTÁTICOS ==================
// Express envia los archivos en estas rutas directamente sin pasar por lógica adicional del servidor.
app.use('/images/style',   express.static('./public/images/style') );
app.use('/css',            express.static('./public/css') );
app.use('/js',             express.static('./public/js') );
// Bootstrap
app.use('/bootstrapCSS',   express.static('./node_modules/bootstrap/dist/css')); 
app.use('/bootstrapJS',    express.static('./node_modules/bootstrap/dist/js'));
app.use('/bootstrapICONS', express.static('./node_modules/bootstrap-icons/font'));
//Font awesome
app.use('/fontawesome/css', express.static('./node_modules/@fortawesome/fontawesome-free/css'));
app.use('/fontawesome/webfonts', express.static('./node_modules/@fortawesome/fontawesome-free/webfonts'));
app.use('/fontawesome/js',  express.static('./node_modules/@fortawesome/fontawesome-free/js'));

// ================== RUTAS DE NAVEGACIÓN DEL USUARIO ==================
app.use('/',            require('./routes/homeRoutes.js') );
app.use('/contacto',    require('./routes/contactoRoutes.js') );
app.use('/login',       require('./routes/loginRoutes.js') );
app.use('/logout',      require('./routes/logoutRoutes.js') );

app.use('/estudiantes', require('./routes/estudiantesRoutes.js') );
app.use('/clases',      require('./routes/clasesRoutes.js') );
app.use('/pagos',       require('./routes/pagosRoutes.js') );
app.use('/eventos',     require('./routes/eventosRoutes.js') );

// ================== INICIO DEL SERVIDOR ==================
const servidor = app.listen(puerto, () => {

    console.info(`Aplicación iniciada en el puerto: ${puerto}`);
    console.info(`Servidor corriendo en el dominio: ${dominio}`);
});


// ================== ENVIO DE RECORDATORIOS A ESTUDIANTES ==================
//const { mandarRecordatorio } = require('./recordatoriosDeClase.js');
//setInterval(mandarRecordatorio, 600_000); // Ejecuta la función cada X milisegundos (10 minutos)

module.exports = app;