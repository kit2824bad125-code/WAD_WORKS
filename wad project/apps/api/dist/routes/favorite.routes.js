import { Router } from 'express';
import { FavoriteController } from '../controllers/favorite.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
const router = Router();
const controller = new FavoriteController();
router.get('/', authenticateToken, controller.getFavorites);
router.post('/:providerId', authenticateToken, controller.addFavorite);
router.delete('/:providerId', authenticateToken, controller.removeFavorite);
export default router;
//# sourceMappingURL=favorite.routes.js.map