import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useAuthentication } from "../../../actions/_auth";
import { useAuth } from "../../../context/auth";
import { useNavigate } from "react-router-dom";
import { paths } from "../../../utils/paths";

const Login = () => {
  const [form] = Form.useForm();
  const { onFinish, loading } = useAuthentication();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user) {
      navigate(paths.userDashboard);
    }
  });

  return (
    <div className="login-page-container">
      <div className="login-image">
        <div className="login-text-overlay">
          <h1>Welcome Back!</h1>
          <p>Your journey to excellence begins here.</p>
        </div>
        <img src="./src/assets/login.jpg" alt="Login Illustration" />
      </div>
      <div className="login-form-container">
        <div className="login-form-card">
          <h2>Login</h2>
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            className="login-form"
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
    </div>
  );
};

export default Login;
