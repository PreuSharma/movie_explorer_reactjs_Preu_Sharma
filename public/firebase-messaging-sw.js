importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

const firebaseConfig = {

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
