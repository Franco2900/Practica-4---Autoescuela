// URL base: http://DOMINIO/pagos/

// Modulos
const router = require('express').Router(); // Permite definir rutas
 
// Defino las rutas de navegación del usuario
router.post  ( '/crearPago',     require('../controllers/pagosController.js').postCrearPago );
router.put   ( '/modificarPago', require('../controllers/pagosController.js').putModificarPago )
router.delete( '/borrarPago',    require('../controllers/pagosController.js').deleteBorrarPago );

router.post( '/pagosDelEstudiante', require('../controllers/pagosController.js').postPagosDelEstudiante );

module.exports = router;