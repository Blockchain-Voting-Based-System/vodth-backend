import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "./../../firebase";
import React from "react";

const ProtectedRoute = ({
  element: Component,
}: {
  element: React.ElementType;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // I

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    // Render a loading indicator or nothing while checking authentication status
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Component /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
