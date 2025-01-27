import { Router } from "express";
import { getToken, setUsuario, getUser, setUpdUsuario, setDelUsuario,
    setUsuarioPermiso, setUsuarioRoles, delUsuarioPermisos, delUsuarioRoles,
    getSesion, updSesion,getUserRol, getUserPermiso
} from '../controllers/login.controllers.js'

const router = Router()

router.get('/token', getToken);
router.get('/login/:id', getUser)
router.post('/login', setUsuario)
router.post('/loginUpdate', setUpdUsuario)
router.delete('/login', setDelUsuario)

router.post('/getSesion', getSesion);
router.get('/updSesion/:id', updSesion)
router.get('/getUsuarioRol/:id', getUserRol)
router.get('/getUsuarioPermiso/:id', getUserPermiso)
router.post('/UsuarioRol/',setUsuarioRoles);
router.post('/UsuarioPermiso/',setUsuarioPermiso);
router.delete('/UsuarioRol/:id',delUsuarioRoles);
router.delete('/UsuarioPermiso/:id',delUsuarioPermisos);
export default router
