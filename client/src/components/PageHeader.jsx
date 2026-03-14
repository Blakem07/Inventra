import { Badge } from "@/components/ui/badge";

export default function PageHeader({ badge, title, description, testId }) {
  return (
    <header className="relative overflow-hidden rounded-2xl border bg-card px-6 py-6 shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary/80" />

      {badge && (
        <Badge
          variant="secondary"
          className="absolute left-6 top-4 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em]"
        >
          {badge}
        </Badge>
      )}

      <div className="flex flex-col items-center gap-2 text-center">
        <h1 data-testid={testId} className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
        )}
      </div>
    </header>
  );
}
