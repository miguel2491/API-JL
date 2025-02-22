import {getConnection} from '../database/connection.js'
import sql from 'mssql'
import jwt from 'jsonwebtoken'

//====================== CREAR TOKENS ===============================
export const getToken = async(req, res) =>{
    const user = { id: 1, username: 'JL' };
    const secretKey = "julieta_calavera";
    // Crear el token
    const token = jwt.sign(user, secretKey, { expiresIn: '4h' });
    const resu = await getValToken(token, secretKey);
    if(resu === 'Válido'){
        res.send(token)
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
            if(secretKey != "julieta_calavera"){
                resolve('No Válido')
            }
            resolve('Válido')
        });
    });
}
//------------------ USUARIO ---------------------------------
export const getUsuarios = async (req, res) =>{
    const pool = await getConnection()    
    const result = await pool.request()
    .query('SELECT * FROM tbc_Usuarios')
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
export const getUser = async (req, res) =>{
    const pool = await getConnection()    
    const result = await pool.request()
    .input('user', sql.VarChar, req.params.User)
    .input('password', sql.VarChar, req.params.Pass)
    .query('SELECT * FROM tbc_Usuarios WHERE id=@id')
    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message:"No encontrado"});
    }
    console.log("Consulta Éxitosa")
    res.json(result.recordset[0])
}
export const setUsuario = async (req, res) =>{
    const fechaActual = new Date();
    const pool = await getConnection()
    const result = await pool.request()
    .input('usuario', sql.VarChar, req.body.Usuario)
    .input('password', sql.VarChar, req.body.Password)
    .input('email', sql.VarChar, req.body.Email)
    .input('estatus', sql.NChar, req.body.Estatus)
    .input('last_conexion', sql.DateTime, fechaActual)
    .query('INSERT INTO tbc_Usuarios(usuario, password, email, estatus, last_conexion)'+
        ' VALUES (@usuario, @password, @email, @estatus, @last_conexion);'+
        ' SELECT SCOPE_IDENTITY() AS id;')
    console.log(result)
    res.json({
        id:result.recordset[0].id,
        usuario: req.body.usuario,
        email: req.body.email
    })
}
export const setUpdUsuario = async (req, res) =>{
    console.log(req.body)
    const fechaActual = new Date();
    try{
        const pool = await getConnection()
        const result = await pool.request()
        .input('id', sql.Int, req.body.Id)
        .input('password', sql.VarChar, req.body.Password)
        .input('email', sql.VarChar, req.body.Email)
        .input('last_conexion', sql.DateTime, fechaActual)
        .query(`UPDATE tbc_Usuarios 
                SET 
                    password = @password, 
                    email = @email, 
                    last_conexion = @last_conexion
                WHERE id = @id;`)
            console.log(result)
            res.json({
                id: req.body.id,
                usuario: req.body.Usuario,
                email: req.body.Email
            });
    }catch(error){
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
}
export const setDelUsuario = async (req, res) =>{
    console.log(req.body)
    const fechaActual = new Date();
    try{
        const pool = await getConnection()
        const result = await pool.request()
        .input('id', sql.Int, req.body.Id)
        .input('estatus', sql.VarChar, '0')
        .input('last_conexion', sql.DateTime, fechaActual)
        .query(`UPDATE tbc_Usuarios 
                SET 
                    estatus = @estatus, 
                    last_conexion = @last_conexion
                WHERE id = @id;`)
            console.log(result)
            res.json({
                id: req.body.id,
                mssg: 'Se elimino Correctamente'
            });
    }catch(error){
        console.error('Error al Eliminar el usuario:', error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
}
// ============================ USUARIOS ROLES =================================================
export const setUsuarioRoles = async (req, res) => {
    const { IdRol, IdUsuario, IdUsuarioRol } = req.body;
    try {
        const pool = await getConnection(); // Obtener conexión a la base de datos
        let result;
        if (IdUsuarioRol === 0) {
            // Insertar nuevo registro
            result = await pool.request()
                .input('id_usuario', sql.Int, IdUsuario)
                .input('id_rol', sql.Int, IdRol)
                .query(`
                    INSERT INTO tb_UsuarioRol(id_usuario, id_rol)
                    VALUES (@id_usuario, @id_rol);
                    SELECT SCOPE_IDENTITY() AS id;
                `);
        } else {
            // Actualizar registro existente
            result = await pool.request()
                .input('id', sql.Int, IdUsuarioRol)
                .input('Rol', sql.Int, IdRol)
                .input('Usuario', sql.Int, IdUsuario)
                .query(`
                    UPDATE tb_UsuarioRol 
                    SET id_usuario = @Usuario, id_rol = @Rol
                    WHERE id = @id;
                    SELECT id FROM tb_UsuarioRol WHERE id = @id; -- Aseguramos de obtener el ID actualizado
                `);
        }
        // Asegurarse de que `result.recordset` existe y tiene al menos un registro
        if (!result.recordset || result.recordset.length === 0) {
            return res.status(500).json({ message: 'Error al insertar o actualizar el registro en tb_UsuarioRol' });
        }

        // Si es una inserción, devolver el ID generado
        const id = result.recordset[0].id || result.recordset[0]['SCOPE_IDENTITY()']; // Accedemos al ID dependiendo de la consulta
        res.json({
            id,
            message: IdUsuarioRol === 0 ? 'Se agregó correctamente' : 'Se actualizó correctamente'
        });

    } catch (error) {
        console.error('Error al agregar/actualizar rol al usuario:', error);
        return res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};
export const delUsuarioRoles = async (req, res) => {
    const { id } = req.params; // Obtener el id desde los parámetros de la URL

    // Verificar que el id esté presente y sea válido
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido o no proporcionado' });
    }

    try {
        const pool = await getConnection(); // Obtener conexión a la base de datos

        // Realizar la eliminación del registro en la tabla tb_UsuarioRol
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM tb_UsuarioRol WHERE id = @id"); // Cambia esta consulta a lo que necesites

        // Verificar si se eliminó algún registro
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'No se encontró el usuario-rol con el id proporcionado' });
        }

        // Responder con un mensaje de éxito
        res.json({ message: 'Usuario-rol eliminado correctamente' });

    } catch (error) {
        console.error('Error al eliminar el usuario-rol:', error);
        return res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};
// ============================ USUARIOS PERMISOS =================================================
export const setUsuarioPermiso = async (req, res) => {
    const { IdPermiso, IdUsuario, idUsuarioPermiso } = req.body;
    try {
        const pool = await getConnection(); // Obtener conexión a la base de datos
        let result;
        if (idUsuarioPermiso === 0) {
            // Insertar nuevo registro
            result = await pool.request()
                .input('Permiso', sql.Int, IdPermiso)
                .input('Usuario', sql.Int, IdUsuario)
                .query(`
                    INSERT INTO tb_UsuarioPermiso(id_Usuario, id_Permiso)
                    VALUES (@Usuario, @Permiso);
                    SELECT SCOPE_IDENTITY() AS id;
                `);
        } else {
            // Actualizar registro existente
            result = await pool.request()
                .input('id', sql.Int, idUsuarioPermiso)
                .input('Permiso', sql.Int, IdPermiso)
                .input('Usuario', sql.Int, IdUsuario)
                .query(`
                    UPDATE tb_UsuarioPermiso 
                    SET id_Usuario = @Usuario, id_Permiso = @Permiso
                    WHERE id = @id;
                    SELECT id FROM tb_UsuarioPermiso WHERE id = @id; -- Aseguramos de obtener el ID actualizado
                `);
        }
        // Asegurarse de que `result.recordset` existe y tiene al menos un registro
        if (!result.recordset || result.recordset.length === 0) {
            return res.status(500).json({ message: 'Error al insertar o actualizar el registro en tb_UsuarioPermiso' });
        }

        // Si es una inserción, devolver el ID generado
        const id = result.recordset[0].id || result.recordset[0]['SCOPE_IDENTITY()']; // Accedemos al ID dependiendo de la consulta
        res.json({
            id,
            message: idUsuarioPermiso === 0 ? 'Se agregó correctamente' : 'Se actualizó correctamente'
        });

    } catch (error) {
        console.error('Error al agregar/actualizar permiso al usuario:', error);
        return res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};


export const delUsuarioPermisos = async (req, res) => {
    const { id } = req.params; // Obtener el id desde los parámetros de la URL

    // Verificar que el id esté presente y sea válido
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido o no proporcionado' });
    }

    try {
        const pool = await getConnection(); // Obtener conexión a la base de datos

        // Realizar la eliminación del registro en la tabla tb_UsuarioRol
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM tb_UsuarioPermiso WHERE id = @id"); // Cambia esta consulta a lo que necesites

        // Verificar si se eliminó algún registro
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'No se encontró el usuario-permiso con el id proporcionado' });
        }

        // Responder con un mensaje de éxito
        res.json({ message: 'Usuario-Permiso eliminado correctamente' });

    } catch (error) {
        console.error('Error al eliminar el usuario-Permiso:', error);
        return res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};
// ============================ USUARIOS  =================================================
export const getSesion = async (req, res) => {
    try {
        // Log de los parámetros para depuración
        //console.log(`User: ${req.body.User}, Pass: ${req.body.Pass}`);

        // Construir la consulta SQL
        //const query = `SELECT * FROM tbc_Usuarios WHERE usuario = '${req.body.User}' AND password = '${req.body.Pass}'`;
        //console.log("Consulta SQL generada: ", query); // Imprime la consulta generada

        const pool = await getConnection();    
        const result = await pool.request()
            .input('User', sql.VarChar, req.body.User) // o req.body.User si usas POST
            .input('Pass', sql.VarChar, req.body.Pass) // o req.body.Pass si usas POST
            .query('SELECT * FROM tbc_Usuarios WHERE usuario=@User AND password=@Pass');
            console.log("RES",result.recordsets[0]);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "No encontrado" });
        }
        
        console.log(result.recordsets);
        res.json(result.recordsets[0]);
    } catch (error) {
        console.error("Error al ejecutar la consulta", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
export const updSesion = async (req, res) => {
    try {
        const fecha = new Date();
        //console.log(`User: ${req.params.id}`);
        // Construir la consulta SQL
        //const query = `UPDATE tbc_Usuarios SET fecha=@fecha WHERE id = '${req.params.id}'`;
        //console.log("Consulta SQL generada: ", query); // Imprime la consulta generada
        const pool = await getConnection();    
        const result = await pool.request()
            .input('idUser', sql.VarChar, req.params.id) // o req.body.User si usas POST
            .input('fecha', sql.DateTime, fecha)
            .query('UPDATE tbc_Usuarios SET last_conexion=@fecha WHERE id=@idUser');
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "No encontrado" });
        }
        res.json(result.rowsAffected);
    } catch (error) {
        console.error("Error al ejecutar la consulta", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
export const getUserRol = async (req, res) => {
    try {
        // Log de los parámetros para depuración
        //console.log(`User: ${req.params.id}`);

        // Construir la consulta SQL
        // const query = `SELECT * FROM tb_UsuarioRol WHERE id_usuario = '${req.params.id}'`;
        // console.log("Consulta SQL generada: ", query); // Imprime la consulta generada

        const pool = await getConnection();    
        const result = await pool.request()
            .input('UserId', sql.Int, req.params.id) // o req.body.User si usas POST
            .query(`SELECT UR.id, UR.id_rol, UR.id_usuario, R.Rol as roleName FROM tb_UsuarioRol UR 
                LEFT JOIN tbc_Rol R ON UR.id_rol = R.id 
                WHERE UR.id_usuario=@UserId`);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "No encontrado" });
        }
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
    } catch (error) {
        console.error("Error al ejecutar la consulta", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
export const getUserPermiso = async (req, res) => {
    try {
        // Log de los parámetros para depuración
        //console.log(`User: ${req.body.User}, Pass: ${req.body.Pass}`);

        // Construir la consulta SQL
        //const query = `SELECT * FROM tbc_Usuarios WHERE usuario = '${req.body.User}' AND password = '${req.body.Pass}'`;
        //console.log("Consulta SQL generada: ", query); // Imprime la consulta generada

        const pool = await getConnection();    
        const result = await pool.request()
            .input('UserId', sql.Int, req.params.id) // o req.body.User si usas POST
            .query('SELECT UP.*, P.Permiso FROM tb_UsuarioPermiso UP'+
                ' LEFT JOIN tbc_Permisos P ON UP.id_Permiso = P.id '+
                ' WHERE UP.id_Usuario=@UserId');
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
    } catch (error) {
        console.error("Error al ejecutar la consulta", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
