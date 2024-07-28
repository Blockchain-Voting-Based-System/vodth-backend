import React, { useState } from "react";
import logo from "./../../public/logo.jpeg";
import { AiFillDashboard } from "react-icons/ai";
import { Tooltip } from "primereact/tooltip";
import { MdEventAvailable } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaHistory } from "react-icons/fa";
import { useUser } from "../../auth/UserContext";

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const { handleLogout } = useUser();
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className="h-screen w-40 bg-white shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center h-28 p-4">
          <img src={logo} alt="Votechain Logo" className="h-20" />
        </div>
        <nav className="mt-10">
          <ul>
            <Link to="/">
              <li
                className={`p-4 flex items-center cursor-pointer ${
                  activeItem === "Dashboard"
                    ? "bg-gray-200"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handleItemClick("Dashboard")}
              >
                <div id="dashboard-tooltip" className="flex items-center">
                  <AiFillDashboard />
                  <Tooltip target="#dashboard-tooltip" position="right" />
                </div>
                <span className="ml-2">Dashboard</span>
              </li>
            </Link>
            <Link to="/events/new">
              <li
                className={`p-4 flex items-center cursor-pointer ${
                  activeItem === "Event"
                    ? "bg-gray-200"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handleItemClick("Event")}
              >
                <div id="createpoll-tooltip" className="flex items-center">
                  <MdEventAvailable />
                  <span className="ml-2">Create a Poll</span>
                  <Tooltip target="#createpoll-tooltip" position="right" />
                </div>
              </li>
            </Link>
            <li
              className={`p-4 flex items-center cursor-pointer ${
                activeItem === "History"
                  ? "bg-gray-200"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleItemClick("History")}
            >
              <div id="history-tooltip" className="flex items-center">
                <FaHistory />
                <Tooltip target="#history-tooltip" position="right" />
                <span className="ml-2">History</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="text-red-600 hover:bg-red-100 p-4 w-full flex items-center"
      >
        <i className="fas fa-sign-out-alt"></i>
        <span className="ml-2">Log out</span>
      </button>
    </div>
  );
};

export default Sidebar;
