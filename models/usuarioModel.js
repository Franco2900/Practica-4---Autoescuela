const database = require('../database/database.js'); // Base de datos

// Modulos
//const bcryptjs = require('bcryptjs'); // Modulo para trabajar con contraseñas cifradas

async function buscarUsuario(nombre, contraseniaIngresada) 
{
    const resultado = await database.query(`
        SELECT id, nombre, contrasenia 
        FROM usuario 
        WHERE nombre = ?`, [nombre] 
    );


    // Si existe el usuario con dicho nombre
    if(resultado[0].length > 0)
    {
        const contraseniaAlmacenada = resultado[0][0].contrasenia;
        // Comparo las contraseñas (la contraseña que ingresa el usuario no debe estar cifrada)
        //const hayCoincidencia = await bcryptjs.compare(contraseniaIngresada, contraseniaAlmacenada);
        const hayCoincidencia = contraseniaIngresada === contraseniaAlmacenada;

        if(hayCoincidencia) return { mensaje: 'Usuario y contraseña validos', usuario: resultado[0][0] };
        else                return { mensaje: 'Contraseña incorrecta' };
    }

    return { mensaje: 'Usuario no encontrado' };
}

/*
async function registrarUsuario(nombre, contrasenia) 
{
    let contraseniaIngresadaCifrada = bcryptjs.hashSync(contrasenia, 8); // Codifico la contraseña. El segundo parámetro es la longitud de saltos. Mientras más saltos, más seguro es (lo normal son entre 8 y 10)

    const resultado = await database.query(`
        INSERT INTO usuario (nombre, contrasenia)
        VALUES (?, ?)`, [nombre, contraseniaIngresadaCifrada] );

    return;
}
*/

module.exports = { buscarUsuario, /*registrarUsuario*/ };