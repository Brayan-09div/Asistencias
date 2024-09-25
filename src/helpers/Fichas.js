import Fichas from "../models/Fichas.js";

const fichasHelper = {
    existeFichaID: async (id) => {
        try {
            const existe = await Fichas.findById(id);
            if (!existe) {
                throw new Error(`La ficha con ID ${id} no existe`);
            }
            return existe;
        } catch (error) {
            throw new Error(`Error al buscar la ficha por ID: ${error.message}`);
        }
    },

    existeCodigo: async (codigo, method = "POST") => {
        try {
            const existe = await Fichas.findOne({ codigo });
            if (existe) {
                throw new Error(`Ya existe ese codigo en la base de datos: ${codigo}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar codigo: ${error.message}`);
        }
    },

    verificarCodigo: async (codigo) => {
        try {
            const existe = await Fichas.findOne({ codigo });
            if (!existe) {
                throw new Error(`El codigo ${codigo} no está registrado`);
            }
            return existe;
        } catch (error) {
            throw new Error(`Error al verificar codigo: ${error.message}`);
        }
    },

    CodigoValido: async (codigo, id) => {
        try {
            const documento = await Fichas.findOne({ codigo });
            if (documento && documento._id.toString() !== id) {
                throw new Error(`El código ${codigo} ya existe`);
            }
        } catch (error) {
            throw new Error(`Error al validar código: ${error.message}`);
        }
    },
};

export { fichasHelper };