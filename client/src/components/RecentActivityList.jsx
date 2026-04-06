/**
 * Renders a list of recent stock activity items.
 *
 * @param {{
 *   activities?: Array<{
 *     id: string|number,
 *     quantityChange: number,
 *     movementType: string,
 *     reason?: string,
 *     product?: { name?: string }
 *   }>
 * }} props
 * @returns {JSX.Element}
 */
function RecentActivityList({ activities }) {
  if (!activities?.length) {
    return (
      <ul className="flex flex-col">
        <li className="px-3 py-2 text-sm text-muted-foreground">No recent activity</li>
      </ul>
    );
  }

  return (
    <ul className="flex flex-col">
      {activities.map((activity) => {
        const label = activity.product?.name || "Unknown Product";
        const qty = activity.quantityChange;
        let subtitle = "Stock Activity";
        let badge = qty;
        let badgeClass = "text-muted-foreground border-border";

        if (activity.movementType === "IN") {
          subtitle = "Stock In";
          badge = `IN ${Math.abs(qty)}`;
          badgeClass = "text-emerald-500 border-emerald-500/30";
        }

        if (activity.movementType === "OUT") {
          subtitle = "Sale";
          badge = `SOLD ${Math.abs(qty)}`;
          badgeClass = "text-amber-500 border-amber-500/30";
        }

        if (activity.movementType === "ADJUST") {
          subtitle = activity.reason || "Adjustment";
          badge = qty > 0 ? `+${qty}` : qty;
          badgeClass = "text-blue-500 border-blue-500/30";
        }

        return (
          <li
            key={activity.id}
            className="flex items-center justify-between border-b px-3 py-2 text-sm last:border-0"
          >
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{label}</span>
              <span className="text-left text-xs text-muted-foreground">{subtitle}</span>
            </div>

            <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass}`}>
              {badge}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default RecentActivityList;
