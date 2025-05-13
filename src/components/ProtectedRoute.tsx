import { useState } from "react";
import { Outlet } from "react-router-dom";
import LoginPromptModal from "./LoginPromptModal";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const [showModal] = useState(!token);

  if (!token && showModal) {
    return <LoginPromptModal />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
