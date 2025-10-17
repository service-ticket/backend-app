const express = require('express');
const router = express.Router();
const {feriasController}= require('../../controllers/index');

router.get('/store/ferias', feriasController.getFerias);
router.get('/store/ferias/:id', feriasController.getFerias);

module.exports = router;
