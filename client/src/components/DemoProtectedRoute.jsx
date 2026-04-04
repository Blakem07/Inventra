import { useEffect, useState } from "react";
import { checkDemoSession } from "@/api/demo";
import { Navigate } from "react-router-dom";

export default function DemoProtectedRoute({ children }) {
  // null = checking, true = allowed, false = denied
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await checkDemoSession();

        if (res.allowed == true) return setIsAuthenticated(true);
        if (res.allowed == false) return setIsAuthenticated(false);
      } catch (error) {
        setIsAuthenticated(false);
      }
    }
    load();
  }, []);

  if (isAuthenticated) {
    return children;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/demo/access" />;
  }

  return (
    <div>
      <h1>Checking demo access...</h1>
    </div>
  );
}
