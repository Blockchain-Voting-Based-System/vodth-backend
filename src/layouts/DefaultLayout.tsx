// src/layouts/DefaultLayout.tsx
import { Outlet } from "react-router-dom";
import Topbar from "../components/Navigation/TopBar";
import Sidebar from "../components/Navigation/Sidebar";

const DefaultLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
