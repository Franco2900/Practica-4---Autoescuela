const database = require('../database/database.js');


async function buscarTodosLosEventosDeHoyEnAdelante()
{
  const sql = `
    SELECT * 
    FROM evento
    WHERE evento.fecha >= CURDATE()
    ORDER BY fecha ASC;
  `;

  const [resultado] = await database.query(sql);

  return resultado;
}


async function buscarTodosLosEventosDeHoy()
{
  const sql = `
    SELECT * 
    FROM evento
    WHERE evento.fecha = CURDATE()
    ORDER BY fecha ASC;
  `;

  const [resultado] = await database.query(sql);

  return resultado;
}


async function buscarEventosPorRangoDeFechas(fechaDesde, fechaHasta)
{
  const sql = `
    SELECT *
    FROM evento
    WHERE evento.fecha BETWEEN ? AND ?
    ORDER BY evento.fecha, evento.hora_desde
  `;

  const [resultado] = await database.query(sql, [fechaDesde, fechaHasta]);

  return resultado;
}


async function buscarEventosPorNombreYApellido(estudiante)
{
  const sql = `
    WITH fechas_estudiante AS (
      SELECT DISTINCT clase.fecha
      FROM clase
      INNER JOIN estudiante 
        ON clase.estudiante_id = estudiante.id
      WHERE estudiante.nombre LIKE ? OR estudiante.apellido LIKE ?
    )
    SELECT *
    FROM evento
    WHERE evento.fecha IN (SELECT fecha FROM fechas_estudiante)
    ORDER BY evento.fecha, evento.hora_desde;
  `;

  const param = `%${estudiante}%`; 
  const [resultado] = await database.query(sql, [param, param]);

  return resultado;
}



async function crearEvento(fecha, hora_desde, hora_hasta, descripcion)
{
  const sql = `
    INSERT INTO evento (fecha, hora_desde, hora_hasta, descripcion)
    VALUES (?, ?, ?, ?)
  `;

  await database.query( sql, [fecha, hora_desde, hora_hasta, descripcion] );

  return;
}


async function modificarEvento(id, fecha, hora_desde, hora_hasta, descripcion)
{
  const sql = `
    UPDATE evento
    SET fecha       = ?,
        hora_desde  = ?,
        hora_hasta  = ?,
        descripcion = ?
    WHERE id = ?
  `;

  const [resultado] = await database.query( sql, [fecha, hora_desde, hora_hasta, descripcion, id] );

  return;
}


async function borrarEvento(id)
{
  const sql = `DELETE FROM evento WHERE id = ?`;

  await database.query(sql, [id]);

  return;
}

module.exports = { 
  buscarTodosLosEventosDeHoyEnAdelante,
  buscarTodosLosEventosDeHoy,
  buscarEventosPorRangoDeFechas,
  buscarEventosPorNombreYApellido,

  crearEvento,
  modificarEvento,
  borrarEvento,
};
