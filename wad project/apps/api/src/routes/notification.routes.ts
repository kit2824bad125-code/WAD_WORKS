import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new NotificationController();

router.get('/', authenticateToken, controller.getNotifications);
router.patch('/:id/read', authenticateToken, controller.markAsRead);
router.patch('/read-all', authenticateToken, controller.markAllAsRead);

export default router;
 