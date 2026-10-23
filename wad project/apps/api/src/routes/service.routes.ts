import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller.js';
import { authenticateToken, requireRoles } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new ServiceController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authenticateToken, requireRoles('ADMIN'), controller.create);
router.patch('/:id', authenticateToken, requireRoles('ADMIN'), controller.update);
router.delete('/:id', authenticateToken, requireRoles('ADMIN'), controller.delete);

export default router;
