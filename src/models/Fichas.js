import mongoose from 'mongoose';

const ficasSchema = new mongoose.Schema({
    codigo: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    estado: { type: Number, required: true, default: 1 }
}, { timestamps: true });

export default mongoose.model("Fichas", ficasSchema);

// crear 
// editar
// lisar
// editar
// borrar
// activar / desativar