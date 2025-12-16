// Metodos importados de 'utilController.js'
const { logURL } = require('./utilController.js');

// Funciones importadas
const {buscarUsuario, registrarUsuario} = require('../models/usuarioModel.js');

async function getRegister(req, res)
{
    logURL(`GET`, `/register`);
    res.render('layout', {body: 'registerView'} ); 
}


async function postRegister(req, res) 
{
    logURL(`POST`, `/register`);
    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { nombre, contrasenia } = req.body;
    
    try 
    {
        const resultado = await buscarUsuario(nombre, contrasenia);

        // Si no existe el usuario, se lo registra
        if (resultado.mensaje == "Usuario no encontrado") 
        {
            await registrarUsuario(nombre, contrasenia);

            res.send(`
                <script>
                    alert("Usuario creado. Ya puede iniciar sesión");
                    window.location.href = "/";
                </script>`);
        } 

        // Si existe el usuario, le informo al usuario
        else 
        {
            res.send(`
                <script>
                    alert("Ya existe el usuario que quiere crear");
                    window.location.href = "/register";
                </script>`);
        }

    } 
    catch (error) 
    {
        res.status(500).send();
        console.log(error);
    }
}

module.exports = { getRegister, postRegister };