import {getConnection} from '../database/connection.js'
import sql from 'mssql'
import jwt from 'jsonwebtoken'
//====================== CRUD NOTIFICACIONES ===============================
export const setNotificacion = async (req, res) =>{
    const fecha = new Date();
    const pool = await getConnection()
    const result = await pool.request()
    .input('id_usuario', sql.Int, req.body.id_usuario)
    .input('modulo', sql.VarChar, req.body.modulo)
    .input('titulo', sql.VarChar, req.body.titulo)
    .input('mensaje', sql.VarChar, req.body.mensaje)
    .input('estatus', sql.NChar, '1')
    .input('fecha', sql.DateTime, fecha)
    .query('INSERT INTO tb_Notificacion(id_usuario, modulo, titulo, mensaje, estatus, fecha)'+
        ' VALUES (@id_usuario, @modulo, @titulo, @mensaje, @estatus, @fecha);'+
        ' SELECT SCOPE_IDENTITY() AS id;')
    res.json({
        id:result.recordset[0].id,
        message:'Se agrego Correctamente'
    })
}
export const getNotificacion = async (req, res) =>{
    const pool = await getConnection()    
    const result = await pool.request()
    .query("SELECT * FROM tb_Notificacion")
    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message:"No encontrado"});
    }
    // Aplicar trim() a los valores de los campos de cada registro
    const trimmedRecords = result.recordset.map(record => {
        // Iterar sobre las propiedades del registro y aplicar trim()
        const trimmedRecord = {};
        for (let key in record) {
            if (record.hasOwnProperty(key) && typeof record[key] === 'string') {
                trimmedRecord[key] = record[key].trim();  // Aplicar trim a las cadenas de texto
            } else {
                trimmedRecord[key] = record[key];  // Mantener los demás campos tal como están
            }
        }
        return trimmedRecord;
    });
    res.json(trimmedRecords)
}
export const getNotificacionId = async (req, res) => {
    const { id } = req.params;  // Usar req.params para obtener el id de la URL

    // Verificar que el id esté presente y sea un número entero
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido o no proporcionado' });
    }

    try {
        const pool = await getConnection();  // Obtener conexión a la base de datos
        const result = await pool.request()
            .input('id', sql.Int, id)  // Pasar el id como parámetro
            .query("SELECT * FROM tb_Notificacion WHERE id = @id");

        // Verificar si se encontraron registros
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No encontrado' });
        }

        // Aplicar trim() a los valores de los campos de cada registro
        const trimmedRecords = result.recordset.map(record => {
            const trimmedRecord = {};
            for (let key in record) {
                if (record.hasOwnProperty(key) && typeof record[key] === 'string') {
                    trimmedRecord[key] = record[key].trim();  // Aplicar trim a las cadenas de texto
                } else {
                    trimmedRecord[key] = record[key];  // Mantener los demás campos tal como están
                }
            }
            return trimmedRecord;
        });

        // Devolver los registros "trimmeados"
        res.json(trimmedRecords);

    } catch (error) {
        console.error('Error al obtener el rol:', error);
        return res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};
export const delNotificacion = async (req, res) => {
    const { Id } = req.body;
    if (!Id) {
        return res.status(400).json({ mssg: 'El campo "Id" es obligatorio' });
    }
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, Id) 
            .query("UPDATE tb_Notificacion SET estatus = '0' WHERE id = @id");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ mssg: 'No se encontró el id proporcionado' });
        }

        res.json({
            mssg: 'Eliminado correctamente',
            id: Id
        });
    } catch (error) {
        console.error('Error al actualizar:', error);
        return res.status(500).json({ mssg: 'Error al procesar la solicitud' });
    }
};
// *******************************************************************************************