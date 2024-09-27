import Usuario from "../models/Usuarios.js";
import bcryptjs from "bcrypt";
import { generarJWT } from "../middleware/validarJWT.js";
import { sendEmail } from '../utils/mailer.js'; 
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
});


const usuarioController = {
  // Crear un nuevo usuario------------------------------------------------------------------------
  crearUsuario: async (req, res) => {
    const { email, password, nombre, roles } = req.body;
   
    try {
      console.log("req.usuario:", req.usuario); 

      if (!req.usuario || !req.usuario.roles.includes("admin")) {
        return res
          .status(403)
          .json({ error: "No tienes permiso para crear usuarios" });
      }
   
      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return res.status(400).json({ error: "El usuario ya existe" });
      }
   
      const salt = bcryptjs.genSaltSync();
      const passwordEncriptada = bcryptjs.hashSync(password, salt);

      const nuevoUsuario = new Usuario({
        email,
        password: passwordEncriptada,
        nombre,
        roles: roles || ["user"],
      });
   
      const resultado = await nuevoUsuario.save();
      res.status(201).json(resultado);
    } catch (error) {
      console.error("Error al crear usuario:", error); 
      res.status(500).json({ error: "Error al crear usuario" });
    }
  },   
  
  cargarArchivoCloud: async (req, res) => {
    const { id } = req.params;
    try {
        if (!req.files || !req.files.archivo) {
            return res.status(400).json({ error: 'No se ha cargado ningún archivo' });
        }
        const { tempFilePath } = req.files.archivo;
        const result = await cloudinary.uploader.upload(tempFilePath, {
            width: 250,
            crop: "limit"
        });
        let usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        if (usuario.avatar) {
            const nombreTemp = usuario.avatar.split('/');
            const nombreArchivo = nombreTemp[nombreTemp.length - 1];
            const [public_id] = nombreArchivo.split('.');
            await cloudinary.uploader.destroy(public_id);
        }
        usuario = await Usuario.findByIdAndUpdate(id, { avatar: result.url }, { new: true });
        res.json({ url: result.url, usuario });
    } catch (error) {
        console.error("Error al cargar archivo en Cloudinary:", error);
        res.status(500).json({ error: "Error al cargar archivo" });
    }
},


mostrarImagenCloud: async (req, res) => {
  const { id } = req.params;
  try {
      let usuario = await Usuario.findById(id);
      if (!usuario) {
          return res.status(404).json({ error: "Usuario no encontrado" });
      }
      if (usuario.avatar) {
          return res.json({ url: usuario.avatar });
      }
      res.status(400).json({ msg: 'El usuario no tiene una imagen asociada' });
  } catch (error) {
      console.error("Error al mostrar imagen de Cloudinary:", error);
      res.status(500).json({ error: "Error al mostrar imagen" });
  }
},


// Login------------------------------------------------------------------------------------
login: async (req, res) => {
  const { email, password } = req.body;

  try {
  
    const usuario = await Usuario.findOne({ email });

    if (!usuario || usuario.estado === 0) {
      return res.status(401).json({ msg: "Usuario no encontrado o está desactivado" });
    }
    const passwordMatch = bcryptjs.compareSync(password, usuario.password);
    if (!passwordMatch) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    const token = await generarJWT(usuario._id);

    res.json({ usuario, token });
  } catch (error) {
    console.error(error);  
    res.status(500).json({ msg: "Error interno del servidor. Hable con el WebMaster" });
  }
},

  // Listar todos los usuarios--------------------------------------------------------------------------------------

  listarUsuarios: async (req, res) => {
    try {
      const usuarios = await Usuario.find();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: "Error al listar usuarios" });
    }
  },

// Editar un usuario por su ID-------------------------------------------------------------------------------------
editarUsuario: async (req, res) => {
  const { id } = req.params;
  const { email, nombre } = req.body;

  try {
    // Permitir que un usuario edite solo su propia información
    if (req.usuario._id.toString() !== id && !req.usuario.roles.includes("admin")) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para editar este usuario" });
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { email, nombre },
      { new: true }
    );
    if (!usuarioActualizado) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al editar usuario" });
  }
},

// Cambiar la contraseña de un usuario por su ID
cambiarContraseña: async (req, res) => {
  const { id } = req.params;  
  const { contraseñavieja, password } = req.body;  
  try {

    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    if (!bcryptjs.compareSync(contraseñavieja, usuario.password)) {
      return res.status(401).json({ msg: "La contraseña actual es incorrecta" });
    }
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    await usuario.save();

    res.json({ msg: "Contraseña cambiada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al cambiar la contraseña" });
  }
},

  // Eliminar un usuario por su ID----------------------------------------------------------------------
  eliminarUsuario: async (req, res) => {
    const { id } = req.params;

    try {
      if (!req.usuario.roles.includes("admin")) {
        return res
          .status(403)
          .json({ error: "No tienes permiso para eliminar usuarios" });
      }

      const resultado = await Usuario.findByIdAndDelete(id);
      if (!resultado) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json({ msg: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar usuario" });
    }
  },

  // Activar o desactivar un usuario por su ID-----------------------------------------------------------------
  activarDesactivarUsuario: async (req, res) => {
    const { id } = req.params;

    try {
      if (!req.usuario.roles.includes("admin")) {
        return res
          .status(403)
          .json({
            error: "No tienes permiso para activar/desactivar usuarios",
          });
      }

      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      usuario.estado = usuario.estado === 1 ? 0 : 1;
      await usuario.save();

      const mensaje =
        usuario.estado === 1 ? "Usuario activado" : "Usuario desactivado";
      res.json({ msg: mensaje + " correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al activar/desactivar usuario" });
    }
  },

enviarEmail:async (req, res) => {
    try {
        const { email } = req.body;
        await sendEmail(email);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error en el controlador enviarEmail:", error);
        res.status(500).json({ success: false, error: "Error al enviar el email" });
    }
},

cambiarContraseñaEmail: async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });   
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    await usuario.save();
    res.json({ msg: "Contraseña cambiada correctamente" });
  } catch (error) {

    console.error("Error al cambiar la contraseña:", error);
    res.status(500).json({ error: "Error al cambiar contraseña" });
  }
}

};

export default usuarioController;
