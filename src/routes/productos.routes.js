import { Router } from "express";
import { setProducto, getProductos, getProducto, delProducto} from '../controllers/productos.controllers.js'

const router = Router()
//===========================> <=====================================
router.get('/productos', getProductos);
router.get('/producto/:id', getProducto);
router.post('/producto', setProducto);
router.delete('/producto/:id', delProducto);

export default router
