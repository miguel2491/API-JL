import { Router } from "express";
import { getAlmacen, getAlmacenId, setAlmacen, delAlmacen   
} from '../controllers/almacen.controllers.js'

const router = Router()
//-------------------- ALMACEN -------------------------------
router.get('/almacenes', getAlmacen);
router.get('/almacen/:id', getAlmacenId);
router.post('/almacen', setAlmacen);
router.delete('/almacen/:id', delAlmacen);

export default router