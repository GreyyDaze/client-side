import { Form, Input, Button } from "antd";
import { useSignUp } from "../../../actions/_auth";

const Signup = () => {
  const [form] = Form.useForm();

  const { onFinish, loading } = useSignUp();

  return (
    <div className="container-fluid registration-form-container">
      <div className="registration-form">
        <h2>Sign Up</h2>
        <Form form={form} name="register" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Name"
            name="userName"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
