import {getConnection} from '../database/connection.js'
import sql from 'mssql'

export const getCicatMensual = async (req, res) =>{
    try{
        const pool = await getConnection()    
        const result = await pool.request()
        .input('Planta', sql.VarChar, req.body.Planta)
        .input('Mes', sql.Int, req.body.Mes)
        .input('Periodo', sql.Int, req.body.Periodo)
        .execute('CICAT.spCICATMensual');
        res.json(result);
        console.log(result)
    } catch(error){
        console.error("Error al ejecutar el procedimiento almacenado:", err)
    }finally{
        await sql.close();
    }
}
export const getCicatSemanal = async (req, res) =>{
    try{
        const pool = await getConnection()    
        const result = await pool.request()
        .input('Planta', sql.VarChar, req.body.Planta)
        .input('FechaIni', sql.Date, req.body.FechaIni)
        .input('FechaFin', sql.Date, req.body.FechaFin)
        .execute('CICAT.spCICATSemanal');
        res.json(result);
        console.log(result.recordsets)
    } catch(error){
        console.error("Error al ejecutar el procedimiento almacenado:", error)
    }finally{
        await sql.close();
    }
}


