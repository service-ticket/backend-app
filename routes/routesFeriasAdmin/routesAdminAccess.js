const express = require('express');
const router = express.Router();
const { adminAccesController } = require('../../controllers/index');
const authMiddleware = require('../../middlewares/authMiddleware');

router.post('/admin/auth/login', adminAccesController.loginUser);

router.post(
  '/admin/auth/register',
  authMiddleware(['superadmin']),
  adminAccesController.resgisterUser
);

module.exports = router;