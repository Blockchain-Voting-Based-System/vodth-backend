// src/components/Topbar.tsx
import React from "react";
import { useUser } from "../../auth/UserContext";

const Topbar: React.FC = () => {
  const { user } = useUser();
  return (
    <div className="border-b flex justify-between items-center h-16 bg-white shadow-md px-6">
      <div className="flex items-center">
        <button className="text-gray-500 focus:outline-none focus:text-gray-600 lg:hidden">
          <i className="fas fa-bars"></i>
        </button>
      </div>
      <div className="flex items-center">
        <button className="text-gray-500 focus:outline-none mx-4">
          <i className="fas fa-search"></i>
        </button>
        <button className="text-gray-500 focus:outline-none mx-4">
          <i className="fas fa-bell"></i>
        </button>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
