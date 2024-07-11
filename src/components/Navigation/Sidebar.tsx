import React from "react";
import logo from "./../../auth/logo.png";
import { useUser } from "../../auth/UserContext";

const Sidebar: React.FC = () => {
  const { handleLogout } = useUser();

  return (
    <div className="h-screen w-20 bg-white shadow-md flex flex-col justify-between text-center">
      <div>
        <div className="flex items-center justify-center h-16 border-b">
          <img src={logo} alt="Votechain Logo" className="h-16" />
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-4 text-gray-700 hover:bg-gray-200">
              <i className="fas fa-tachometer-alt w-6 h-4"></i>
            </li>
            <li className="p-4 text-gray-700 hover:bg-gray-200">
              <i className="fas fa-plus-square w-6 h-4"></i>
            </li>
            <li className="p-4 text-gray-700 hover:bg-gray-200">
              <i className="fas fa-pen-square w-6 h-4"></i>
            </li>
            <li className="p-4 text-gray-700 hover:bg-gray-200">
              <i className="fas fa-history w-6 h-4"></i>
            </li>
            <li className="p-4 text-gray-700 hover:bg-gray-200">
              <i className="fas fa-cog w-6 h-4"></i>
            </li>
          </ul>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="text-red-600 hover:bg-red-100 p-1 rounded mb-4"
      >
        <i className="fas fa-sign-out-alt w-6 h-4"></i>
      </button>
    </div>
  );
};

export default Sidebar;
