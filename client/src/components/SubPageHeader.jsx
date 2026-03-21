import { Badge } from "@/components/ui/badge";

export default function SubPageHeader({ title, description, testId }) {
  return (
    <header className="rounded-xl border bg-card px-6 py-5 text-center shadow-sm">
      <div className="flex flex-col items-center gap-2">
        <h1 data-testid={testId} className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h1>

        {description && <p className="max-w-xl text-sm text-muted-foreground">{description}</p>}
      </div>
    </header>
  );
}
