import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Renders a list of quick navigation actions.
 *
 * @param {{ actions: Array<{ path: string, label: string, icon?: React.ComponentType<{ className?: string }> }> }}
 * @returns {JSX.Element | null}
 */
export default function QuickActions({ actions = [] }) {
  if (actions.length === 0) return null;

  return (
    <nav aria-label="Quick actions">
      <ul className="flex flex-wrap justify-center gap-3">
        {actions.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <Button variant="outline" className="h-11 gap-2 px-5 text-sm font-medium">
              <NavLink to={path} className="flex items-center">
                {Icon && <Icon className="size-5" aria-hidden="true" />}
                <span>{label}</span>
              </NavLink>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
