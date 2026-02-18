import { Outlet } from "react-router-dom";
import TopNav from "../layout/TopNav";

function AppShell() {
  return (
    <>
      <TopNav />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default AppShell;
