const database = require('../database/database.js');


async function crearPago(cantidadPagada, fecha, hora, estudiante_id)
{
  // Consulto cual fue el número del último pago. En caso de que sea null (sin pagos previos) se lo reemplaza por 0
  let sql = `
    SELECT COALESCE(MAX(numero), 0) AS maxNumero
    FROM pago 
    WHERE estudiante_id = ?
  `;

  let [[{ maxNumero }]] = await database.query( sql, [estudiante_id] );
  let nuevoMaxNumero = parseInt(maxNumero, 10) + 1;

  sql = `
    INSERT INTO pago (cantidad_pagada, fecha, hora, numero, estudiante_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  await database.query( sql, [cantidadPagada, fecha, hora, nuevoMaxNumero, estudiante_id] );

  return;
}



async function modificarPago(id, cantidad_pagada, fecha, hora)
{
  const sql = `
    UPDATE pago
    SET cantidad_pagada = ?,
        fecha           = ?,
        hora            = ?
    WHERE id = ?
  `;

  const [resultado] = await database.query( sql, [cantidad_pagada, fecha, hora, id] );

  return;
}



async function borrarPago(id)
{
  const sql = `DELETE FROM pago WHERE id = ?`;

  await database.query(sql, [id]);

  return;
}



async function buscarPagosDelEstudiante(estudiante_id)
{
  const sql = `
    SELECT * 
    FROM pago 
    WHERE estudiante_id = ? 
    ORDER BY fecha ASC, hora ASC
  `;

  const [resultado] = await database.query(sql, [estudiante_id]);

  return resultado;
}


module.exports = { 
  crearPago,
  modificarPago,
  borrarPago,
  buscarPagosDelEstudiante,
};