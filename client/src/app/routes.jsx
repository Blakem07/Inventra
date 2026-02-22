import { createBrowserRouter } from "react-router-dom";

import AppShell from "../components/layout/AppShell";

import DashboardPage from "../pages/DashboardPage";
import StockMovementCreatePage from "../pages/StockMovementCreatePage";
import SaleCreatePage from "../pages/SaleCreatePage";

import InventoryPage from "../pages/InventoryPage";
import ProductCreatePage from "../pages/ProductCreatePage";
import ProductEditPage from "../pages/ProductEditPage";

import ReportsPage from "../pages/ReportsPage";
import SaleEditPage from "../pages/SaleEditPage";

export const routes = [
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "/stock/new", element: <StockMovementCreatePage /> },
      { path: "/sale/new", element: <SaleCreatePage /> },

      { path: "/inventory", element: <InventoryPage /> },
      { path: "/inventory/new", element: <ProductCreatePage /> },
      { path: "/inventory/:id/edit", element: <ProductEditPage /> },

      { path: "/reports", element: <ReportsPage /> },
      { path: "/sales/:id/edit", element: <SaleEditPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
