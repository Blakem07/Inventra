import QuickActions from "../components/QuickActions";

import getDashboardSummary from "../api/dashboard";

import { useEffect, useState } from "react";

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

  return (
    <div data-testid="dashboard-page">
      <h1>Dashboard Page</h1>

      {loading && <span role="alert">Loading...</span>}
      {fetchError && <span role="alert">Error: Fetching Dashboard Summary...</span>}

      <div className="p-8">
        <div className="bg-red-500 text-white p-4 text-3xl font-bold">Tailwind working</div>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <section
          aria-labelledby="stock-alerts-heading"
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            borderRadius: "4px",
            flex: 1,
          }}
        >
          <h2 id="stock-alerts-heading">Stock Alerts</h2>
          <p>Low Stock Items: {dashboardSummary?.lowStockCount}</p>
          <p>Out Of Stock Items: {dashboardSummary?.outOfStockCount}</p>
        </section>

        <section
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            borderRadius: "4px",
            flex: 1,
          }}
        >
          <h2>Today's Summary</h2>
          <p>Sales Today: {dashboardSummary?.salesCountToday}</p>
          <p>Items Sold Today: {dashboardSummary?.itemsSoldToday}</p>
          <p>Total Sales Amount: {dashboardSummary?.totalSalesAmountToday}</p>
        </section>
      </div>

      <section
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "16px",
          borderRadius: "4px",
        }}
      >
        <h2>Quick Action</h2>

        <QuickActions
          actions={[
            { label: "Add Stock", path: "stock/new" },
            { label: "Record Sale", path: "sales/new" },
            { label: "View All", path: "reports" },
          ]}
        />
      </section>

      <section
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "16px",
          borderRadius: "4px",
        }}
      >
        <h2>Recent Activity</h2>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {dashboardSummary?.recentActivity.map((activity) => (
            <li
              key={activity.id}
              style={{
                padding: "6px 0",
                fontSize: "14px",
                borderBottom: "1px solid #eee",
              }}
            >
              <strong>{activity.movementType === "IN" ? "Added Stock:" : "Sold:"}</strong>{" "}
              {activity.product?.name ?? "Unknown Product"} ({Math.abs(activity?.quantityChange)})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const initialValues = {
  summaryDate: "2026-03-10",
  lowStockCount: 3,
  outOfStockCount: 1,
  salesCountToday: 8,
  totalSalesAmountToday: 214.75,
  itemsSoldToday: 17,
  recentActivity: [
    {
      id: "69adafc523e01bf5301d47b2",
      occurredAt: "2026-03-10T09:15:00Z",
      movementType: "OUT",
      quantityChange: -2,
      saleId: "69adafc523e01bf5301d47af",
      performedBy: "Staff A",
      reason: "SALE",
      note: "Customer purchase",
      product: {
        id: "6991b887404ed8cf6c6d0499",
        name: "testProductForSalesFlow",
      },
    },
    {
      id: "69a6c044eb92d21484efab65",
      occurredAt: "2026-03-10T10:02:00Z",
      movementType: "OUT",
      quantityChange: -3,
      saleId: "69adadf123e01bf5301d4790",
      performedBy: "Staff A",
      reason: "SALE",
      note: "Customer purchase",
      product: {
        id: "6991a1cde534a97e330f4cb7",
        name: "testProductTwo",
      },
    },
    {
      id: "69a6c044eb92d21484efab66",
      occurredAt: "2026-03-10T11:20:00Z",
      movementType: "IN",
      quantityChange: 25,
      saleId: null,
      performedBy: "Staff A",
      reason: "RESTOCK",
      note: "Restocked inventory",
      product: {
        id: "6991b887404ed8cf6c6d0499",
        name: "testProductForSalesFlow",
      },
    },
    {
      id: "69adabbb222090f7fa0c3252",
      occurredAt: "2026-03-10T12:05:00Z",
      movementType: "OUT",
      quantityChange: -1,
      saleId: "69adabbb222090f7fa0c324f",
      performedBy: "Staff A",
      reason: "SALE",
      note: "Customer purchase",
      product: {
        id: "6991b887404ed8cf6c6d0499",
        name: "testProductForSalesFlow",
      },
    },
    {
      id: "69adabbb222090f7fa0c3253",
      occurredAt: "2026-03-10T13:10:00Z",
      movementType: "IN",
      quantityChange: 12,
      saleId: null,
      performedBy: "Staff A",
      reason: "RESTOCK",
      note: "Supplier delivery",
      product: {
        id: "6991a1cde534a97e330f4cb7",
        name: "testProductTwo",
      },
    },
  ],
};
