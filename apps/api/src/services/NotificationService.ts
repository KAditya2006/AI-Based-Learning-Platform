import { Notification } from '../models';

export class NotificationService {
  static async createNotification(
    learnerId: string, 
    type: 'ASSESSMENT' | 'SKILL_GAP' | 'RECOMMENDATION' | 'SYSTEM' | 'LEARNING', 
    title: string, 
    message: string, 
    link?: string
  ) {
    try {
      const notification = await Notification.create({
        learnerId,
        type,
        title,
        message,
        link
      });
      return notification;
    } catch (error) {
      console.error('Failed to create notification', error);
      // We don't throw to prevent interrupting core workflows if notification fails
    }
  }

  static async getNotifications(learnerId: string, limit = 20) {
    return await Notification.find({ learnerId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  static async getUnreadCount(learnerId: string) {
    return await Notification.countDocuments({ learnerId, isRead: false });
  }

  static async markAsRead(notificationId: string, learnerId: string) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, learnerId },
      { $set: { isRead: true } },
      { new: true }
    );
  }
  
  static async markAllAsRead(learnerId: string) {
    return await Notification.updateMany(
      { learnerId, isRead: false },
      { $set: { isRead: true } }
    );
  }
}
