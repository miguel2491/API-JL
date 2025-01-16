import { Router } from "express";
import { getToken, setUsuario, getUser} from '../controllers/login.controllers.js'

const router = Router()

router.get('/token', getToken);

router.get('/login/:id', getUser)

router.post('/login', setUsuario)

export default router
