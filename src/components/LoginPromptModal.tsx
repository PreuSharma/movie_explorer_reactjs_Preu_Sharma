import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPromptModal = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Login Required</h2>
        <p className="mb-4">You need to login first to access this page.</p>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default LoginPromptModal;
