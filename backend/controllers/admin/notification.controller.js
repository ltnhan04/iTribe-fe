const NotificationService = require("../../services/admin/notification.service");

const getAllNotifications = async (_, res, next) => {
  try {
    const notifications = await NotificationService.handleGetNotifications();

    res.status(200).json({
      message: "Notifications retrieved successfully",
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllNotifications,
};
