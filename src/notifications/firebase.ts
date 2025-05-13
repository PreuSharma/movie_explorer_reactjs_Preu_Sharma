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

  // apiKey: "AIzaSyCKt2wYuYzr0uKWe8o5jUE6p9wb-3lSK68",
  // authDomain: "movie-explorer-5bc8a.firebaseapp.com",
  // projectId: "movie-explorer-5bc8a",
  // storageBucket: "movie-explorer-5bc8a.firebasestorage.app",
  // messagingSenderId: "561268525206",
  // appId: "1:561268525206:web:9ba893c094bf72aed81ab7",
  // measurementId: "G-XPP4G1SXPV"

  // apiKey: "AIzaSyCci1XkgAyxM7Iewk1W1YwyzGeMfLCa9b0",
  // authDomain: "movieexplorerapp-2025.firebaseapp.com",
  // projectId: "movieexplorerapp-2025",
  // storageBucket: "movieexplorerapp-2025.firebasestorage.app",
  // messagingSenderId: "79088125226",
  // appId: "1:79088125226:web:f4a1dbb7b408aeaaa14a53",
  // measurementId: "G-RKFLEBTXBT"
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
    // const vapidKey = "BB-kLe4vRvnBrHpgtnGuaVLdXTLRKbxJMmX3Ja7Tw92tW9NDKoGzQW1WXZDOII2ObL_bjPzBQvLOL9L6PnkbYxw";
    // const vapidKey = "BNp-QAa-FM4eAUJ6gwJmIHaL8DINbddqGo44EEjFvHf9D35lSeQwMPUdoH27skZDAdUb8bFfwasb9nvC_nkzRcA";

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
    // const vapidKey = "BB-kLe4vRvnBrHpgtnGuaVLdXTLRKbxJMmX3Ja7Tw92tW9NDKoGzQW1WXZDOII2ObL_bjPzBQvLOL9L6PnkbYxw";
    // const vapidKey = "BNp-QAa-FM4eAUJ6gwJmIHaL8DINbddqGo44EEjFvHf9D35lSeQwMPUdoH27skZDAdUb8bFfwasb9nvC_nkzRcA";
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
