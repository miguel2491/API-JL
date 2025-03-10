import {getConnection} from '../database/connection.js'
import sql from 'mssql'
import jwt from 'jsonwebtoken'
//====================== CRUD ROLES ===============================
export const setRoles = async (req, res) =>{
    const pool = await getConnection()
    const result = await pool.request()
    .input('Rol', sql.VarChar, req.body.Rol)
    .input('estatus', sql.NChar, '1')
    .query('INSERT INTO tbc_Rol(Rol, estatus)'+
        ' VALUES (@Rol, @estatus);'+
        ' SELECT SCOPE_IDENTITY() AS id;')
    res.json({
        id:result.recordset[0].id,
        message:'Se agrego Correctamente'
    })
}
export const getRoles = async (req, res) =>{
    const pool = await getConnection()    
    const result = await pool.request()
    .query("SELECT * FROM tbc_Rol")
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
export const getRolId = async (req, res) => {
    const { id } = req.params;  // Usar req.params para obtener el id de la URL

    // Verificar que el id esté presente y sea un número entero
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido o no proporcionado' });
    }

    try {
        const pool = await getConnection();  // Obtener conexión a la base de datos
        const result = await pool.request()
            .input('id', sql.Int, id)  // Pasar el id como parámetro
            .query("SELECT * FROM tbc_Rol WHERE id = @id");

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
export const delRol = async (req, res) => {
    const { Id } = req.body;
    if (!Id) {
        return res.status(400).json({ mssg: 'El campo "Id" es obligatorio' });
    }
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, Id) 
            .query("UPDATE tbc_Rol SET estatus = '0' WHERE id = @id");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ mssg: 'No se encontró el ROL con el id proporcionado' });
        }

        res.json({
            mssg: 'Roles eliminado correctamente',
            id: Id
        });
    } catch (error) {
        console.error('Error al actualizar Rol:', error);
        return res.status(500).json({ mssg: 'Error al procesar la solicitud' });
    }
};

//====================== CRUD PERMISOS ===============================
export const setPermiso = async (req, res) =>{
    const pool = await getConnection()
    const result = await pool.request()
    .input('Permiso', sql.VarChar, req.body.Permiso)
    .input('estatus', sql.NChar, req.body.estatus)
    .query('INSERT INTO tbc_Permisos(Permiso, estatus)'+
        ' VALUES (@Permiso, @estatus);'+
        ' SELECT SCOPE_IDENTITY() AS id;')
    res.json({
        id:result.recordset[0].id,
        message:'Se agrego Correctamente'
    })
}
export const updatePermiso = async (req, res) =>{
    const pool = await getConnection()
    const result = await pool.request()
    .input('Id', sql.Int, req.body.Id)
    .input('Permiso', sql.VarChar, req.body.Permiso)
    .input('estatus', sql.NChar, req.body.estatus)
    .query('UPDATE tbc_Permisos SET Permiso = @Permiso, estatus =@estatus'+
        ' WHERE id=@id;')
    res.json({
        id:result.recordset[0].id,
        message:'Se modifico Correctamente'
    })
}
export const getPermisos = async (req, res) =>{
    const pool = await getConnection()    
    const result = await pool.request()
    .query('SELECT * FROM tbc_Permisos')
    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message:"No encontrado"});
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
};
export const getPermisoId = async (req, res) => {
    const { id } = req.params;  // Usar req.params para obtener el id de la URL

    // Verificar que el id esté presente y sea un número entero
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido o no proporcionado' });
    }

    try {
        const pool = await getConnection();  // Obtener conexión a la base de datos
        const result = await pool.request()
            .input('id', sql.Int, id)  // Pasar el id como parámetro
            .query("SELECT * FROM tbc_Permisos WHERE id = @id");

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
export const delPermiso = async (req, res) => {
    const { Id } = req.body;  // Desestructuración del id desde el cuerpo de la solicitud
    
    if (!Id) {
        return res.status(400).json({ mssg: 'El campo "Id" es obligatorio' });
    }

    try {
        const pool = await getConnection();  // Obtener conexión a la base de datos
        const result = await pool.request()
            .input('id', sql.Int, Id)  // Pasar el Id como parámetro
            .query("UPDATE tbc_Permisos SET estatus = '0' WHERE id = @id");  // Actualizar el estatus del permiso

        // Verificar si se actualizó algún registro
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ mssg: 'No se encontró el permiso con el id proporcionado' });
        }

        // Responder con un mensaje de éxito
        res.json({
            mssg: 'Permiso eliminado correctamente',
            id: Id  // Retornar el id del permiso actualizado
        });
    } catch (error) {
        console.error('Error al actualizar permisos:', error);
        return res.status(500).json({ mssg: 'Error al procesar la solicitud' });
    }
};
//====================== CRUD CATEGORIA ===============================
export const setCategoria = async (req, res) =>{
    const { id, nombre, estatus } = req.body;
    console.log(req.body)
    try{
        const pool = await getConnection()
        let result;
        let idd = req.body.id;
        console.log(idd)
        if (idd === 0) {
            console.log("D==>"+idd)
            result = await pool.request()
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('estatus', sql.NChar, '1')
            .query('INSERT INTO tbc_Categoria(nombre, estatus)'+
                ' VALUES (@nombre, @estatus);'+
                ' SELECT SCOPE_IDENTITY() AS id;')
        }else{
            console.log(idd)
            result = await pool.request()
            .input('id', sql.Int, req.body.id)
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('estatus', sql.NChar, req.body.estatus)
            .query(`
                UPDATE tbc_Categoria 
                SET nombre = @nombre, estatus = @estatus
                WHERE id = @id;
                SELECT id FROM tbc_Categoria WHERE id = @id; -- Aseguramos de obtener el ID actualizado
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
export const getCategorias = async (req, res) =>{
    const pool = await getConnection()    
    const result = await pool.request()
    .query('SELECT * FROM tbc_Categoria')
    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message:"No encontrado"});
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
};
export const getCategoria = async (req, res) => {
    const { id } = req.params;  // Usar req.params para obtener el id de la URL

    // Verificar que el id esté presente y sea un número entero
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido o no proporcionado' });
    }

    try {
        const pool = await getConnection();  // Obtener conexión a la base de datos
        const result = await pool.request()
            .input('id', sql.Int, id)  // Pasar el id como parámetro
            .query("SELECT * FROM tbc_Categoria WHERE id = @id");

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
export const delCategoria = async (req, res) => {
    const { id } = req.params;  // Desestructuración del id desde el cuerpo de la solicitud
    console.log(id, req.params)
    if (!id) {
        return res.status(400).json({ mssg: 'El campo "Id" es obligatorio' });
    }

    try {
        const pool = await getConnection();  // Obtener conexión a la base de datos
        const result = await pool.request()
            .input('id', sql.Int, id)  // Pasar el Id como parámetro
            .query("UPDATE tbc_Categoria SET estatus = '0' WHERE id = @id");  // Actualizar el estatus del permiso

        // Verificar si se actualizó algún registro
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ mssg: 'No se encontró el permiso con el id proporcionado' });
        }

        // Responder con un mensaje de éxito
        res.json({
            mssg: 'Permiso eliminado correctamente',
            id: id  // Retornar el id del permiso actualizado
        });
    } catch (error) {
        console.error('Error al actualizar permisos:', error);
        return res.status(500).json({ mssg: 'Error al procesar la solicitud' });
    }
};
//====================== CRUD PROVEEDOR ===============================
export const setProveedor = async (req, res) =>{
    const { id } = req.body;
    try{
        const pool = await getConnection()
        let result;
        let idd = req.body.id;
        console.log("===>"+idd)
        if (idd === 0) {
            result = await pool.request()
            .input('id_categoria', sql.Int, req.body.id_categoria)
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('ubicacion', sql.VarChar, req.body.ubicacion)
            .input('estatus', sql.NChar, req.body.estatus)
            .query('INSERT INTO tbc_Proveedor(id_categoria,nombre, ubicacion,estatus)'+
                ' VALUES (@id_categoria, @nombre, @ubicacion, @estatus);'+
                ' SELECT SCOPE_IDENTITY() AS id;')
        }else{
            result = await pool.request()
            .input('id', sql.Int, req.body.id)
            .input('id_categoria', sql.Int, req.body.id_categoria)
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('ubicacion', sql.VarChar, req.body.ubicacion)
            .input('estatus', sql.NChar, req.body.estatus)
            .query('UPDATE tbc_Proveedor SET id_categoria=@id_categoria, nombre=@nombre,'+
                ' ubicacion=@ubicacion, estatus=@estatus '+
                ' WHERE id = @id SELECT id FROM tb_Almacen WHERE id = @id;')
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
export const getProveedores = async (req, res) =>{
    const pool = await getConnection()    
    const result = await pool.request()
    .query('SELECT P.id, P.id_categoria, P.nombre, P.ubicacion, P.estatus, C.nombre as Categoria'+
        ' FROM tbc_Proveedor P LEFT JOIN tbc_Categoria C ON P.id_categoria = C.id')
    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message:"No encontrado"});
    }
    const trimmedRecords = result.recordset.map(record => {
        // Iterar sobre las propiedades del registro y aplicar trim()
        const trimmedRecord = {};
        for (let key in record) {
            if (record.hasOwnProperty(key)) {
                if (typeof record[key] === 'string') {
                    // Si es una cadena, hacer trim
                    trimmedRecord[key] = record[key].trim();
                } else if (Array.isArray(record[key])) {
                    // Si el valor es un array, tomar el primer elemento (si existe)
                    trimmedRecord[key] = record[key][0]?.trim() || '';
                } else {
                    // Para otros tipos de datos (números, etc.), no hacer nada
                    trimmedRecord[key] = record[key];
                }
            }
        }
        return trimmedRecord;
    });
    res.json(trimmedRecords);
};
export const getProveedor = async (req, res) => {
    const { id } = req.params;  // Usar req.params para obtener el id de la URL

    // Verificar que el id esté presente y sea un número entero
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido o no proporcionado' });
    }

    try {
        const pool = await getConnection();  // Obtener conexión a la base de datos
        const result = await pool.request()
            .input('id', sql.Int, id)  // Pasar el id como parámetro
            .query("SELECT * FROM tbc_Proveedor WHERE id = @id");

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
export const delProveedor = async (req, res) => {
    const { id } = req.params;  // Desestructuración del id desde el cuerpo de la solicitud
    
    if (!id) {
        return res.status(400).json({ mssg: 'El campo "id" es obligatorio' });
    }

    try {
        const pool = await getConnection();  // Obtener conexión a la base de datos
        const result = await pool.request()
            .input('id', sql.Int, id)  // Pasar el Id como parámetro
            .query("UPDATE tbc_Proveedor SET estatus = '0' WHERE id = @id");  // Actualizar el estatus del permiso

        // Verificar si se actualizó algún registro
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ mssg: 'No se encontró el permiso con el id proporcionado' });
        }

        // Responder con un mensaje de éxito
        res.json({
            mssg: 'Permiso eliminado correctamente',
            id: id  // Retornar el id del permiso actualizado
        });
    } catch (error) {
        console.error('Error al actualizar permisos:', error);
        return res.status(500).json({ mssg: 'Error al procesar la solicitud' });
    }
};
//====================== CRUD PRODUCTO ===============================
export const setProductos = async (req, res) =>{
    const { id, id_categoria, id_proveedor,nombre, descripcion, precio, cantidad, url_img, estatus } = req.body;
    try{
        const pool = await getConnection()
        let result;
        let idd = req.body.id;
        if (idd === 0) {
            result = await pool.request()
            .input('id_categoria', sql.Int, req.body.id_categoria)
            .input('id_proveedor', sql.Int, req.body.id_proveedor)
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('precio', sql.Decimal, req.body.precio)
            .input('cantidad', sql.Decimal, req.body.cantidad)
            .input('estatus', sql.NChar, req.body.estatus)
            .query('INSERT INTO tbc_Producto(id_categoria, id_proveedor,nombre, descripcion, precio, cantidad,estatus)'+
                ' VALUES (@id_categoria, @id_proveedor, @nombre, @descripcion, @precio, @cantidad, @estatus);'+
                ' SELECT SCOPE_IDENTITY() AS id;')
        }else{
            console.log(idd)
            result = await pool.request()
            .input('id', sql.Int, req.body.id)
            .input('id_categoria', sql.Int, req.body.id_categoria)
            .input('id_proveedor', sql.Int, req.body.id_proveedor)
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('precio', sql.Decimal, req.body.precio)
            .input('cantidad', sql.Decimal, req.body.cantidad)
            .input('estatus', sql.NChar, req.body.estatus)
            .query(`
                UPDATE tbc_Producto 
                SET id_categoria=@id_categoria, id_proveedor=@id_proveedor,
                nombre = @nombre, descripcion=@descripcion, precio=@precio,
                cantidad=@cantidad, estatus = @estatus
                WHERE id = @id;
                SELECT id FROM tb_Producto WHERE id = @id;
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
export const getProductos = async (req, res) =>{
    const pool = await getConnection()    
    const result = await pool.request()
    .query('SELECT * FROM tbc_Producto')
    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message:"No encontrado"});
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
};
export const getProductosId = async (req, res) => {
    const { id } = req.params;  // Usar req.params para obtener el id de la URL

    // Verificar que el id esté presente y sea un número entero
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido o no proporcionado' });
    }

    try {
        const pool = await getConnection();  // Obtener conexión a la base de datos
        const result = await pool.request()
            .input('id', sql.Int, id)  // Pasar el id como parámetro
            .query("SELECT * FROM tbc_Producto WHERE id = @id");

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
export const delProductos = async (req, res) => {
    const { id } = req.params;  // Desestructuración del id desde el cuerpo de la solicitud
    console.log(id, req.params)
    if (!id) {
        return res.status(400).json({ mssg: 'El campo "Id" es obligatorio' });
    }

    try {
        const pool = await getConnection();  // Obtener conexión a la base de datos
        const result = await pool.request()
            .input('id', sql.Int, id)  // Pasar el Id como parámetro
            .query("UPDATE tbc_Producto SET estatus = '0' WHERE id = @id");  // Actualizar el estatus del permiso

        // Verificar si se actualizó algún registro
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ mssg: 'No se encontró el permiso con el id proporcionado' });
        }

        // Responder con un mensaje de éxito
        res.json({
            mssg: 'Eliminado correctamente',
            id: id  // Retornar el id del permiso actualizado
        });
    } catch (error) {
        console.error('Error al actualizar:', error);
        return res.status(500).json({ mssg: 'Error al procesar la solicitud' });
    }
};
//====================== CRUD VISITA ===============================
export const setVisita = async (req, res) =>{
    const { id, lat, lng, motivo, usuario, fecha } = req.body;
    const fechaActual = new Date();
    try{
        const pool = await getConnection()
        let result;
        let idd = req.body.idReg;
        console.log(req.body)
        if (idd !== 0) {
            result = await pool.request()
            .input('idReg', sql.Int, req.body.idReg)
            .input('lat', sql.VarChar, req.body.lat)
            .input('lng', sql.VarChar, req.body.lng)
            .input('motivo', sql.VarChar, req.body.motivo)
            .input('usuario', sql.VarChar, req.body.usuario)
            .input('fecha', sql.DateTime, req.body.fecha)
            .input('fecha_creacion', sql.DateTime, fechaActual)
            .query('INSERT INTO tb_Posiciones(idReg, lat, lng, motivo, usuario, fecha, fecha_creacion)'+
                ' VALUES (@idReg, @lat, @lng, @motivo, @usuario, @fecha, @fecha_creacion);'+
                ' SELECT SCOPE_IDENTITY() AS id;')
        }else{
            console.log(idd)
            result = await pool.request()
            .input('idReg', sql.Int, req.body.idP)
            .input('lat', sql.VarChar, req.body.lat)
            .input('lng', sql.VarChar, req.body.lng)
            .query(`
                UPDATE tb_Posiciones 
                SET lat = @lat, lng = @lng
                WHERE idP = @idReg;
                SELECT id FROM tb_Posiciones WHERE idP = @idReg;
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
export const getVisita = async (req, res) =>{
    const pool = await getConnection()    
    const result = await pool.request()
    .input('idR', sql.Int, req.params.id)
    .input('usuario', sql.VarChar, req.params.usuario)
    .query('SELECT * FROM tb_Posiciones WHERE idReg=@idR AND usuario=@usuario')
    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message:"No encontrado"});
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
};
export const getVisitaId = async (req, res) => {
    const { id } = req.params;  // Usar req.params para obtener el id de la URL

    // Verificar que el id esté presente y sea un número entero
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido o no proporcionado' });
    }

    try {
        const pool = await getConnection();  // Obtener conexión a la base de datos
        const result = await pool.request()
            .input('id', sql.Int, id)  // Pasar el id como parámetro
            .query("SELECT * FROM tbc_Categoria WHERE id = @id");

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
export const delVisita = async (req, res) => {
    const { id } = req.params;  // Desestructuración del id desde el cuerpo de la solicitud
    console.log(id, req.params)
    if (!id) {
        return res.status(400).json({ mssg: 'El campo "Id" es obligatorio' });
    }

    try {
        const pool = await getConnection();  // Obtener conexión a la base de datos
        const result = await pool.request()
            .input('id', sql.Int, id)  // Pasar el Id como parámetro
            .query("UPDATE tbc_Categoria SET estatus = '0' WHERE id = @id");  // Actualizar el estatus del permiso

        // Verificar si se actualizó algún registro
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ mssg: 'No se encontró el permiso con el id proporcionado' });
        }

        // Responder con un mensaje de éxito
        res.json({
            mssg: 'Permiso eliminado correctamente',
            id: id  // Retornar el id del permiso actualizado
        });
    } catch (error) {
        console.error('Error al actualizar permisos:', error);
        return res.status(500).json({ mssg: 'Error al procesar la solicitud' });
    }
};
