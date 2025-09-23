import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChatPage from "./pages/Chatpage";
import NextStep from "./pages/NextStep";
import LoginForm from "./components/LoginForm";
import { XMarkIcon } from "@heroicons/react/24/outline";
import RegisterForm from "./components/RegisterForm";
import Navbar from "./components/Navbar"; // Navbar 가져오기

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
  };

  const handleRegisterSuccess = () => {
    setIsRegisterModalOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <Navbar
        isAuthenticated={isAuthenticated}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
        onLogoutClick={handleLogout}
      />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/next-step" element={<NextStep />} />
      </Routes>

      {/* LoginForm 모달 */}
      {isLoginModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div
            className="modal-content relative"
            onClick={(e) => e.stopPropagation()}
          >
            <XMarkIcon
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-3.5 right-3.5 h-6 w-6 bg-neonPink cursor-pointer hover:text-gray-700"
            />

            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}

      {/* RegisterForm 모달 */}
      {isRegisterModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsRegisterModalOpen(false)}
        >
          <div
            className="modal-content relative"
            onClick={(e) => e.stopPropagation()}
          >
            <XMarkIcon
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-3.5 right-3.5 h-6 w-6 bg-neonPink cursor-pointer hover:text-gray-700"
            />
            <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
          </div>
        </div>
      )}
    </>
  );
};

export default App;
