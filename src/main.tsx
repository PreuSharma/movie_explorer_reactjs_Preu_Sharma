import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { SubscriptionProvider } from "./context/SubscriptionContext";

createRoot(document.getElementById("root") as HTMLElement).render(
  <SubscriptionProvider>
    <App />
  </SubscriptionProvider>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
  });
}
