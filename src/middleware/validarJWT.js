import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuarios.js';

const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "10h"
        }, (err, token) => {
            if (err) {
                reject("No se pudo generar el token");
            } else {
                resolve(token);
            }
        });
    });
};

const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            msg: "Error en la petición"
        });
    }

    try {
        let usuario;

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        if (!uid) {
            return res.status(401).json({
                msg: "Error en la petición"
            });
        }

        usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: "Error en la petición! - usuario no existe DB"
            });
        }

        if (usuario.estado === 0) {
            return res.status(401).json({
                msg: "Token no válido!! - usuario con estado: false"
            });
        }

        req.usuario = usuario; // Añadir el objeto usuario al objeto request
        next();

    } catch (error) {
        console.error(error);
        res.status(401).json({
            msg: "Token no válido"
        });
    }
};

export { generarJWT, validarJWT };
