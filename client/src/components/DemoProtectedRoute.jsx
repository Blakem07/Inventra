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
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Starting demo environment</p>
            <p className="text-xs text-muted-foreground">
              This may take a moment while the server wakes up.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
