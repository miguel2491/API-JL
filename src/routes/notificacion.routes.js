import { Router } from "express";
import { getNotificacion, getNotificacionId, setNotificacion, delNotificacion } from '../controllers/notificacion.controllers.js'

const router = Router()
//-------------------- NOTIFICACION -------------------------------
router.get('/notificaciones', getNotificacion);
router.get('/notificacion/:id', getNotificacionId);
router.post('/notificacion', setNotificacion);
router.delete('/notificacion/:id', delNotificacion);

export default router