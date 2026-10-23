import { Request, Response } from 'express';
import { StoreService } from '../services/store.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class NotificationController {
  private store: StoreService;

  constructor() {
    this.store = StoreService.getInstance();
  }

  public getNotifications = async (req: Request, res: Response): Promise<void> => {
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

  public markAsRead = async (req: Request, res: Response): Promise<void> => {
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

  public markAllAsRead = async (req: Request, res: Response): Promise<void> => {
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
