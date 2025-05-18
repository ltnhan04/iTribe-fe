import { Outlet, Navigate } from "react-router-dom";
import { useTokenExpired } from "../utils/expired-token";
import Navbar from "../layouts/navbar";
import Sidebar from "../layouts/sidebar";
import { useState, useEffect } from "react";

const PrivateRoutes = () => {
  const tokenExpired = useTokenExpired();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return tokenExpired ? (
    <Navigate to="/login" />
  ) : (
    <div className="flex-1 w-full bg-grayLight">
      <Navbar onToggleSidebar={() => setCollapsed(!collapsed)} />
      <div className="flex gap-5">
        <Sidebar collapsed={collapsed} />
        <div
          className={` flex-1 ${
            collapsed ? "ml-20" : "ml-[200px]"
          }  mt-[5%] px-5 py-3 rounded-lg`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PrivateRoutes;
