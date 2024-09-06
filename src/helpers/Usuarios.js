import Usuario from "../models/Usuarios.js";

const usuarioHelper = {
    existeUsuarioID: async (id) => {
        try {
            const existe = await Usuario.findById(id);
            if (!existe) {
                throw new Error(`El usuario con ID ${id} no existe`);
            }
            return existe;
        } catch (error) {
            throw new Error(`Error al buscar usuario por ID: ${error.message}`);
        }
    },

    existeEmail: async (email, method = "POST") => {
        try {
            const existe = await Usuario.findOne({ email });
            if (existe) {
                throw new Error(`Ya existe ese email en la base de datos: ${email}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar email: ${error.message}`);
        }
    },

    verificarEmail: async (email) => {
        try {
            const existe = await Usuario.findOne({ email });
            if (!existe) {
                throw new Error(`El email ${email} no está registrado`);
            }
            return existe;
        } catch (error) {
            throw new Error(`Error al verificar email: ${error.message}`);
        }
    },
};

export { usuarioHelper };