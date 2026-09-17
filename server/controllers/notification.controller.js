import * as notifService from "../services/notification.service.js";
import { markReadSchema } from "../validators/notification.validator.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.uid;
    const notifications = await notifService.getUserNotifications(userId);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.uid;
    const count = await notifService.getUnreadCount(userId);
    res.status(200).json({ success: true, data: { unreadCount: count } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.uid;
    const validated = markReadSchema.parse(req.body);
    const result = await notifService.markNotificationsRead(userId, validated.notificationIds);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, message: "Validation error", error: error.errors });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
