import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import RoutingModule from "./routes/RoutingModule";
import { Toaster } from "react-hot-toast";
import { generateToken, messaging } from "./notifications/firebase";
import { onMessage } from "firebase/messaging";

const App: React.FC = () => {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
    });
  }, []);

  return (
    <div className="bg-black min-h-screen text-white">
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: {
            background: "#1f2937",
            color: "#f9fafb",
            border: "1px solid #374151",
            padding: "12px 16px",
            fontSize: "0.95rem",
            fontWeight: "500",
            borderRadius: "8px",
          },

          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#ecfdf5",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fee2e2",
            },
          },
        }}
      />

      <RoutingModule />
    </BrowserRouter>
    </div>
  );
};

export default App;
