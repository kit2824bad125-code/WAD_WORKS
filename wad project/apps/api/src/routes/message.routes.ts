import { Router } from 'express';
import { MessageController } from '../controllers/message.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new MessageController();

router.get('/conversations', authenticateToken, controller.getConversations);
router.get('/conversations/:id/messages', authenticateToken, controller.getMessages);
router.post('/conversations/:id/messages', authenticateToken, controller.sendMessage);

export default router;
