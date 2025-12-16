// Metodos importados de 'utilController.js'
const { logURL } = require('./utilController.js');

async function getContacto(req, res)
{
    logURL(`GET`, `/contacto`);
    res.render('layout', {body: 'contactoView'} ); 
}

module.exports = { getContacto };