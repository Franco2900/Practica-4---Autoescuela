const database = require('../database/database.js');

async function buscarClasesDelEstudiantePorID(id)
{
  const sql = `
    SELECT * 
    FROM clase 
    WHERE estudiante_id = ?
  `;

  const [resultado] = await database.query(sql, [id]);

  return resultado;
}


async function buscarClasesDelEstudiantePorNombreYApellido(estudiante)
{
  const sql = `
    WITH fechas_estudiante AS (
      SELECT DISTINCT c2.fecha
      FROM clase c2
      INNER JOIN estudiante e2 
        ON c2.estudiante_id = e2.id
      WHERE e2.nombre LIKE ? OR e2.apellido LIKE ?
    )
    SELECT
      c.id                   AS id,
      c.fecha,
      c.hora_desde,
      c.hora_hasta,
      c.numero,
      c.recordatorioEnviado,
      e.id                   AS estudiante_id,
      e.nombre               AS estudiante_nombre,
      e.apellido             AS estudiante_apellido,
      e.celular              AS estudiante_celular
    FROM clase c
    INNER JOIN estudiante e
      ON c.estudiante_id = e.id
    WHERE c.fecha IN (SELECT fecha FROM fechas_estudiante)
    ORDER BY c.fecha, c.hora_desde;
  `;

  const param = `%${estudiante}%`; 
  const [resultado] = await database.query(sql, [param, param]);

  return resultado;
}


// Consulta las clases de hoy desde las 00:00 en adelante. 
// Puede ser que un alumno llegue tarde, por eso quiero saber todas las clases de hoy tambien
async function buscarTodasLasClasesDeHoyEnAdelante()
{
  const sql = `
    SELECT
      c.id                   AS id,
      c.fecha,
      c.hora_desde,
      c.hora_hasta,
      c.numero,
      c.recordatorioEnviado,
      e.id                   AS estudiante_id,
      e.nombre               AS estudiante_nombre,
      e.apellido             AS estudiante_apellido,
      e.celular              AS estudiante_celular
    FROM clase c
    INNER JOIN estudiante e
      ON c.estudiante_id = e.id
    WHERE c.fecha >= CURDATE()
    ORDER BY c.fecha, c.hora_desde
  `;

  const [resultado] = await database.query(sql);

  return resultado;
}



async function buscarClasesDeHoy()
{
  const sql = `
    SELECT
      c.id                   AS id,
      c.fecha,
      c.hora_desde,
      c.hora_hasta,
      c.numero,
      c.recordatorioEnviado,
      e.id                   AS estudiante_id,
      e.nombre               AS estudiante_nombre,
      e.apellido             AS estudiante_apellido,
      e.celular              AS estudiante_celular
    FROM clase c
    INNER JOIN estudiante e
      ON c.estudiante_id = e.id
    WHERE c.fecha = CURDATE()
    ORDER BY c.fecha, c.hora_desde
  `;

  const [resultado] = await database.query(sql);

  return resultado;
}



async function buscarClasesPorRangoDeFechas(fechaDesde, fechaHasta)
{
  const sql = `
    SELECT
      c.id                   AS id,
      c.fecha,
      c.hora_desde,
      c.hora_hasta,
      c.numero,
      c.recordatorioEnviado,
      e.id                   AS estudiante_id,
      e.nombre               AS estudiante_nombre,
      e.apellido             AS estudiante_apellido,
      e.celular              AS estudiante_celular
    FROM clase c
    INNER JOIN estudiante e
    ON c.estudiante_id = e.id
    WHERE c.fecha BETWEEN ? AND ?
    ORDER BY c.fecha, c.hora_desde
  `;

  const [resultado] = await database.query(sql, [fechaDesde, fechaHasta]);

  return resultado;
}



async function recordatorioEnviado(id)
{
  const sql = `
    UPDATE clase
    SET recordatorioEnviado = 1
    WHERE id = ?
  `;

  const [resultado] = await database.query( sql, [id] );

  return;
}



async function crearClase(fecha, hora_desde, hora_hasta, estudiante_id)
{
  // Consulto cual fue el número de la última clase. En caso de que sea null (sin clases previas) se lo reemplaza por 0
  let sql = `
    SELECT COALESCE(MAX(numero), 0) AS maxNumero
    FROM clase 
    WHERE estudiante_id = ?
  `;

  let [[{ maxNumero }]] = await database.query( sql, [estudiante_id] );
  let nuevoMaxNumero = parseInt(maxNumero, 10) + 1;

  sql = `
    INSERT INTO clase (fecha, hora_desde, hora_hasta, numero, estudiante_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  await database.query( sql, [fecha, hora_desde, hora_hasta, nuevoMaxNumero, estudiante_id] );

  return;
}



async function modificarClase(id, fecha, hora_desde, hora_hasta, estudiante_id)
{
  const sql = `
    UPDATE clase
    SET fecha         = ?,
        hora_desde    = ?,
        hora_hasta    = ?,
        estudiante_id = ?
    WHERE id = ?
  `;

  const [resultado] = await database.query( sql, [fecha, hora_desde, hora_hasta, estudiante_id, id] );

  return;
}



async function borrarClase(id)
{
  const sql = `DELETE FROM clase WHERE id = ?`;

  await database.query(sql, [id]);

  return;
}


module.exports = { 
  buscarClasesDelEstudiantePorID,
  buscarClasesDelEstudiantePorNombreYApellido,
  buscarTodasLasClasesDeHoyEnAdelante,
  buscarClasesDeHoy,
  buscarClasesPorRangoDeFechas,

  recordatorioEnviado,

  crearClase,
  modificarClase,
  borrarClase
};
