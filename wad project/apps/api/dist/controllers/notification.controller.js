import { StoreService } from '../services/store.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
export class NotificationController {
    store;
    constructor() {
        this.store = StoreService.getInstance();
    }
    getNotifications = async (req, res) => {
        if (!req.user) {
            sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
            return;
        }
        const list = this.store.notifications.get(req.user.userId) || [];
        const unreadCount = list.filter(n => !n.isRead).length;
        sendSuccess(res, {
            notifications: list,
            unreadCount,
        });
    };
    markAsRead = async (req, res) => {
        if (!req.user) {
            sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
            return;
        }
        const { id } = req.params;
        const list = this.store.notifications.get(req.user.userId) || [];
        const item = list.find(n => n.id === id);
        if (item) {
            item.isRead = true;
        }
        sendSuccess(res, { id, isRead: true });
    };
    markAllAsRead = async (req, res) => {
        if (!req.user) {
            sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
            return;
        }
        const list = this.store.notifications.get(req.user.userId) || [];
        for (const n of list) {
            n.isRead = true;
        }
        sendSuccess(res, { count: list.length }, 'All notifications marked as read');
    };
}
//# sourceMappingURL=notification.controller.js.map