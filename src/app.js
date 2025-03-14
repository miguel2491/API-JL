import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import loginR from './routes/login.routes.js'
import catalogoR from './routes/catalogos.routes.js'
import productoR from './routes/productos.routes.js'
import ticketsR from './routes/tickets.routes.js'
import almacenR from './routes/almacen.routes.js'
import notificacion from './routes/notificacion.routes.js'
//HTTPS
const options = {
    key: fs.readFileSync('keyJLN.pem','utf-8'),   // Asegúrate de tener el archivo de clave privada
    cert: fs.readFileSync('cert.pem','utf-8'), // Asegúrate de tener el archivo de certificado
    passphrase:'JULIETA'
  };
//-----------------------------------
const app = express()
const corsOptions = {
    origin: 'https://192.168.100.44:3000',  // Aquí va la URL de tu frontend (cambiar al puerto de React)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials:true,
  };
  
app.use(cors(corsOptions));
app.use(express.json())
app.use(loginR)
app.use(catalogoR)
app.use(productoR)
app.use(ticketsR)
app.use(almacenR)
app.use(notificacion)
https.createServer(options, app).listen(5004, '192.168.100.44', () => {
    console.log('Servidor HTTPS corriendo en https://192.168.100.44:5004');
  });
export default app
