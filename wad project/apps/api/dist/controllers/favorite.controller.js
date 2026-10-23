import { StoreService } from '../services/store.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
export class FavoriteController {
    store;
    constructor() {
        this.store = StoreService.getInstance();
    }
    getFavorites = async (req, res) => {
        if (!req.user) {
            sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
            return;
        }
        const favs = Array.from(this.store.favorites.values()).filter(f => f.customerId === req.user?.userId);
        const list = favs.map(f => {
            const provider = this.store.providerProfiles.get(f.providerId);
            return {
                ...f,
                provider,
            };
        }).filter(f => !!f.provider);
        sendSuccess(res, list);
    };
    addFavorite = async (req, res) => {
        if (!req.user) {
            sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
            return;
        }
        const { providerId } = req.params;
        const provider = this.store.providerProfiles.get(providerId);
        if (!provider) {
            sendError(res, 'PROVIDER_NOT_FOUND', 'Provider not found', 404);
            return;
        }
        const key = `${req.user.userId}_${providerId}`;
        const favorite = {
            id: `fav-${Date.now()}`,
            customerId: req.user.userId,
            providerId,
            provider,
            createdAt: new Date().toISOString(),
        };
        this.store.favorites.set(key, favorite);
        sendSuccess(res, favorite, 'Added to your favorite service professionals', 201);
    };
    removeFavorite = async (req, res) => {
        if (!req.user) {
            sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
            return;
        }
        const { providerId } = req.params;
        const key = `${req.user.userId}_${providerId}`;
        this.store.favorites.delete(key);
        sendSuccess(res, { providerId }, 'Removed from favorites');
    };
}
//# sourceMappingURL=favorite.controller.js.map