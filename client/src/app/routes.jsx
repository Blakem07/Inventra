import { createBrowserRouter } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import DashboardPage from "../pages/DashboardPage";
import InventoryPage from "../pages/InventoryPage";
import ReportsPage from "../pages/ReportsPage";

import StockMovementCreatePage from "../pages/StockMovementCreatePage";
import SaleCreatePage from "../pages/SaleCreatePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "/inventory", element: <InventoryPage /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/stock/new", element: <StockMovementCreatePage /> },
      { path: "/sale/new", element: <SaleCreatePage /> },
    ],
  },
]);
