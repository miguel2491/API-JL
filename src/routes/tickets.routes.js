import { Router } from "express";
import { getTickets, setTicket, getTicketId, delTicket   
} from '../controllers/tickets.controllers.js'

const router = Router()
//-------------------- TICKET -------------------------------
router.get('/tickets', getTickets);
router.get('/ticket/:id', getTicketId);
router.post('/ticket', setTicket);
router.delete('/ticket/:id', delTicket);

export default router