import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { MenuProps as MenuItemProps } from "../../types/sidebar";
import { menu as menuItems } from "../../constants";

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState<string>("");

  useEffect(() => {
    const currentPath = location.pathname;
    const foundItem = menuItems.find((item) => item.path === currentPath);
    if (foundItem) {
      setSelectedKey(foundItem.key.toString());
    }
  }, [location.pathname]);

  const handleSelect = (key: string) => {
    setSelectedKey(key);
  };

  const items = menuItems.map((item: MenuItemProps) => ({
    key: item.key.toString(),
    icon: item.icon,
    label: <Link to={item.path}>{item.name}</Link>,
  }));

  return (
    <Layout.Sider
      className="h-screen fixed top-[11%] left-0 bottom-0 shadow-md"
      breakpoint="lg"
      theme="light"
      collapsible
      collapsed={collapsed}
      trigger={null}
    >
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={({ key }) => handleSelect(key)}
        items={items}
      />
    </Layout.Sider>
  );
};

export default Sidebar;
