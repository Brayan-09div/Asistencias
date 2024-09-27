import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import usuarioController from '../controllers/usuarios.js';
import { usuarioHelper } from '../helpers/Usuarios.js';
import validarExistaArchivo from '../middleware/validar_file.js';

const router = express.Router();


router.post('/', [
    validarJWT,
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('email').custom(usuarioHelper.existeEmail),
    check('password', 'La contraseña debe tener al menos 8 caracteres').isLength({ min: 8 }),
    validarCampos
], usuarioController.crearUsuario);


// PUT /api/aprendices/cargarCloud/:id
router.put("/cargarCloud/:id", [
    validarJWT,
    check('id').isMongoId(),
    check('id').custom(usuarioHelper.existeUsuarioID),
    validarExistaArchivo, 
    validarCampos
], usuarioController.cargarArchivoCloud);

// GET /api/aprendices/uploadClou/:id
router.get("/uploadClou/:id", [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(usuarioHelper.existeUsuarioID), 
    validarCampos   
], usuarioController.mostrarImagenCloud);




router.post('/login', [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 8 caracteres').isLength({ min: 8 }),
    validarCampos
], usuarioController.login);


router.get('/listar',[
    validarJWT
], usuarioController.listarUsuarios);


router.put('/editar/:id', [
    validarJWT,
    check('id', 'ID inválido').isMongoId(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    validarCampos
], usuarioController.editarUsuario);

router.put('/cambiarContrasena/:id', [
    validarJWT,  
    check('id', 'ID inválido').isMongoId(),  
    check('contraseñavieja', 'La contraseña actual es requerida').not().isEmpty(),  
    check('contraseñavieja', 'La contraseña debe tener al menos 8 caracteres').isLength({ min: 8 }),  
    check('password', 'La nueva contraseña debe tener al menos 8 caracteres').isLength({ min: 8 }),  
], usuarioController.cambiarContraseña);  


router.put('/activarDesactivar/:id', [
    validarJWT,
    check('id', 'ID inválido').isMongoId(),
    validarCampos
], usuarioController.activarDesactivarUsuario);


router.delete('/eliminar/:id', [
    validarJWT,
    check('id', 'ID inválido').isMongoId(),
    validarCampos
], usuarioController.eliminarUsuario);


router.post('/recuperarpassword', [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email').custom(usuarioHelper.verificarEmail),
    validarCampos
], usuarioController.enviarEmail);

router.put('/cambiarContrasenaEmail', [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 8 caracteres').isLength({ min: 8 }),
    validarCampos
  ], usuarioController.cambiarContraseñaEmail);
  


export default router;