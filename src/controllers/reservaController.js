const { sql, poolPromise } = require('../config/db');

// 1. Crear una nueva reserva (Con regla de negocio incluida)
const crearReserva = async (req, res) => {
    const { nombre_usuario, espacio_id, fecha_reserva, hora_inicio, hora_fin } = req.body;

    if (!nombre_usuario || !espacio_id || !fecha_reserva || !hora_inicio || !hora_fin) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        const pool = await poolPromise;

        // [REGLA DE NEGOCIO] Validar si el espacio ya está ocupado en ese rango de fecha y hora
        const choqueHorario = await pool.request()
            .input('espacio_id', sql.Int, espacio_id)
            .input('fecha_reserva', sql.Date, fecha_reserva)
            .input('hora_inicio', sql.VarChar(8), hora_inicio)
            .input('hora_fin', sql.VarChar(8), hora_fin)
            .query(`
                SELECT TOP 1 id FROM Reservas 
                WHERE espacio_id = @espacio_id 
                  AND fecha_reserva = @fecha_reserva
                  AND (
                     (@hora_inicio >= hora_inicio AND @hora_inicio < hora_fin) OR
                     (@hora_fin > hora_inicio AND @hora_fin <= hora_fin) OR
                     (hora_inicio >= @hora_inicio AND hora_inicio < @hora_fin)
                  )
            `);

        if (choqueHorario.recordset.length > 0) {
            return res.status(400).json({
                error: 'Regla de negocio violada',
                detalle: 'El espacio seleccionado ya se encuentra reservado en ese horario.'
            });
        }

        // Si el horario está libre, se registra usando tu SP
        const result = await pool.request()
            .input('nombre_usuario', sql.VarChar(100), nombre_usuario)
            .input('espacio_id', sql.Int, espacio_id)
            .input('fecha_reserva', sql.Date, fecha_reserva)
            .input('hora_inicio', sql.VarChar(8), hora_inicio)
            .input('hora_fin', sql.VarChar(8), hora_fin)
            .execute('Sp_RegistrarReserva');

        res.status(201).json({
            mensaje: 'Reserva registrada con éxito.'
        });

    } catch (err) {
        res.status(500).json({
            error: 'Error al registrar la reserva',
            detalle: err.message
        });
    }
};

// 2. Obtener todas las reservas (Consulta)
const obtenerReservas = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Reservas ORDER BY fecha_reserva ASC, hora_inicio ASC');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las reservas.', detalle: err.message });
    }
};

// 3. Eliminar una reserva (Borrado)
const eliminarReserva = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Reservas WHERE id = @id'); // Cambia 'id' por el nombre exacto de tu llave primaria si es diferente (ej: id_reserva)

        res.json({ mensaje: 'Reserva eliminada/cancelada correctamente.' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la reserva.', detalle: err.message });
    }
};

// 4. Modificar una reserva (Actualización)
const actualizarReserva = async (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, espacio_id, fecha_reserva, hora_inicio, hora_fin } = req.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre_usuario', sql.VarChar(100), nombre_usuario)
            .input('espacio_id', sql.Int, espacio_id)
            .input('fecha_reserva', sql.Date, fecha_reserva)
            .input('hora_inicio', sql.VarChar(8), hora_inicio)
            .input('hora_fin', sql.VarChar(8), hora_fin)
            .query(`
                UPDATE Reservas 
                SET nombre_usuario = @nombre_usuario, 
                    espacio_id = @espacio_id, 
                    fecha_reserva = @fecha_reserva, 
                    hora_inicio = @hora_inicio, 
                    hora_fin = @hora_fin 
                WHERE id = @id
            `);

        res.json({ mensaje: 'Reserva actualizada con éxito.' });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar la reserva.', detalle: err.message });
    }
};

module.exports = {
    crearReserva,
    obtenerReservas,
    eliminarReserva,
    actualizarReserva
};