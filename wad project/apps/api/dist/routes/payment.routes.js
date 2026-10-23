import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
const router = Router();
const controller = new PaymentController();
router.post('/create', authenticateToken, controller.createOrder);
router.post('/verify', authenticateToken, controller.verify);
router.get('/:id', authenticateToken, controller.getPayment);
export default router;
//# sourceMappingURL=payment.routes.js.map