import express from 'express'
import loginR from './routes/login.routes.js'
import catalogoR from './routes/catalogos.routes.js'

const app = express()
app.use(express.json())
app.use(loginR)
app.use(catalogoR)

export default app
