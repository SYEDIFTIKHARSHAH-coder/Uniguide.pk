// Mocking Firebase Admin Firestore + Firebase Cloud Messaging

const MOCK_NOTIFICATIONS = [
  {
    id: "notif_001",
    title: "NUST Fall 2026 Admissions Open",
    message: "NUST has opened admissions for Fall 2026. Apply before the deadline!",
    type: "admission",
    recipientId: "student_uid_1",
    link: "/universities/nust",
    priority: "high",
    isRead: false,
    createdAt: "2026-07-07T08:00:00Z"
  },
  {
    id: "notif_002",
    title: "HEC Need-Based Scholarship – Deadline in 3 Days",
    message: "The HEC Need-Based Scholarship deadline is July 10, 2026. Submit your application now.",
    type: "deadline",
    recipientId: "student_uid_1",
    link: "/scholarships/hec-need-based",
    priority: "high",
    isRead: false,
    createdAt: "2026-07-06T14:00:00Z"
  },
  {
    id: "notif_003",
    title: "Application Status Updated – FAST NUCES",
    message: "Your application to BS Software Engineering at FAST NUCES has been moved to 'Under Review'.",
    type: "application_status",
    recipientId: "student_uid_1",
    link: "/student/applications/app_992",
    priority: "medium",
    isRead: true,
    createdAt: "2026-07-05T10:00:00Z"
  },
  {
    id: "notif_004",
    title: "System Maintenance Scheduled",
    message: "UniGuid.pk will undergo scheduled maintenance on July 12, 2026, from 2:00 AM to 4:00 AM PKT.",
    type: "system",
    recipientId: "student_uid_1",
    link: null,
    priority: "low",
    isRead: true,
    createdAt: "2026-07-04T09:00:00Z"
  }
];

export const getUserNotifications = async (userId) => {
  // MOCK: db.collection("notifications").where("recipientId", "==", userId).orderBy("createdAt", "desc").get()
  return MOCK_NOTIFICATIONS.filter(n => n.recipientId === userId);
};

export const getUnreadCount = async (userId) => {
  // MOCK: db.collection("notifications").where("recipientId", "==", userId).where("isRead", "==", false).get()
  return MOCK_NOTIFICATIONS.filter(n => n.recipientId === userId && !n.isRead).length;
};

export const markNotificationsRead = async (userId, notificationIds) => {
  // MOCK: batch update all matching notifications
  let count = 0;
  notificationIds.forEach(id => {
    const notif = MOCK_NOTIFICATIONS.find(n => n.id === id && n.recipientId === userId);
    if (notif) {
      notif.isRead = true;
      count++;
    }
  });
  return { success: true, markedCount: count };
};

export const sendPushNotification = async (fcmToken, title, body) => {
  // MOCK: In production, this calls Firebase Admin SDK:
  // admin.messaging().send({ token: fcmToken, notification: { title, body } })
  console.log(`[FCM MOCK] Sending push to ${fcmToken}: "${title}" - "${body}"`);
  return { success: true };
};
