import { Outlet } from "react-router-dom";
import TopNav from "../layout/TopNav";

function AppShell() {
  return (
    <div className="min-h-screen bg-muted/40 dark:bg-background">
      <TopNav />

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;
