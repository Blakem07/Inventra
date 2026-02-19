import { NavLink } from "react-router-dom";

/**
 * Enables navigation to pages not featured in the navbar.
 */
export default function QuickActions({ actions }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div>
      {actions.map((action) => (
        <NavLink to={action.path}>{action.label}</NavLink>
      ))}
    </div>
  );
}
