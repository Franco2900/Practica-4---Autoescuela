// URL base: http://DOMINIO/register/

// Modulos
const router = require('express').Router(); // Permite definir rutas

// Defino las rutas de navegación del usuario
router.get ( '/', require('../controllers/registerController.js').getRegister );
router.post( '/', require('../controllers/registerController.js').postRegister );

module.exports = router;