const database = require('../database/database.js');

// await database.query(sql) devuelve un arreglo de dos elementos: 
// * El primer elemento son las filas obtenidas de la consulta
// * El segundo elemento son los metadatos de las columnas

// const respuesta = await database.query(sql);
// respuesta === [ rows, fields ]

// Haciendo const [resultado] = await database.query(sql); me quedo solo con el primer elemento del arreglo

async function crearEstudiante(nombre, apellido, direccion, celular, nacionalidad, dni, email, notas) 
{
  // Asegura que notas sea null en lugar de '' o undefined
  const notaDb = notas == null || notas.trim() === ''
    ? null
    : notas.trim();

  // Asegura que email sea null si viene vacío
  const emailDb = email == null || email.trim() === ''
    ? null
    : email.trim();

  
  const sql = `
    INSERT INTO estudiante (nombre, apellido, direccion, celular, nacionalidad, dni, email, notas)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [resultado] = await database.query( sql, [nombre, apellido, direccion, celular, nacionalidad, dni, emailDb, notaDb] );

  // Devuelve el ID del nuevo registro
  return resultado.insertId;
}


async function buscarTodosLosEstudiantes()
{
  const sql = `
    SELECT * 
    FROM estudiante
    ORDER BY nombre ASC, apellido ASC;
  `;

  const [resultado] = await database.query(sql);

  return resultado;
}


async function buscarEstudiantePorId(id)
{
  const sql = `
    SELECT * 
    FROM estudiante
    WHERE id = ?;
  `;

  const [resultado] = await database.query(sql, [id]);

  return resultado[0];
}


async function modificarEstudiante(id, nombre, apellido, direccion, celular, nacionalidad, dni, email, notas) 
{
  // Asegura que notas sea null en lugar de '' o undefined
  const notaDb = notas == null || notas.trim() === ''
    ? null
    : notas.trim();

  // Asegura que email sea null si viene vacío
  const emailDb = email == null || email.trim() === ''
    ? null
    : email.trim();

  const sql = `
    UPDATE estudiante
    SET nombre       = ?,
        apellido     = ?,
        direccion    = ?,
        celular      = ?,
        nacionalidad = ?,
        dni          = ?,
        email        = ?,
        notas        = ?
    WHERE id = ?
  `;

  const [resultado] = await database.query( sql, [nombre, apellido, direccion, celular, nacionalidad, dni, emailDb, notaDb, id] );

  return;
}


async function borrarEstudiante(id)
{
  let sql = `DELETE FROM clase WHERE estudiante_id = ?`
  await database.query(sql, [id]); 

  sql = `DELETE FROM pago WHERE estudiante_id = ?`
  await database.query(sql, [id]); 

  sql = `DELETE FROM estudiante WHERE id = ?`;
  await database.query(sql, [id]);

  return;
}


module.exports = { 
  crearEstudiante,
  buscarTodosLosEstudiantes,
  buscarEstudiantePorId,
  modificarEstudiante,
  borrarEstudiante
};
