import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { loginSchema } from '@fixnear/shared';
const router = Router();
const controller = new AuthController();
router.post('/register', controller.register);
router.post('/login', validateBody(loginSchema), controller.login);
router.get('/me', authenticateToken, controller.me);
router.post('/refresh', controller.refresh);
export default router;
//# sourceMappingURL=auth.routes.js.map