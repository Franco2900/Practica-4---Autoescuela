// Metodos importados de 'utilController.js'
const { logURL } = require('./utilController.js');

async function getLogout(req, res)
{
    logURL(`GET`, `/logout`);

    req.session.destroy((error) => { 
        if (error) return res.status(500).send('Error al cerrar sesión'); 
        res.redirect('/'); 
    });
    
}

module.exports = { getLogout };