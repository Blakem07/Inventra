import { Spinner } from "@/components/ui/spinner";

export function LoadingItem({ title = "Loading...", details = "", testId = "" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      data-testid={testId}
      className="flex flex-col items-center gap-2 rounded-lg border bg-muted/40 p-3"
    >
      <div className="flex flex-1 flex-col items-center">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span className="text-xs tabular-nums text-muted-foreground">{details}</span>
      </div>

      <div className="flex items-center">
        <Spinner />
      </div>
    </div>
  );
}
