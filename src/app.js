import express from 'express'
import cors from 'cors';
import loginR from './routes/login.routes.js'
import catalogoR from './routes/catalogos.routes.js'
import productoR from './routes/productos.routes.js'
import ticketsR from './routes/tickets.routes.js'
import almacenR from './routes/almacen.routes.js'


const app = express()
app.use(express.json())
app.use(cors());
app.use(loginR)
app.use(catalogoR)
app.use(productoR)
app.use(ticketsR)
app.use(almacenR)
export default app
