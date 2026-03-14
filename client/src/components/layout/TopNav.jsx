import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

export default function TopNav() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-14 items-center justify-between px-6">
        <span className="font-semibold text-foreground">Inventra</span>

        <nav className="flex gap-2">
          <NavLink to="/">
            <Button variant="ghost">Dashboard</Button>
          </NavLink>

          <NavLink to="/inventory">
            <Button variant="ghost">Inventory</Button>
          </NavLink>

          <NavLink to="/reports">
            <Button variant="ghost">Reports</Button>
          </NavLink>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
