import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticateToken, requireRoles } from '../middleware/auth.middleware.js';
const router = Router();
const controller = new AdminController();
// Guard all admin routes with requireRoles('ADMIN')
router.use(authenticateToken, requireRoles('ADMIN'));
router.get('/dashboard', controller.getDashboard);
router.get('/providers', controller.getProviders);
router.patch('/providers/:id/verify', controller.verifyProvider);
router.get('/users', controller.getUsers);
router.patch('/users/:id/suspend', controller.suspendUser);
router.get('/audit-logs', controller.getAuditLogs);
export default router;
//# sourceMappingURL=admin.routes.js.map