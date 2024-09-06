import express from 'express';
import { check } from 'express-validator';
import controladorAprendis from '../controllers/Aprendices.js';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import { aprendicesHelper } from '../helpers/Aprendices.js';
import { fichasHelper } from '../helpers/Fichas.js';

const router = express.Router();

// POST /api/aprendices
router.post('/', [
     validarJWT,
    check('cc', 'El campo cc es obligatorio').not().isEmpty(),
    check('cc').custom(aprendicesHelper.existecc),
    check('nombre', 'El campo nombre es obligatorio').not().isEmpty(),
    check('email', 'El campo email es obligatorio').not().isEmpty().isEmail(),
    check('email').custom(aprendicesHelper.existeEmail),
    check('telefono', 'El campo telefono es obligatorio').not().isEmpty(),
    check('IdFicha', 'El campo IdFicha es obligatorio').not().isEmpty(),
    check('IdFicha').custom(fichasHelper.existeFichaID),
    validarCampos
], controladorAprendis.crearAprendis);


// GET /api/aprendices/listar
router.get('/listar', [
     validarJWT,
], controladorAprendis.listarAprendis);


// DELETE /api/aprendices/eliminar/:id
router.delete('/eliminar/:id', [
    validarJWT,
    check('id', 'El ID proporcionado no es válido').isMongoId(),
    check('id').custom(aprendicesHelper.existeAprendizID),
    validarCampos
], controladorAprendis.eliminarAprendis);


router.put('/editar/:id', [
    validarJWT,
    check('id', 'El ID proporcionado no es válido').isMongoId(),
    
    // Validación para cc
    check('cc').optional().isString().withMessage('El campo cc debe ser un número')
        .custom(aprendicesHelper.existecc),

    // Validación para nombre
    check('nombre').optional().isString().withMessage('El campo nombre debe ser una cadena')
        .not().isEmpty().withMessage('El campo nombre no puede estar vacío'),

    // Validación para email
    check('email').optional().custom(aprendicesHelper.existeEmail),

    // Validación para teléfono
    check('telefono').optional().isString().withMessage('El campo telefono debe ser una cadena')
        .not().isEmpty().withMessage('El campo telefono no puede estar vacío'),

    // Validación para IdFicha
    check('IdFicha').optional().isMongoId().withMessage('El campo IdFicha debe ser un ID de Mongo válido')
        .custom(fichasHelper.existeFichaID),

    validarCampos
], controladorAprendis.editarAprendis);


// PUT /api/aprendices/activarDesactivar/:id
router.put('/activarDesactivar/:id', [
    validarJWT,
    check('id', 'El ID proporcionado no es válido').isMongoId(),
    check('id').custom(aprendicesHelper.existeAprendizID),
    validarCampos
], controladorAprendis.activarDesactivarAprendiz);


export default router;