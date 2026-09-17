import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./config.js"; // Your existing Firebase app config

// Initialize Firebase Cloud Messaging
let messaging;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.warn("Firebase Messaging not supported in this browser:", error.message);
}

/**
 * Requests the user's permission for push notifications
 * and returns the FCM device token to send to the backend.
 */
export const requestNotificationPermission = async () => {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied by user.");
      return null;
    }

    // Get the FCM token. Replace VAPID_KEY with your actual key from Firebase Console.
    const token = await getToken(messaging, {
      vapidKey: "YOUR_VAPID_KEY_FROM_FIREBASE_CONSOLE",
    });

    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

/**
 * Listens for incoming push messages while the app is in the foreground.
 * Call this once in your root App component.
 */
export const onForegroundMessage = (callback) => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    callback(payload);
  });
};
