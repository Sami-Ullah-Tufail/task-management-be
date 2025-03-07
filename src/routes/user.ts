import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { userController } from '../controllers/user';

const router = Router();

router.get('/', authMiddleware, userController.getUsers);
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

export default router;