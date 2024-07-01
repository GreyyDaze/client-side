import AppLayout from "../components/layout";
import { useEffect, useState } from "react";
import { Card, Upload, Button, Input, Form, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/auth";
import axios from "axios";
import { useGetAdminProfile } from "../../../actions/_admin";

const AdminSettings = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data, loading: profileLoading } = useGetAdminProfile();
  const { token, user } = useAuth();

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    return isJpgOrPng;
  };

  const handleUpload = async ({ file }) => {
    try {
      setLoading(true);
      const base64Image = await getBase64(file);
      const response = await axios.post(
        "http://localhost:3000/api/admin/edit-profile-picture",
        {
          adminId: user._id,
          profilePicture: base64Image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfilePic(response.data.profilePicture);
      setLoading(false);
      message.success(`${file.name} image uploaded successfully`);
    } catch (error) {
      setLoading(false);
      message.error(`${file.name} image upload failed.`);
    }
  };

  useEffect(() => {
    if (token) {
      if (data?.profilePic) {
        setProfilePic(data?.profilePic);
      }
    }
  }, [data, token]);

  return (
    <AppLayout>
      {profileLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center">
          <Card
            style={{ width: 400, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            className="text-center px-4"
          >
            <div className="profile-picture-container">
              <div className="profile-picture">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="img-fluid rounded-circle mb-3"
                    style={{ width: 150, height: 150 }}
                  />
                ) : (
                  <div
                    className="img-placeholder rounded-circle mb-3"
                    style={{ width: 150, height: 150, background: "#e9ecef" }}
                  >
                    <span className="placeholder-text">Profile Picture</span>
                  </div>
                )}
              </div>
            </div>
            <Upload
              name="profilePicture"
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={handleUpload}
            >
              <Button icon={<UploadOutlined />} loading={loading}>
                Change Profile Picture
              </Button>
            </Upload>
            <Form layout="vertical" className="mt-3">
              <Form.Item label="Name">
                <Input value={data?.userName} disabled />
              </Form.Item>
              <Form.Item label="Email">
                <Input value={data?.email} disabled />
              </Form.Item>
            </Form>
          </Card>
        </div>
      )}
    </AppLayout>
  );
};
export default AdminSettings;
