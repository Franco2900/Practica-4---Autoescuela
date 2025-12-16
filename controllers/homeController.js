// Metodos importados de 'utilController.js'
const { logURL } = require('./utilController.js');

async function getHome(req, res)
{
    logURL(`GET`, `/`);
    res.render('layout', {body: 'homeView'} ); 
}

module.exports = { getHome };