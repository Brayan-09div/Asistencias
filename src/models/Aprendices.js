import mongoose from 'mongoose';

const aprendisSchema = new mongoose.Schema({
    cc: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String, required: true},
    IdFicha: { type: mongoose.Schema.Types.ObjectId, ref: 'Fichas' },
    estado: { type: Number, required: true, default: 1 },
    firmaVirtual: { type: String }
}, { timestamps: true });

export default mongoose.model("Aprendices", aprendisSchema);

// crear 
// editar
// lisar
// editarD
// borrar