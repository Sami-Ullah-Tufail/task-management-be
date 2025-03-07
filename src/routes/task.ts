import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { Tasks } from '../controllers/task';

const router = Router();

router.get('/search', authMiddleware, Tasks.searchTasks);
router.get('/', authMiddleware, Tasks.getTasks);
router.post('/', authMiddleware, Tasks.createTask);
router.get('/:id', authMiddleware, Tasks.getTaskById);
router.patch('/:id', authMiddleware, Tasks.updateTask);
router.delete('/:id', authMiddleware, Tasks.deleteTask);

export default router;