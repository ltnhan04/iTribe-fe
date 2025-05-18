/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";

const Dashboard = lazy(() => import("../pages/dashboard"));
const Category = lazy(() => import("../pages/category"));
const Inbox = lazy(() => import("../pages/inbox"));
const Orders = lazy(() => import("../pages/orders"));
//Product Page
const Products = lazy(() => import("../pages/products"));
import AddProduct from "../pages/products/pages/create-product";
import ViewProduct from "../pages/products/pages/view-product";
import CreateVariantPage from "../pages/products/pages/create-variant";

const Users = lazy(() => import("../pages/users"));

import NotFound from "../pages/not-found";
import Loading from "../loading";

import Login from "../pages/auth/login";

const routes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "",
    element: (
      <Suspense fallback={<Loading />}>
        <PrivateRoutes />
      </Suspense>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "inbox", element: <Inbox /> },
      { path: "orders", element: <Orders /> },
      { path: "categories", element: <Category /> },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/create",
        element: <AddProduct />,
      },
      {
        path: "products/:productId/variants/create",
        element: <CreateVariantPage />,
      },
      {
        path: "products/:productId",
        element: <ViewProduct />,
      },

      { path: "users", element: <Users /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
