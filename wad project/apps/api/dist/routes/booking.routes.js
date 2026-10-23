import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { createBookingSchema, updateBookingStatusSchema } from '@fixnear/shared';
const router = Router();
const controller = new BookingController();
router.post('/', authenticateToken, validateBody(createBookingSchema), controller.create);
router.get('/', authenticateToken, controller.getUserBookings);
router.get('/:id', authenticateToken, controller.getById);
router.patch('/:id/status', authenticateToken, validateBody(updateBookingStatusSchema), controller.updateStatus);
router.post('/:id/quote', authenticateToken, controller.createQuote);
router.post('/:id/quote/respond', authenticateToken, controller.respondQuote);
export default router;
//# sourceMappingURL=booking.routes.js.map