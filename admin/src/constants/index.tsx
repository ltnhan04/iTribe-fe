import {
  DashboardOutlined,
  InboxOutlined,
  ProductOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

export const menu = [
  {
    key: 1,
    name: "Dashboard",
    icon: <DashboardOutlined />,
    path: "/dashboard",
  },
  {
    key: 2,
    name: "Categories",
    icon: <AppstoreOutlined />,
    path: "/categories",
  },
  {
    key: 3,
    name: "Products",
    icon: <ProductOutlined />,
    path: "/products",
  },
  {
    key: 4,
    name: "Users",
    icon: <UserOutlined />,
    path: "users",
  },
  {
    key: 5,
    name: "Orders",
    icon: <ShoppingCartOutlined />,
    path: "/orders",
  },
  {
    key: 6,
    name: "Inbox",
    icon: <InboxOutlined />,
    path: "/inbox",
  },
];

export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
