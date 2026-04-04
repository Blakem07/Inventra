import { useEffect, useState } from "react";

import { checkDemoSession } from "@/api/demo";

export default function DemoProtectedRoute({ children }) {
  // null = checking, true = allowed, false = denied
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await checkDemoSession();

        if (res.allowed == true) setIsAuthenticated(true);
      } catch (error) {}
    }
    load();
  }, []);

  if (isAuthenticated) {
    return children;
  }

  return (
    <div>
      <h1>Checking demo access...</h1>
    </div>
  );
}
