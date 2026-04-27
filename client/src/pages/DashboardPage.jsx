import { useEffect, useState } from "react";

import PageHeader from "@/components/PageHeader";
import QuickActions from "../components/QuickActions";
import getDashboardSummary from "../api/dashboard";
import RecentActivityList from "@/components/RecentActivityList";
import StockAlertBanner from "@/components/StockAlertBanner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlusIcon, ReceiptIcon, BarChart3Icon } from "lucide-react";

import { LoadingItem } from "../components/LoadingItem";
import { ErrorItem } from "../components/ErrorItem";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [dashboardSummary, setDashboardSummary] = useState(null);

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
          description="Track inventory status, today’s sales performance, and recent activity in one place."
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
          description="Track inventory status, today’s sales performance, and recent activity in one place."
          testId="dashboard-page-heading"
        />
        <ErrorItem testId="dashboard-page-error" />
      </div>
    );
  }

  const lowStockCount = dashboardSummary?.lowStockCount ?? 0;
  const outOfStockCount = dashboardSummary?.outOfStockCount ?? 0;
  const hasStockAlert = lowStockCount > 0 || outOfStockCount > 0;

  return (
    <div data-testid="dashboard-page" className="space-y-4">
      <PageHeader
        badge="Overview"
        title="Dashboard"
        description="Track inventory status, today’s sales performance, and recent activity in one place."
        testId="dashboard-page-heading"
      />

      <StockAlertBanner lowStockCount={lowStockCount} outOfStockCount={outOfStockCount} />

      <div className="mb-4 flex gap-4">
        <section aria-labelledby="inventory-status-heading" className="flex-1">
          <Card
            className={hasStockAlert ? "h-full border-amber-500/40 shadow-md" : "h-full shadow-md"}
          >
            <CardHeader>
              <h2
                id="inventory-status-heading"
                data-testid="inventory-status-heading"
                className="text-2xl font-semibold leading-none tracking-tight"
              >
                Inventory Status
              </h2>
            </CardHeader>

            <CardContent>
              <p>Low Stock: {lowStockCount}</p>
              <p>Out Of Stock: {outOfStockCount}</p>
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
              <p>Sales Today: {dashboardSummary?.salesCountToday ?? 0}</p>
              <p>Items Sold Today: {dashboardSummary?.itemsSoldToday ?? 0}</p>
              <p>Total Sales Amount: ₱{dashboardSummary?.totalSalesAmountToday ?? 0}</p>
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
                  label: "Restock Product",
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

          <CardContent className="p-0">
            <RecentActivityList activities={dashboardSummary?.recentActivity ?? []} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
