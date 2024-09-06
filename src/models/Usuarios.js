import mongoose from 'mongoose';
import bcryptjs from "bcrypt";

const usuarioSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, default: "" },
    nombre: { type: String, required: true },
    estado: { type: Number, required: true, default: 1 },
    roles: { type: [String], default: ["user"] },  
    resetPasswordToken: { type: String },  
    resetPasswordExpires: { type: Date },  
}, { timestamps: true });


usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
});

export default mongoose.model("Usuarios", usuarioSchema);


// crear nuevo usuario
// listar todo 
// editar
// cambiar contraseña
// borrar
// activar/desactivar