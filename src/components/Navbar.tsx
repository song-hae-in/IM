import React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogoutClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  onLoginClick,
  onRegisterClick,
  onLogoutClick,
}) => {
  return (
    <nav className="bg-darkGray text-white py-4 border-vital">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Immserl
        </Link>
        <div>
          <Link to="/" className="mr-4 hover:text-gray-300">
            Home
          </Link>
          <Link to="/chat" className="mr-4 hover:text-gray-300">
            Chat
          </Link>
          {isAuthenticated ? (
            <button onClick={onLogoutClick} className="hover:text-gray-300">
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                className="mr-4 hover:text-gray-300"
              >
                Login
              </button>
              <button onClick={onRegisterClick} className="hover:text-gray-300">
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
