import express from 'express'
import loginR from './routes/login.routes.js'
import cisaR from './routes/cisa.routes.js'

const app = express()
app.use(express.json())
app.use(loginR)
app.use(cisaR)

export default app
