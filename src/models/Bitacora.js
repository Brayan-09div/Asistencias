import mongoose from 'mongoose';

const bitacoraSchema = new mongoose.Schema({
    IdAprendis: { type: mongoose.Schema.Types.ObjectId, ref: 'Aprendices' },
    fecha: { type: Date, required: true },
    estado: {
        type: String,
        enum: ['pendiente', 'asistió', 'faltó', 'excusa'],
        default: 'pendiente'
    }
}, { timestamps: true });

export default mongoose.model("Bitacora", bitacoraSchema);


// litar todo
// listar por Aprendis
// listar por ficha


