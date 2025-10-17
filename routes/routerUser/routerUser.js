const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const {ordenUserController}= require('../../controllers/index');


router.post('/client/create-order', ordenUserController.postOrder);
router.post('/client/auth/send-code', ordenUserController.sendCode);
router.post('/client/auth/verify-code', ordenUserController.verifyCode);
router.post('/client/auth/verify-code', ordenUserController.verifyCode);
router.get('/client/:orderId', ordenUserController.getOrderBySlug);
router.get('/client/auth/user-data',authMiddleware(), ordenUserController.getDatauser);




module.exports = router;