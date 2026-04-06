import { useEffect, useState } from "react";
import { checkDemoSession } from "@/api/demo";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function DemoProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await checkDemoSession();

        if (res.allowed === true) return setIsAuthenticated(true);
        if (res.allowed === false) return setIsAuthenticated(false);
      } catch {
        setIsAuthenticated(false);
      }
    }
    load();
  }, []);

  if (isAuthenticated) {
    return children;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/demo/access" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[300px]">
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Checking demo access...</p>
        </CardContent>
      </Card>
    </div>
  );
}
