import Ficha from "../models/Fichas.js";

const fichasController = {
  // Crear una nueva ficha
  crearFicha: async (req, res) => {
    const { codigo, nombre } = req.body;
    try {
      const nuevaFicha = new Ficha({
        codigo,
        nombre,
      }); 
      const resultado = await nuevaFicha.save();
      console.log("Ficha creada:", resultado);
      res.json(resultado);
    } catch (error) {
      console.error("Error al crear ficha:", error);
      res.status(500).json({ error: "Error al crear ficha" });
    }
  },

  // Editar una ficha por su ID
  editarFicha: async (req, res) => {
    const { id } = req.params;
    const { codigo, nombre } = req.body;
    try {
      const resultado = await Ficha.findByIdAndUpdate(
        id,
        { codigo, nombre },
        { new: true }
      );

      if (!resultado) {
        throw new Error("Ficha no encontrada");
      }

      console.log("Ficha editada:", resultado);
      res.json(resultado);
    } catch (error) {
      console.error("Error al editar ficha:", error);
      res.status(500).json({ error: "Error al editar ficha" });
    }
  },

  // Listar todas las fichas
  listarFichas: async (req, res) => {
    try {
      const fichas = await Ficha.find();
      console.log("Lista de fichas:", fichas);
      res.json(fichas);
    } catch (error) {
      console.error("Error al listar fichas:", error);
      res.status(500).json({ error: "Error al listar fichas" });
    }
  },

  // Listar una ficha por su ID
  listarFichaPorId: async (req, res) => {
    const { id } = req.params;
    try {
      const ficha = await Ficha.findById(id);

      if (!ficha) {
        return res.status(404).json({ error: "Ficha no encontrada" });
      }

      console.log("Ficha encontrada:", ficha);
      res.json(ficha);
    } catch (error) {
      console.error("Error al listar ficha por ID:", error);
      res.status(500).json({ error: "Error al listar ficha por ID" });
    }
  },

  // Eliminar una ficha por su ID
  eliminarFicha: async (req, res) => {
    const { id } = req.params;
    try {
      const fichaEliminada = await Ficha.findByIdAndDelete(id);

      if (!fichaEliminada) {
        throw new Error("Ficha no encontrada");
      }

      console.log("Ficha eliminada:", fichaEliminada);
      res.json({ message: "Ficha eliminada correctamente", fichaEliminada });
    } catch (error) {
      console.error("Error al eliminar ficha:", error);
      res.status(500).json({ error: "Error al eliminar ficha" });
    }
  },

  // Activar o desactivar una ficha por su ID
  activarDesactivarFicha: async (req, res) => {
    const { id } = req.params;
    try {
      const ficha = await Ficha.findById(id);
      if (!ficha) {
        return res.status(404).json({ error: "Ficha no encontrada" });
      }

      ficha.estado = ficha.estado === 1 ? 0 : 1; // Cambiar estado (1 -> 0, 0 -> 1)
      await ficha.save();

      const mensaje =
        ficha.estado === 1
          ? "Ficha activada correctamente"
          : "Ficha desactivada correctamente";
      res.json({ msg: mensaje });
    } catch (error) {
      console.error("Error al activar/desactivar ficha:", error);
      res.status(500).json({ error: "Error al activar/desactivar ficha" });
    }
  },
};

export default fichasController;
