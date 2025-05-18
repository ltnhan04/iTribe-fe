const Notification = require("../../models/notification.model");
const AppError = require("../../helpers/appError.helper");

class NotificationService {
  static handleGetNotifications = async () => {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    if (!notifications) {
      throw new AppError("No notifications found", 404);
    }
    return notifications;
  };
}

module.exports = NotificationService;
