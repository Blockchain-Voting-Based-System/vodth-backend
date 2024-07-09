import React from "react";
import logo from "./../../auth/logo.png";
import { useUser } from "../../auth/UserContext";

const Sidebar: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="h-screen w-20 bg-white shadow-md text-center">
      <div className="flex items-center justify-center h-16 border-b">
        <img src={logo} alt="Votechain Logo" className="h-16" />
      </div>
      <nav className="mt-4">
      {user && (
          <div className="flex flex-col items-center px-4 py-2">
            <img
              src={
                user.photoURL ??
                "https://avatars.githubusercontent.com/u/109834020?v=4"
              }
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <span className="mt-2 text-sm text-gray-700">
              {user.displayName ?? "N/A"}
            </span>
          </div>
        )}
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
          <li className="p-4 text-gray-700  hover:bg-gray-200">
            <i className="fas fa-history w-6 h-4"></i>
          </li>
          <li className="p-4 text-gray-700 hover:bg-gray-200">
            <i className="fas fa-cog w-6 h-4"></i>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
