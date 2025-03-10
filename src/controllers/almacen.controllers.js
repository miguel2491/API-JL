import {getConnection} from '../database/connection.js'
import sql from 'mssql'
import jwt from 'jsonwebtoken'
//====================== CRUD TICKETS ===============================
export const setAlmacen = async (req, res) =>{
    const { id, id_producto, cantidad, cantidad_max, cantidad_min } = req.body;
    console.log(req.body)
    try{
        const pool = await getConnection()
        let result;
        let idd = req.body.id;
        if (idd === 0) {
            result = await pool.request()
            .input('id_producto', sql.Int, req.body.id_producto)
            .input('cantidad', sql.Decimal, req.body.cantidad)
            .input('cantidad_max', sql.Decimal, req.body.cantidad_max)
            .input('cantidad_min', sql.Decimal, req.body.cantidad_min)
            .query('INSERT INTO tb_Almacen(id_producto, cantidad, cantidad_max, cantidad_min)'+
                ' VALUES (@id_producto, @cantidad, @cantidad_max, @cantidad_min);'+
                ' SELECT SCOPE_IDENTITY() AS id;')
        }else{
            console.log(idd)
            result = await pool.request()
            .input('id', sql.Int, req.body.id)
            .input('id_producto', sql.Int, req.body.id_producto)
            .input('cantidad', sql.Decimal, req.body.cantidad)
            .input('cantidad_max', sql.Decimal, req.body.cantidad_max)
            .input('cantidad_min', sql.Decimal, req.body.cantidad_min)
            .query(`
                UPDATE tb_Almacen 
                SET id_producto = @id_producto, cantidad = @cantidad, cantidad_max = @cantidad_max, cantidad_min = @cantidad_min  
                WHERE id = @id;
                SELECT id FROM tb_Almacen WHERE id = @id;
            `);
        }
        if (!result.recordset || result.recordset.length === 0) {
            return res.status(500).json({ message: 'Error al insertar o actualizar el registro en tb_UsuarioRol' });
        }

        // Si es una inserción, devolver el ID generado
        const id_ = result.recordset[0].id || result.recordset[0]['SCOPE_IDENTITY()']; // Accedemos al ID dependiendo de la consulta
        res.json({
            id_,
            message: id === 0 ? 'Se agregó correctamente' : 'Se actualizó correctamente'
        });
    }catch(error){
        console.error('Error al agregar/actualizar:', error);
        return res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
}
export const getAlmacen = async (req, res) =>{
    const pool = await getConnection()    
    const result = await pool.request()
    .query("SELECT A.*, P.nombre as producto FROM tb_Almacen A LEFT JOIN tbc_Producto P ON A.id_producto = P.id")
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
export const getAlmacenId = async (req, res) => {
    const { id } = req.params;  // Usar req.params para obtener el id de la URL

    // Verificar que el id esté presente y sea un número entero
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido o no proporcionado' });
    }

    try {
        const pool = await getConnection();  // Obtener conexión a la base de datos
        const result = await pool.request()
            .input('id', sql.Int, id)  // Pasar el id como parámetro
            .query("SELECT * FROM tb_Almacen WHERE id = @id");

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
export const delAlmacen = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ mssg: 'El campo "id" es obligatorio' });
    }
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id) 
            .query("DELETE FROM tb_Almacen WHERE id = @id");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ mssg: 'No se encontró el registro' });
        }
        res.json({
            mssg: 'Registro eliminado correctamente',
            id: Id
        });
    } catch (error) {
        console.error('Error al actualizar Registro:', error);
        return res.status(500).json({ mssg: 'Error al procesar la solicitud' });
    }
};
// *******************************************************************************************