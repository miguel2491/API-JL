import {getConnection} from '../database/connection.js'
import sql from 'mssql'
import jwt from 'jsonwebtoken'

//====================== CREAR TOKENS ===============================
export const getToken = async(req, res) =>{
    const user = { id: 1, username: 'catsa2' };
    const secretKey = 'catsa_E95c2983a6$';
    // Crear el token
    const token = jwt.sign(user, secretKey, { expiresIn: '4h' });
    const resu = await getValToken(token, secretKey);
    if(resu === 'Válido'){
        res.send("Token:"+token)
    }else{
        res.send(resu)
    }
}
async function getValToken(token, secretKey){
    return new Promise((resolve, reject) =>{
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                resolve('No Válido')
            }
            resolve('Válido')
        });
    });
}
//------------------ USUARIO ---------------------------------
export const getUser = async (req, res) =>{
    const pool = await getConnection()    
    const result = await pool.request()
    .input('user', sql.VarChar, req.params.User)
    .input('password', sql.VarChar, req.params.Pass)
    .query('SELECT * FROM aspnet_Users WHERE id=@id')
    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message:"No encontrado"});
    }
    console.log("Consulta Éxitosa")
    res.json(result.recordset[0])
}
export const setUsuario = async (req, res) =>{
    console.log(req.body)
    const pool = await getConnection()
    const result = await pool.request()
    .input('usuario', sql.VarChar, req.body.usuario)
    .input('password', sql.VarChar, req.body.password)
    .input('nombre', sql.VarChar, req.body.nombre)
    .input('status', sql.NChar, req.body.status)
    .query('INSERT INTO tbc_Usuario(usuario, password, nombre, status) VALUES (@usuario, @password, @nombre, @status); SELECT SCOPE_IDENTITY() AS id;')
    console.log(result)
    res.json({
        id:result.recordset[0].id,
        usuario: req.body.usuario,
        nombre: req.body.nombre
    })
}




