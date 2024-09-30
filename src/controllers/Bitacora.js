import Bitacora from '../models/Bitacora.js';
import Aprendices from '../models/Aprendices.js';

const bitacoraController = {

    crearBitacora: async (req, res) => {
        const { cc, fecha } = req.body;
        const fechaBuscada = new Date(fecha || Date.now());
    
        // Obtener la fecha de inicio y fin para la comparación (todo el día)
        const fechaInicio = new Date(fechaBuscada);
        fechaInicio.setHours(0, 0, 0, 0); // Establecer a medianoche
        const fechaFin = new Date(fechaBuscada);
        fechaFin.setHours(23, 59, 59, 999); // Establecer a final del día
    
        try {
            // Buscar aprendiz por cc
            const aprendiz = await Aprendices.findOne({ cc });
            if (!aprendiz) {
                return res.status(404).json({ error: 'Aprendiz no encontrado' });
            }
    
            // Verificar si ya existe una bitácora para el mismo aprendiz en la misma fecha
            const existeBitacora = await Bitacora.findOne({
                IdAprendis: aprendiz._id,
                fecha: {
                    $gte: fechaInicio,
                    $lte: fechaFin
                }
            });
    
            if (existeBitacora) {
                return res.status(400).json({ error: 'Ya existe una bitácora para este aprendiz en la misma fecha' });
            }
    
            // Crear nueva bitácora
            const nuevaBitacora = new Bitacora({
                IdAprendis: aprendiz._id,
                fecha: fechaBuscada,
                estado: 'pendiente'
            });
    
            const resultado = await nuevaBitacora.save();
            res.status(201).json(resultado);
        } catch (error) {
            console.error('Error al crear bitácora:', error);
            res.status(500).json({ error: 'Error al crear bitácora' });
        }
    },
    
    // Listar todas las entradas de bitácora
    listarTodo: async (req, res) => {
        try {
            const bitacoras = await Bitacora.find({})
                .populate({
                    path: 'IdAprendis',
                    populate: { path: 'IdFicha' }
                })
                .exec();
          
            console.log('Lista de entradas de bitácora:', bitacoras);
            res.json(bitacoras);
        } catch (error) {
            console.error('Error al listar las entradas de bitácora:', error);
            res.status(500).json({ error: 'Error al listar las entradas de bitácora' });
        }
    },
    
    listarPorFecha: async (req, res) => {
        const { fechaInicio, fechaFin } = req.params;

        try {
            const bitacoras = await Bitacora.find({
                fecha: {
                    $gte: new Date(fechaInicio),
                    $lte: new Date(fechaFin)
                }
            }).populate({
                path: 'IdAprendis',
                populate: { path: 'IdFicha' }
            }).exec();

            console.log(`Lista de entradas de bitácora entre ${fechaInicio} y ${fechaFin}:`, bitacoras);
            res.json(bitacoras);
        } catch (error) {
            console.error(`Error al listar las entradas de bitácora entre ${fechaInicio} y ${fechaFin}:`, error);
            res.status(500).json({ error: 'Error al listar las entradas de bitácora por fechas' });
        }
    },

    listarPorFechaUnica: async (req, res) => {
        const { fecha } = req.params;
        try {
          const bitacoras = await Bitacora.find({
            fecha: {
              $gte: new Date(fecha),
              $lt: new Date(new Date(fecha).setDate(new Date(fecha).getDate() + 1))
            }
          }).populate({
            path: 'IdAprendis',
            populate: { path: 'IdFicha' }
        }).exec();
    
          if (bitacoras.length === 0) {
            return res.status(404).json({ message: 'No bitácoras found for the specified date' });
          }
    
          res.json(bitacoras);
        } catch (error) {
          console.error('Error listing bitácoras by date', error);
          res.status(500).json({ message: 'Error listing bitácoras by date' });
        }
    },

   
    listarPorAprendis: async (req, res) => {
        const { idAprendis } = req.params;
        try {
            const bitacoras = await Bitacora.find({ IdAprendis: idAprendis })     .populate({
                path: 'IdAprendis',
                populate: { path: 'IdFicha' }
            })
            .exec();
            console.log(`Lista de entradas de bitácora para el aprendiz ${idAprendis}:`, bitacoras);
            res.json(bitacoras);
        } catch (error) {
            console.error(`Error al listar las entradas de bitácora para el aprendiz ${idAprendis}:`, error);
            res.status(500).json({ error: `Error al listar las entradas de bitácora para el aprendiz ${idAprendis}` });
        }
    },

  
    listarPorFicha: async (req, res) => {
        const { IdFicha } = req.params;
        console.log(IdFicha);
        
        try {
            let array = [];
            const bitacoras = await Bitacora.find()
            .populate({
                path: 'IdAprendis',
                populate: { path: 'IdFicha' }
            })
            .exec();

            for (let i = 0; i < bitacoras.length; i++) {
                const bitacora = bitacoras[i];
                const estudiante = {
                    _id: bitacora?.IdAprendis?.IdFicha,
                    name: {
                        first: "Future",
                        last: "Studio"
                    }
                };
                const isEqual = estudiante._id.equals(IdFicha);

                if (bitacora?.IdAprendis?.IdFicha === IdFicha || isEqual) {
                    array.push(bitacora);
                }
            }

            console.log(`Lista de entradas de bitácora para la ficha ${IdFicha}:`, array);
            res.json(array);
        } catch (error) {
            console.error(`Error al listar las entradas de bitácora para la ficha ${IdFicha}:`, error);
            res.status(500).json({ error: `Error al listar las entradas de bitácora para la ficha ${IdFicha}` });
        }
    },

 
    actualizarEstado: async (req, res) => {
        const { id } = req.params;
        const { estado } = req.body;

        const estadosPermitidos = ['pendiente', 'asistió', 'faltó', 'excusa'];
        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({ error: 'Estado no válido' });
        }

        try {
            const bitacoraActualizada = await Bitacora.findByIdAndUpdate(
                id,
                { estado },
                { new: true } 
            );

            if (!bitacoraActualizada) {
                return res.status(404).json({ error: 'Bitácora no encontrada' });
            }

            console.log('Bitácora actualizada:', bitacoraActualizada);
            res.json(bitacoraActualizada);
        } catch (error) {
            console.error('Error al actualizar el estado de la bitácora:', error);
            res.status(500).json({ error: 'Error al actualizar el estado de la bitácora' });
        }
    },

    listarPorFichaYFecha: async (req, res) => {
        const { IdFicha, fecha } = req.params;
        try {
            const fechaInicio = new Date(fecha);
            const fechaFin = new Date(fechaInicio);
            fechaFin.setDate(fechaFin.getDate() + 1);
            const bitacoras = await Bitacora.find({
                fecha: {
                    $gte: fechaInicio,
                    $lt: fechaFin
                }
            }).populate({
                path: 'IdAprendis',
                populate: { path: 'IdFicha' }
            }).exec();
            console.log('Bitácoras encontradas:', bitacoras);
            const bitacorasFiltradas = bitacoras.filter(bitacora => {
                const fichaId = bitacora?.IdAprendis?.IdFicha?._id;
                console.log('IdFicha en bitácora:', fichaId);
                return fichaId.equals(IdFicha);
            });
            console.log('Bitácoras filtradas:', bitacorasFiltradas);
            if (bitacorasFiltradas.length === 0) {
                console.log('No se encontraron bitácoras para la ficha y fecha especificadas');
                return res.status(404).json({ message: 'No se encontraron bitácoras para la ficha y fecha especificadas' });
            }
            res.json(bitacorasFiltradas);
        } catch (error) {
            console.error('Error al listar las entradas de bitácora:', error);
            res.status(500).json({ error: 'Error al listar las entradas de bitácora por ficha y fecha' });
        }
    },
    
    
};

export default bitacoraController;

