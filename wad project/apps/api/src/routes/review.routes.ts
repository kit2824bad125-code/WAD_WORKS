import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { createReviewSchema } from '@fixnear/shared';

const router = Router();
const controller = new ReviewController();

router.post('/:bookingId', authenticateToken, validateBody(createReviewSchema), controller.create);
router.get('/provider/:providerId', controller.getProviderReviews);

export default router;
