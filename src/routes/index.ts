import { Router } from 'express';
import userRoutes from './user';
import taskRoutes from "./task"

const router = Router();

router.use('/user', userRoutes);
router.use('/task', taskRoutes);

export default router;