import { createBrowserRouter } from "react-router-dom";

import AppShell from "../components/layout/AppShell";

import DemoAccessPage from "../pages/DemoAccessPage";

import DashboardPage from "../pages/DashboardPage";
import StockMovementCreatePage from "../pages/StockMovementCreatePage";
import SaleCreatePage from "../pages/SaleCreatePage";

import InventoryPage from "../pages/InventoryPage";
import ProductCreatePage from "../pages/ProductCreatePage";
import ProductEditPage from "../pages/ProductEditPage";

import ReportsPage from "../pages/ReportsPage";

import DemoProtectedRoute from "@/components/DemoProtectedRoute";

export const routes = [
  { path: "/demo/access", element: <DemoAccessPage /> },
  {
    path: "/",
    element: (
      <DemoProtectedRoute>
        <AppShell />
      </DemoProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "/stock/new", element: <StockMovementCreatePage /> },
      { path: "/sales/new", element: <SaleCreatePage /> },

      { path: "/inventory", element: <InventoryPage /> },
      { path: "/inventory/new", element: <ProductCreatePage /> },
      { path: "/inventory/:id/edit", element: <ProductEditPage /> },

      { path: "/reports", element: <ReportsPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
