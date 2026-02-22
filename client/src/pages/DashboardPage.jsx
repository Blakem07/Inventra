import QuickActions from "../components/QuickActions";

export default function DashboardPage() {
  return (
    <div data-testid="dashboard-page">
      <h1>Dashboard Page</h1>
      <QuickActions
        actions={[
          { label: "Add Stock", path: "stock/new" },
          { label: "Record Sale", path: "sale/new" },
          { label: "View All", path: "reports" },
        ]}
      />
    </div>
  );
}
