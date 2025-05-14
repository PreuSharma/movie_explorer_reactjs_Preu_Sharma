import { initializeApp } from "firebase/app";
import {
  deleteToken,
  getMessaging,
  getToken,
  onMessage,
} from "firebase/messaging";
import { sendTokenToBackend } from "../services/userServices";

const firebaseConfig = {
  apiKey: "AIzaSyBX0XeyeP8aL_vBNL_9-A9ngsaO8MKroVY",
  authDomain: "movieexplorer-cb435.firebaseapp.com",
  projectId: "movieexplorer-cb435",
  storageBucket: "movieexplorer-cb435.firebasestorage.app",
  messagingSenderId: "486386508395",
  appId: "1:486386508395:web:e4dec00e6a29d6ca35c72e",
  measurementId: "G-6H518PGSKJ",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log("Service Worker registered:", registration);

    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);
    if (permission !== "granted") {
      console.warn("Notification permission not granted:", permission);
      return null;
    }

    const vapidKey =
      "BFm0kTDh9QoBi9OGzGTctrOsCUSCmg7uKrvxDbDh0TDrDm35H-TgvXjPmAxZqXFV4PZOFihn0JuKzpCXSTwc_cE";

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token || typeof token !== "string" || token.length < 50) {
      console.warn("Generated token appears invalid");
      return null;
    }

    console.log("New FCM Token:", token);
    sendTokenToBackend(token);

    return token;
  } catch (error) {
    console.error("Error generating FCM token or sending to backend:", error);
    return null;
  }
};

export const monitorToken = async () => {
  try {
    const vapidKey =
      "BFm0kTDh9QoBi9OGzGTctrOsCUSCmg7uKrvxDbDh0TDrDm35H-TgvXjPmAxZqXFV4PZOFihn0JuKzpCXSTwc_cE";
    const token = await getToken(messaging, { vapidKey }).catch(
      async (error) => {
        if (
          error.code === "messaging/token-unsubscribed" ||
          error.code === "messaging/invalid-token"
        ) {
          console.log("Token invalid or unsubscribed, generating new token");
          await deleteToken(messaging).catch(() =>
            console.log("No token to delete")
          );
          const newToken = await getToken(messaging, { vapidKey });
          console.log("New FCM Token (refreshed):", newToken);
          return newToken;
        }
        throw error;
      }
    );
    if (token) {
      if (typeof token !== "string" || token.length < 50) {
        console.warn("Monitored token appears invalid");
        return null;
      }
      console.log("Token validated:", token);
    }
    return token;
  } catch (error) {
    console.error("Error monitoring FCM token:", error);
    return null;
  }
};

export { onMessage };
