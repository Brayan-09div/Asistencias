import mongoose from 'mongoose';
import Aprendis from '../models/Aprendices.js';
import Fichas from '../models/Fichas.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
});

const controladorAprendis = {

    crearAprendis: async (req, res) => {
        const { cc, nombre, email, telefono, IdFicha } = req.body;
        try {
            const fichaExistente = await Fichas.findById(IdFicha);
            if (!fichaExistente) {
                return res.status(404).json({ error: 'La ficha especificada no existe' });
            }
            let firmaVirtualUrl = null;
            if (req.files && req.files.firmaVirtual) {
                const { tempFilePath } = req.files.firmaVirtual;
                const result = await cloudinary.uploader.upload(tempFilePath, {
                    width: 250, 
                    crop: "limit"
                });
                firmaVirtualUrl = result.secure_url; 
            }
            const nuevoAprendis = new Aprendis({
                cc,
                nombre,
                email,
                telefono,
                IdFicha,
                firmaVirtual: firmaVirtualUrl 
            });
            const resultado = await nuevoAprendis.save();
            console.log('Aprendiz creado:', resultado);
            res.json(resultado);
        } catch (error) {
            console.error('Error al crear aprendiz:', error);
            res.status(500).json({ error: 'Error al crear el aprendiz' });
        }
    },

    cargarArchivoCloud : async (req, res) => {
        const { id } = req.params;

        try {
            const { tempFilePath } = req.files.archivo;

            const result = await cloudinary.uploader.upload(tempFilePath, {
                width: 250,
                crop: "limit"
            });

            let envio = await Aprendis.findById(id);
            if (envio.firmaVirtual) {
                const nombreTemp = envio.firmaVirtual.split('/');
                const nombreArchivo = nombreTemp[nombreTemp.length - 1];
                const [public_id] = nombreArchivo.split('.');
                cloudinary.uploader.destroy(public_id);
            }

            envio = await Aprendis.findByIdAndUpdate(id, { firmaVirtual: result.url });
            res.json({ url: result.url });
        } catch (error) {
            res.status(400).json({ error, 'general': 'Controlador' });
        }
    },

  
    mostrarImagenCloud: async (req, res) => {
        const { id } = req.params;

        try {
            let aprendiz = await Aprendis.findById(id);
            if (aprendiz.firmaVirtual) {
                return res.json({ url: aprendiz.firmaVirtual });
            }
            res.status(400).json({ msg: 'Falta Imagen' });
        } catch (error) {
            res.status(400).json({ error });
        }
    },

    // Editar un aprendiz por su ID
    editarAprendis: async (req, res) => {
        const { id } = req.params;
        const { cc, nombre, email, telefono, IdFicha } = req.body;
        try {
            const fichaExistente = await Fichas.findById(IdFicha);
            if (!fichaExistente) {
                return res.status(404).json({ error: 'La ficha especificada no existe' });
            }
            
            const resultado = await Aprendis.findByIdAndUpdate(id, {
                cc,
                nombre,
                email,
                telefono,
                IdFicha: new mongoose.Types.ObjectId(IdFicha) 
            }, { new: true });

            if (!resultado) {
                throw new Error('Aprendiz no encontrado');
            }

            console.log('Aprendiz editado:', resultado);
            res.json(resultado);
        } catch (error) {
            console.error('Error al editar aprendiz:', error);
            res.status(500).json({ error: 'Error al editar el aprendiz' });
        }
    },

    // Listar todos los aprendices
    listarAprendis: async (req, res) => {
        try {
            const aprendices = await Aprendis.find().populate('IdFicha');
            console.log('Lista de aprendices:', aprendices);
            res.json(aprendices);
        } catch (error) {
            console.error('Error al listar aprendices:', error);
            res.status(500).json({ error: 'Error al listar los aprendices' });
        }
    },

    // Eliminar un aprendiz por su ID
    eliminarAprendis: async (req, res) => {
        const { id } = req.params;
        try {
            const aprendisEliminado = await Aprendis.findByIdAndDelete(id);

            if (!aprendisEliminado) {
                return res.status(404).json({ error: 'Aprendiz no encontrado' });
            }

            console.log('Aprendiz eliminado:', aprendisEliminado);
            res.json({ message: 'Aprendiz eliminado correctamente', aprendisEliminado });
        } catch (error) {
            console.error('Error al eliminar aprendiz:', error);
            res.status(500).json({ error: 'Error al eliminar el aprendiz' });
        }
    },

    activarDesactivarAprendiz: async (req, res) => {
        const { id } = req.params;
        try {
            // Buscar el aprendiz por ID
            const aprendiz = await Aprendis.findById(id);
    
            // Verificar si el aprendiz existe
            if (!aprendiz) {
                return res.status(404).json({ error: "Aprendiz no encontrado" });
            }
    
            // Alternar el estado del aprendiz (activo / inactivo)
            aprendiz.estado = aprendiz.estado === 1 ? 0 : 1;
            await aprendiz.save();
    
            // Preparar el mensaje en función del nuevo estado
            const mensaje = aprendiz.estado === 1
                ? "Aprendiz activado correctamente"
                : "Aprendiz desactivado correctamente";
    
            // Enviar la respuesta con el mensaje
            res.json({ msg: mensaje });
        } catch (error) {
            console.error("Error al activar/desactivar aprendiz:", error);
            res.status(500).json({ error: "Error al activar/desactivar aprendiz" });
        }
    }

};

export default controladorAprendis;