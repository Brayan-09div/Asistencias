import express from 'express';
import http from 'http';
import cors from 'cors';
import { dbconnect } from "../../databases/config.js";

import usuarioRoutes from '../rutes/Usuarios.js';
import bitacorasRutes from '../rutes/Bitacora.js';
import aprendicesRutes from '../rutes/Aprendices.js';
import fichasRutes from '../rutes/Fichas.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT 
        this.server = http.createServer(this.app);
    
        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        this.conectarbd()
    }

    async conectarbd(){
        await dbconnect();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use('/api/Usuarios', usuarioRoutes);
        this.app.use('/api/Aprendices', aprendicesRutes);
        this.app.use('/api/Bitacoras', bitacorasRutes);
        this.app.use('/api/Fichas', fichasRutes);
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`);
        });
    }
}

export { Server };