import React, { useState } from "react";
import logo from "./../../public/logo.jpeg";
import { AiFillDashboard } from "react-icons/ai";
import { Tooltip } from "primereact/tooltip";
import { MdEventAvailable } from "react-icons/md";
import { Link } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import { useUser } from "../../auth/UserContext";

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const { handleLogout } = useUser();
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className="h-screen w-40 bg-white shadow-md">
      <div className="flex items-center justify-center h-16 border-b">
        <img src={logo} alt="Votechain Logo" className="h-10" />
      </div>
      <nav className="mt-10">
        <ul>
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
              <Tooltip
                target="#dashboard-tooltip"
                content="Dashboard"
                position="right"
              />
            </div>
            <span className="ml-2">Dashboard</span>
          </li>
          <li
            className={`p-4 flex items-center cursor-pointer ${
              activeItem === "Event"
                ? "bg-gray-200"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleItemClick("Event")}
          >
            <div id="createpoll-tooltip" className="flex items-center">
              <Link to="/events" className="flex items-center">
                <MdEventAvailable />
                <span className="ml-2">Event</span>
              </Link>
              <Tooltip
                target="#createpoll-tooltip"
                content="Event"
                position="right"
              />
            </div>
          </li>
          <li
            className={`p-4 flex items-center cursor-pointer ${
              activeItem === "Candidate"
                ? "bg-gray-200"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleItemClick("Candidate")}
          >
            <div id="candidate-tooltip" className="flex items-center">
              <Link to="" className="flex items-center">
                <BsFillPersonFill />
                <span className="ml-2">Candidate</span>
              </Link>
              <Tooltip
                target="#candidate-tooltip"
                content="Candidate"
                position="right"
              />
            </div>
          </li>
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
              <Tooltip
                target="#history-tooltip"
                content="History"
                position="right"
              />
              <span className="ml-2">History</span>
            </div>
          </li>
        </ul>
      </nav>
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
