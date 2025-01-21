import { Router } from "express";
import { setRoles, getRoles,getRolId, delRol,
    getPermisos,  setPermiso,getPermisoId, delPermiso, 
setCategoria, getCategorias, getCategoria, delCategoria,
setProveedor, getProveedores, getProveedor, delProveedor 
} from '../controllers/catalogos.controllers.js'

const router = Router()
//CATEGORIAS
router.get('/categorias', getCategorias);
router.get('/categoria/:id', getCategoria);
router.post('/categoria', setCategoria);
router.delete('/categoria/:id', delCategoria);
//PROVEEDORES
router.get('/proveedores', getProveedores);
router.get('/proveedor/:id', getProveedor);
router.post('/proveedor', setProveedor);
router.delete('/proveedor/:id', delProveedor);
//ROLES
router.get('/roles', getRoles);
router.get('/rol/:id', getRolId);
router.post('/rol', setRoles);
router.delete('/rol/:id', delRol);
//PERMISOS
router.get('/permisos', getPermisos);
router.post('/permiso', setPermiso)
router.get('/permisos/:id', getPermisoId);
router.delete('/permisos/:id', delPermiso);

export default router
