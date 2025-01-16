import { Router } from "express";
import {getCicatMensual, getCicatSemanal} from '../controllers/cicat.controllers.js'

const router = Router()

router.post('/cicat', getCicatMensual);
router.post('/cicatSemanal', getCicatSemanal);

export default router