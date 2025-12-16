// Metodos importados de 'utilController.js'
const { logURL } = require('./utilController.js');

// Funciones importadas
const {buscarUsuario} = require('../models/usuarioModel.js');

async function getLogin(req, res)
{
    logURL(`GET`, `/login`);
    res.render('layout', {body: 'loginView'} ); 
}


async function postLogin(req, res) 
{
    logURL(`POST`, `/login`);
    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { nombre, contrasenia } = req.body;

    try 
    {
        const resultado = await buscarUsuario(nombre, contrasenia);
        
        // Si existe, el usuario inicia sesion
        if (resultado.mensaje == 'Usuario y contraseña validos') 
        {
            req.session.nombre = resultado.usuario.nombre;

            res.send(`
                <script>
                    window.location.href = "/";
                </script>`);
        } 

        // Si no existe, le informo al usuario
        else 
        {
            res.send(`
                <script>
                    alert("Nombre o contraseña incorrectos");
                    window.location.href = "/login";
                </script>`);
        }

    } 
    catch (error) 
    {
        res.status(500).send();
        console.log(error);
    }
}

module.exports = { getLogin, postLogin };