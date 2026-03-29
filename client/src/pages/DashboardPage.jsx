import { useEffect, useState } from "react";

import PageHeader from "@/components/PageHeader";
import QuickActions from "../components/QuickActions";
import getDashboardSummary from "../api/dashboard";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlusIcon, ReceiptIcon, BarChart3Icon } from "lucide-react";

import { LoadingItem } from "../components/LoadingItem";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [dashboardSummary, setDashboardSummary] = useState();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setFetchError(false);

      try {
        const dashboardData = await getDashboardSummary();

        if (!dashboardData || typeof dashboardData !== "object" || Array.isArray(dashboardData)) {
          throw new Error("Invalid Data Shape");
        }

        setDashboardSummary(dashboardData);
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div data-testid="dashboard-page" className="space-y-4">
        <PageHeader
          badge="Overview"
          title="Dashboard"
          description="Track low stock alerts, today’s sales performance, and recent activity in one place."
          testId="dashboard-page-heading"
        />
        <LoadingItem testId="dashboard-page-loading" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div data-testid="dashboard-page" className="space-y-4">
        <PageHeader
          badge="Overview"
          title="Dashboard"
          description="Track low stock alerts, today’s sales performance, and recent activity in one place."
          testId="dashboard-page-heading"
        />
        <span role="alert" data-testid="dashboard-page-error">
          Error: Fetching Dashboard Summary...
        </span>
      </div>
    );
  }

  return (
    <div data-testid="dashboard-page" className="space-y-4">
      <PageHeader
        badge="Overview"
        title="Dashboard"
        description="Track low stock alerts, today’s sales performance, and recent activity in one place."
        testId="dashboard-page-heading"
      />

      {loading && (
        <span role="alert" data-testid="dashboard-page-loading">
          Loading...
        </span>
      )}

      {fetchError && (
        <span role="alert" data-testid="dashboard-page-error">
          Error: Fetching Dashboard Summary...
        </span>
      )}

      <div className="mb-4 flex gap-4">
        <section aria-labelledby="stock-alerts-heading" className="flex-1">
          <Card className="h-full shadow-md">
            <CardHeader>
              <h2
                id="stock-alerts-heading"
                data-testid="stock-alerts-heading"
                className="text-2xl font-semibold leading-none tracking-tight"
              >
                Stock Alerts
              </h2>
            </CardHeader>

            <CardContent>
              <p>Low Stock Items: {dashboardSummary?.lowStockCount}</p>
              <p>Out Of Stock Items: {dashboardSummary?.outOfStockCount}</p>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="today-summary-heading" className="flex-1">
          <Card className="h-full shadow-md">
            <CardHeader>
              <h2
                id="today-summary-heading"
                data-testid="today-summary-heading"
                className="text-2xl font-semibold leading-none tracking-tight"
              >
                Today's Summary
              </h2>
            </CardHeader>

            <CardContent>
              <p>Sales Today: {dashboardSummary?.salesCountToday}</p>
              <p>Items Sold Today: {dashboardSummary?.itemsSoldToday}</p>
              <p>Total Sales Amount: ₱{dashboardSummary?.totalSalesAmountToday}</p>
            </CardContent>
          </Card>
        </section>
      </div>
      <section aria-labelledby="quick-action-heading" className="mb-4">
        <Card className="shadow-md">
          <CardHeader>
            <h2
              id="quick-action-heading"
              data-testid="quick-action-heading"
              className="text-2xl font-semibold leading-none tracking-tight"
            >
              Quick Action
            </h2>
          </CardHeader>

          <CardContent>
            <QuickActions
              actions={[
                {
                  label: "Add Stock",
                  path: "stock/new",
                  icon: PlusIcon,
                },
                {
                  label: "Record Sale",
                  path: "sales/new",
                  icon: ReceiptIcon,
                },
                {
                  label: "View All",
                  path: "reports",
                  icon: BarChart3Icon,
                },
              ]}
            />
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="recent-activity-heading" className="mb-4">
        <Card className="shadow-md">
          <CardHeader>
            <h2
              id="recent-activity-heading"
              data-testid="recent-activity-heading"
              className="text-2xl font-semibold leading-none tracking-tight"
            >
              Recent Activity
            </h2>
          </CardHeader>

          <CardContent>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {dashboardSummary?.recentActivity?.map((activity) => (
                <li key={activity.id} className="border-b border-border py-1.5 text-sm">
                  <strong>{activity.movementType === "IN" ? "Added Stock:" : "Sold:"}</strong>{" "}
                  {activity.product?.name ?? "Unknown Product"} (
                  {Math.abs(activity?.quantityChange)})
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
