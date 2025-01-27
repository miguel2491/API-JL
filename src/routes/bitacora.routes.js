import { Router } from "express";
import {    
} from '../controllers/bitacora.controllers.js'

const router = Router()
//-------------------- ALMACEN -------------------------------
router.get('/bitacoras', getAlmacen);
router.get('/bitacora/:id', getAlmacenId);
router.post('/bitacora', setAlmacen);
router.delete('/bitacora/:id', delAlmacen);

export default router