// src/components/Topbar.tsx
import React from "react";
import { useUser } from "../../auth/UserContext";

const Topbar: React.FC = () => {
  const { handleLogout } = useUser();
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

        <button
          onClick={handleLogout}
          className="text-red-600 hover:bg-red-100 p-1 rounded"
        >
          <i className="fas fa-sign-out-alt w-6 h-4"></i>
        </button>
      </div>
    </div>
  );
};

export default Topbar;
