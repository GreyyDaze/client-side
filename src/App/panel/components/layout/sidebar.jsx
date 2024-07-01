import { Layout, Menu } from "antd";
import { SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { PiCheckCircleDuotone } from "react-icons/pi";
import { useAuth } from "../../../../context/auth";
import { paths } from "../../../../utils/paths";
import { useNavigate, useLocation } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaRegCalendarCheck, FaRegCalendarTimes } from "react-icons/fa";
import { GrOverview } from "react-icons/gr";
import { TbReport } from "react-icons/tb";

const { Sider } = Layout;

const userMenu = [
  {
    key: "1",
    icon: <LuLayoutDashboard />,
    label: "Dashboard",
    path: paths.userDashboard,
  },
  {
    key: "2",
    icon: <FaRegCalendarCheck />,
    label: "Mark Attendance",
    path: paths.markAttendance,
  },
  {
    key: "3",
    icon: <FaRegCalendarTimes />,
    label: "Apply Leave",
    path: paths.applyLeave,
  },
  {
    key: "4",
    icon: <GrOverview />,
    label: "View Attendance",
    path: paths.viewAttendance,
  },
  {
    key: "5",
    icon: <SettingOutlined />,
    label: "Settings",
    path: paths.userSettings,
  },
  { key: "6", icon: <LogoutOutlined />, label: "Logout", path: paths.login },
];

const adminMenu = [
  {
    key: "1",
    icon: <LuLayoutDashboard />,
    label: "Dashboard",
    path: paths.adminDashboard,
  },
  {
    key: "2",
    icon: <PiCheckCircleDuotone />,
    label: "Approve Leave",
    path: paths.approveLeave,
  },
  {
    key: "3",
    icon: <TbReport />,
    label: "Generate Report",
    path: paths.generateReport,
  },
  {
    key: "4",
    icon: <SettingOutlined />,
    label: "Settings",
    path: paths.adminSettings,
  },
  {
    key: "5",
    icon: <LogoutOutlined />,
    label: "Logout",
    path: paths.adminLogin,
  },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const isAdmin = user && user.role === "admin";
  const navigate = useNavigate();
  const location = useLocation();

  const currentMenu = isAdmin ? adminMenu : userMenu;
  const selectedKey =
    currentMenu.find((item) => item.path === location.pathname)?.key || "1";

  return (
    <Sider
      width={250}
      className="site-layout-background"
      style={{
        minHeight: "100vh",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
      }}
    >
      <div className="logo">
        <h2>{isAdmin ? "Admin Panel" : "User Panel"}</h2>
      </div>
      <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]}>
        {currentMenu.map((item) => {
          return item.label === "Logout" ? (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={() => {
                navigate(item.path, { replace: true });
                logout();
              }}
            >
              {item.label}
            </Menu.Item>
          ) : (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={() => {
                navigate(item.path);
              }}
            >
              {item.label}
            </Menu.Item>
          );
        })}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
