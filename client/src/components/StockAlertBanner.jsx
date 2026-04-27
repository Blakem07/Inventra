import { AlertTriangleIcon } from "lucide-react";

/**
 * Displays a dashboard stock warning when products are low on stock or out of stock.
 *
 * @param {Object} props
 * @param {number} [props.lowStockCount=0]
 * @param {number} [props.outOfStockCount=0]
 * @returns {JSX.Element|null}
 */
export default function StockAlertBanner({ lowStockCount = 0, outOfStockCount = 0 }) {
  const hasStockAlert = lowStockCount > 0 || outOfStockCount > 0;

  if (!hasStockAlert) {
    return null;
  }

  const stockAlertMessages = [
    lowStockCount > 0 ? (
      <span key="low-stock">
        {lowStockCount} {lowStockCount === 1 ? "item is" : "items are"}{" "}
        <strong className="italic">low on stock</strong>
      </span>
    ) : null,
    outOfStockCount > 0 ? (
      <span key="out-of-stock">
        {outOfStockCount} {outOfStockCount === 1 ? "item is" : "items are"}{" "}
        <strong className="italic">out of stock</strong>
      </span>
    ) : null,
  ].filter(Boolean);

  return (
    <div
      data-testid="stock-alert-banner"
      className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3"
    >
      <div className="flex items-center gap-2 font-medium">
        <AlertTriangleIcon className="h-4 w-4 text-amber-500" aria-hidden="true" />
        Stock needs attention
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        {stockAlertMessages.map((message, index) => (
          <span key={message.key}>
            {index > 0 && " | "}
            {message}
          </span>
        ))}
      </p>
    </div>
  );
}
