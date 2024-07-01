import { Layout, Button, Space } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import Sidebar from "./sidebar";
import { useAuth } from "../../../../context/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { paths } from "../../../../utils/paths";
import { useEffect } from "react";

const { Header, Content } = Layout;

const AppLayout = ({ children }) => {
  const { logout, user, token } = useAuth();
  const path = user && user.role === "admin" ? "/admin/login" : "/login";

  // useEffect(() => {
  //   console.log
  //   if (!token) {
  //     return <Navigate to={paths.home} />;
  //   }
  // }, [token]);

  const navigate = useNavigate();
  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Sidebar />
      <Layout style={{ background: "#fff" }}>
        <Header className="app-header">
          <Space
            className="header-content"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <h1>Attendance System</h1>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              className="logout-button"
              onClick={() => {
                logout();
                navigate(path);
              }}
            >
              Logout
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: "0 20px" }}>
          <div style={{ padding: 24, minHeight: 360, background: "#fff" }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
