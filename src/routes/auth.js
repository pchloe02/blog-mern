import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { getMe, updateMe, updatePassword } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.use(protect);
router.post('/logout', logout);
router.get('/me', getMe);
router.patch('/update-me', updateMe);
router.patch('/update-password', updatePassword);

export default router;