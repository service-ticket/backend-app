const express = require('express');
const router = express.Router();
const multerUpload = require('../../middlewares/uploadMiddleware');
const authMiddleware = require('../../middlewares/authMiddleware');
const {feriasController}= require('../../controllers/index');

router.get('/admin/ferias', feriasController.getFerias);
router.get('/admin/ferias/:id', feriasController.getFeriaById);
router.post('/admin/create-ferias',feriasController.postFerias)
router.post('/admin/create-evento',feriasController.postEventByName)
router.post('/admin/upload-excel', multerUpload.singleFile('file'), feriasController.postEeventsExcel);
router.put('/admin/update/:idFeria', feriasController.putFerias);
router.delete('/admin/delete/:idFeria',authMiddleware(['superadmin']), feriasController.deleteFeria);


module.exports = router;
