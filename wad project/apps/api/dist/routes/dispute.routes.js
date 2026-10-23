import { Router } from 'express';
import { DisputeController } from '../controllers/dispute.controller.js';
import { authenticateToken, requireRoles } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { createDisputeSchema, resolveDisputeSchema } from '@fixnear/shared';
const router = Router();
const controller = new DisputeController();
router.post('/', authenticateToken, validateBody(createDisputeSchema), controller.create);
router.get('/', authenticateToken, controller.getAll);
router.patch('/:id/resolve', authenticateToken, requireRoles('ADMIN'), validateBody(resolveDisputeSchema), controller.resolve);
export default router;
//# sourceMappingURL=dispute.routes.js.map