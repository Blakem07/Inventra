import { NavLink } from "react-router-dom";

/**
 * Enables navigation to pages not featured in the navbar.
 *
 * @param {Array<{ path: string, label: string}>} actions
 *        Array of route descriptors. `path` must be unique and stable.
 *
 * @returns {JSX.Element | null}
 */
export default function QuickActions({ actions }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div>
      {actions.map((action) => (
        <NavLink to={action.path} key={action.path}>
          {action.label}
        </NavLink>
      ))}
    </div>
  );
}
