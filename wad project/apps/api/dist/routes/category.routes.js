import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { authenticateToken, requireRoles } from '../middleware/auth.middleware.js';
const router = Router();
const controller = new CategoryController();
router.get('/', controller.getAll);
router.get('/:slug', controller.getBySlug);
router.post('/', authenticateToken, requireRoles('ADMIN'), controller.create);
router.patch('/:id', authenticateToken, requireRoles('ADMIN'), controller.update);
router.delete('/:id', authenticateToken, requireRoles('ADMIN'), controller.delete);
export default router;
//# sourceMappingURL=category.routes.js.map