import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useLogin } from "../../../actions/_auth";
import { useAuth } from "../../../context/auth";
import { useNavigate } from "react-router-dom";
import { paths } from "../../../utils/paths";

const AdminLogin = () => {
  const [form] = Form.useForm();
  const { onFinish, loading } = useLogin();

  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user) {
      navigate(paths.adminDashboard);
    }
  });

  return (
    <div className="admin-login-page-container">
      <div className="admin-login-form-container">
        <div className="admin-login-form-card">
          <h2>Admin Login</h2>
          <Form
            form={form}
            name="admin_login"
            onFinish={onFinish}
            layout="vertical"
            className="admin-login-form"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input className="custom-input" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password className="custom-input" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="custom-button"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="admin-login-text-container">
        <div className="admin-login-text-overlay">
          <h1>Welcome, Admin!</h1>
          <p>Manage your system efficiently and effectively.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
