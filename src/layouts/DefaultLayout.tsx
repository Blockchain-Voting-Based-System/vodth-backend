// src/layouts/DefaultLayout.tsx
import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../auth/UserContext";
import Topbar from "../components/Navigation/TopBar";
import Sidebar from "../components/Navigation/Sidebar";
import HomePage from "../pages/HomePage";

const DefaultLayout = () => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
          <HomePage />
          
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
