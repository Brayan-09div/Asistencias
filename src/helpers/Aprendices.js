import Aprendices from "../models/Aprendices.js";

const aprendicesHelper = {
    existeAprendizID: async (id) => {
        try {
            const existe = await Aprendices.findById(id);
            if (!existe) {
                throw new Error(`El Aprendiz con ID ${id} no existe`);
            }
            return existe;
        } catch (error) {
            throw new Error(`Error al buscar el aprendiz por ID: ${error.message}`);
        }
    },
    
    existecc: async (cc, method = "POST") => {
        try {
            const existe = await Aprendices.findOne({ cc });
            if (existe) {
                throw new Error(`Ya existe ese cc en la base de datos: ${cc}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar cc: ${error.message}`);
        }
    },

    verificarcc: async (cc) => {
        try {
            const existe = await Aprendices.findOne({ cc });
            if (!existe) {
                throw new Error(`El cc ${cc} no está registrado`);
            }
            return existe;
        } catch (error) {
            throw new Error(`Error al verificar cc: ${error.message}`);
        }
    },

    existeEmail: async ( email, method = "POST") => {
        try {
            const existe = await Aprendices.findOne({  email });
            if (existe) {
                throw new Error(`Ya existe ese  email en la base de datos: ${ email}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar  email: ${error.message}`);
        }
    },

    verificarEmail: async (email) => {
        try {
            const existe = await Aprendices.findOne({ email });
            if (!existe) {
                throw new Error(`El email ${email} no está registrado`);
            }
            return existe;
        } catch (error) {
            throw new Error(`Error al verificar email: ${error.message}`);
        }
    },
};

export { aprendicesHelper };