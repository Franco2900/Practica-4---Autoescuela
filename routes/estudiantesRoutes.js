// URL base: http://DOMINIO/estudiantes/

// Modulos
const router = require('express').Router(); // Permite definir rutas

// Defino las rutas de navegación del usuario
router.get   ( '/',                    require('../controllers/estudiantesController.js').getEstudiantes );
router.post  ( '/crearEstudiante',     require('../controllers/estudiantesController.js').postCrearEstudiante );
router.post  ( '/modificarEstudiante', require('../controllers/estudiantesController.js').postModificarEstudiante );
router.delete( '/borrarEstudiante',    require('../controllers/estudiantesController.js').deleteBorrarEstudiante );


router.post( '/buscarEstudiantePorNombre',   require('../controllers/estudiantesController.js').postBuscarEstudiantePorNombre );
router.post( '/buscarEstudiantePorApellido', require('../controllers/estudiantesController.js').postBuscarEstudiantePorApellido );

module.exports = router;