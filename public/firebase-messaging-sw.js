importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  // apiKey: "AIzaSyCKt2wYuYzr0uKWe8o5jUE6p9wb-3lSK68",
  // authDomain: "movie-explorer-5bc8a.firebaseapp.com",
  // projectId: "movie-explorer-5bc8a",
  // storageBucket: "movie-explorer-5bc8a.firebasestorage.app",
  // messagingSenderId: "561268525206",
  // appId: "1:561268525206:web:9ba893c094bf72aed81ab7",
  // measurementId: "G-XPP4G1SXPV"

  apiKey: "AIzaSyBX0XeyeP8aL_vBNL_9-A9ngsaO8MKroVY",
  authDomain: "movieexplorer-cb435.firebaseapp.com",
  projectId: "movieexplorer-cb435",
  storageBucket: "movieexplorer-cb435.firebasestorage.app",
  messagingSenderId: "486386508395",
  appId: "1:486386508395:web:e4dec00e6a29d6ca35c72e",
  measurementId: "G-6H518PGSKJ",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || "/favicon.ico",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
