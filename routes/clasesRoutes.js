// URL base: http://DOMINIO/clases/

// Modulos
const router = require('express').Router(); // Permite definir rutas
 
// Defino las rutas de navegación del usuario
router.get ( '/',                                      require('../controllers/clasesController.js').getClasesDeHoyEnAdelante );
router.get ( '/clasesDeHoy',                           require('../controllers/clasesController.js').getClasesDeHoy );
router.post( '/clasesPorRangoDeFechas',                require('../controllers/clasesController.js').postClasesPorRangoDeFechas );
router.post( '/clasesDelEstudiantePorID',              require('../controllers/clasesController.js').postClasesDelEstudiantePorID );
router.post( '/clasesDelEstudiantePorNombreYApellido', require('../controllers/clasesController.js').postClasesDelEstudiantePorNombreYApellido );

router.post  ('/crearClase',     require('../controllers/clasesController.js').postCrearClase );
router.put   ('/modificarClase', require('../controllers/clasesController.js').putModificarClase );
router.delete('/borrarClase',    require('../controllers/clasesController.js').deleteBorrarClase );

module.exports = router;