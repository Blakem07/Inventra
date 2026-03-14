import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

export default function TopNav() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-14 items-center justify-between px-6">
        <span className="font-semibold text-foreground">Inventra</span>

        <nav className="flex gap-2">
          <Button asChild variant="ghost">
            <NavLink to="/">Dashboard</NavLink>
          </Button>

          <Button asChild variant="ghost">
            <NavLink to="/inventory">Inventory</NavLink>
          </Button>

          <Button asChild variant="ghost">
            <NavLink to="/reports">Reports</NavLink>
          </Button>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
