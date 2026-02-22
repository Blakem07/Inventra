import { NavLink } from "react-router-dom";

export default function TopNav() {
  return (
    <nav>
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/inventory">Inventory</NavLink>
      <NavLink to="/reports">Reports</NavLink>
    </nav>
  );
}
