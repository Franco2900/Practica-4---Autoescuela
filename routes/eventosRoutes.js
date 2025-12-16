// URL base: http://DOMINIO/eventos/

// Modulos
const router = require('express').Router(); // Permite definir rutas

// Defino las rutas de navegación del usuario
//router.get   ( '/',           require('../controllers/eventosController.js').getEventos );
router.post  ( '/crearEvento',     require('../controllers/eventosController.js').postCrearEvento );
router.put   ( '/modificarEvento', require('../controllers/eventosController.js').putModificarEvento );
router.delete( '/borrarEvento',    require('../controllers/eventosController.js').deleteBorrarEvento );


module.exports = router;