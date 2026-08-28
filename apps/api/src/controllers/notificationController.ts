import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/NotificationService';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const notifications = await NotificationService.getNotifications(req.user!.userId, limit);
    const unreadCount = await NotificationService.getUnreadCount(req.user!.userId);
    res.json({ success: true, data: { notifications, unreadCount } });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const notification = await NotificationService.markAsRead(id, req.user!.userId);
    if (!notification) {
      const err: any = new Error('Not found');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }
    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationService.markAllAsRead(req.user!.userId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
