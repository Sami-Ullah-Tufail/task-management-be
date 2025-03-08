import { Router } from 'express';
import { userController } from '../controllers/user';

const router = Router();

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

export default router;