import express from 'express';
import { check } from 'express-validator';
import fichasController from '../controllers/Fichas.js';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import { fichasHelper } from '../helpers/Fichas.js';

const router = express.Router();

router.post('/', [
     validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('codigo', 'El código es obligatorio').not().isEmpty(),
    check('codigo', 'El código debe ser un número de 7 dígitos').isNumeric().isLength({ min: 7, max: 7 }),
    check('codigo').custom(fichasHelper.existeCodigo),
    validarCampos
], fichasController.crearFicha);

router.get('/listar', [
     validarJWT
], fichasController.listarFichas);

router.get('/listar/:id', [
     validarJWT,
    check('id', 'El id invalido' ).isMongoId(),
    check('id').custom(fichasHelper.existeFichaID),
    validarCampos
], fichasController.listarFichaPorId);

router.delete('/eliminar/:id', [
     validarJWT,
    check('id', 'ID inválido').isMongoId(),
    check('id').custom(fichasHelper.existeFichaID),
    validarCampos
], fichasController.eliminarFicha);

router.put('/activarDesactivar/:id', [
    validarJWT,
    check('id', 'ID inválido').isMongoId(),
    check('id').custom(fichasHelper.existeFichaID),
    validarCampos
], fichasController.activarDesactivarFicha);

router.put('/editar/:id', [
     validarJWT,
    check('id', 'ID inválido').isMongoId(),
    check('id').custom(fichasHelper.existeFichaID),
    check('codigo').optional().isNumeric().withMessage('El código debe ser un número').isLength({ min: 7, max: 7 }).withMessage('El código debe ser de 7 dígitos'),
    check('codigo').custom(fichasHelper.existeCodigo),
    check('nombre').optional().not().isEmpty().withMessage('El nombre es obligatorio'),
    validarCampos
], fichasController.editarFicha)

export default router;
