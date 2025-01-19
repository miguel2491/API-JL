import { Router } from "express";
import { setRoles, setPermiso, getRoles, getPermisos, getRolId, getPermisoId, delRol, delPermiso } from '../controllers/catalogos.controllers.js'

const router = Router()

router.get('/roles', getRoles);
router.get('/rol/:id', getRolId);
router.post('/rol', setRoles);
router.delete('/rol/:id', delRol);

router.get('/permisos', getPermisos);
router.post('/permiso', setPermiso)
router.get('/permisos/:id', getPermisoId);
router.delete('/permisos/:id', delPermiso);

export default router
