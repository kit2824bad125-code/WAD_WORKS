import { Router } from 'express';
import { ProviderController } from '../controllers/provider.controller.js';
import { authenticateToken, requireRoles } from '../middleware/auth.middleware.js';
const router = Router();
const controller = new ProviderController();
router.get('/earnings', authenticateToken, requireRoles('SERVICE_PROVIDER'), controller.getEarnings);
router.patch('/profile', authenticateToken, requireRoles('SERVICE_PROVIDER'), controller.updateProfile);
router.patch('/availability/toggle', authenticateToken, requireRoles('SERVICE_PROVIDER'), controller.toggleAvailability);
router.patch('/working-hours', authenticateToken, requireRoles('SERVICE_PROVIDER'), controller.updateWorkingHours);
router.get('/:id', controller.getById);
export default router;
//# sourceMappingURL=provider.routes.js.map