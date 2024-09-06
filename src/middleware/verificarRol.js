import Usuario from '../models/Usuarios.js';

export const verificarRolAdmin = async (req, res, next) => {
    try {
        const usuario = await Usuario.findById(req.userId);  
        if (!usuario || !usuario.roles.includes('admin')) {
            return res.status(403).json({ error: 'Acceso denegado: Se requiere rol de administrador' });
        }
        next();
    } catch (error) {
        console.error('Error al verificar rol:', error);
        res.status(500).json({ error: 'Error en la verificación de roles' });
    }
};