import { AlertCircle } from "lucide-react";

export function ErrorItem({
  title = "Something went wrong",
  details = "Failed to load data",
  testId = "",
}) {
  return (
    <div
      role="alert"
      data-testid={testId}
      className="flex flex-col items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/10 p-3"
    >
      <div className="flex items-center justify-center">
        <AlertCircle className="size-5 text-destructive" />
      </div>

      <div className="flex flex-1 flex-col items-center">
        <span className="text-sm font-medium text-destructive">{title}</span>
        <span className="text-xs text-destructive/80">{details}</span>
      </div>
    </div>
  );
}
