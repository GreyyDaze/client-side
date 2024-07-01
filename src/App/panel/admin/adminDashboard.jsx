import React from "react";
import { Card, Col, Row, Typography, Spin, Table, Avatar, Tag } from "antd";

import AppLayout from "../components/layout";
import { useGetAttendanceSummary } from "../../../actions/_admin";
import moment from "moment";

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const { data: attendanceSummary, loading } = useGetAttendanceSummary();

  const attendanceData = attendanceSummary.todayAttendance || [];

  const columns = [
    {
      title: "User Details",
      dataIndex: "userDetails",
      key: "userDetails",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record.profilePic}
            alt="Profile"
            style={{
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              marginRight: "10px",
            }}
          />
          <div>
            <Text strong>{record.userName}</Text>
            <br />
            <Text type="secondary">{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        let color;
        switch (text) {
          case "Present":
            color = "green";
            break;
          case "Leave":
            color = "#faad14"; 
            break;
          case "Absent":
            color = "red";
            break;
          default:
            color = "grey";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => moment(text).format("DD MMM YYYY"),
    },
  ];

  const data = attendanceData?.map((item) => ({
    key: item._id,
    profilePic: item.userId?.profilePic,
    userName: item.userId?.userName,
    email: item.userId?.email,
    status: item.status,
    date: item.date,
  }));

  return (
    <AppLayout>
      {loading ? (
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
        <div className="attendance-statistics">
          <div className="header">
            <Title level={5} style={{ color: "#1890ff", fontWeight: "bold" }}>
              Today's Attendance Overview
            </Title>
            <Text style={{ color: "#7f8c8d", fontSize: "16px" }}>
              Monitor and manage student attendance efficiently
            </Text>
          </div>
          <Row gutter={16}>
            <Col span={8}>
              <Card className="attendance-card" bordered={false}>
                <Title
                  style={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                  }}
                  className="text-statistic"
                >
                  {attendanceSummary.presentCount}
                </Title>
                <Text className="subtext">Students Present</Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="attendance-card" bordered={false}>
                <Title
                  style={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                  }}
                  className="text-statistic"
                >
                  {attendanceSummary.absentCount}
                </Title>
                <Text className="subtext">Students Absent</Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="attendance-card" bordered={false}>
                <div className="leave-info">
                  <Title
                    style={{
                      fontSize: "3rem",
                      fontWeight: "bold",
                    }}
                    className="text-statistic"
                  >
                    {attendanceSummary.pendingLeaveCount}
                  </Title>
                </div>
                <Text className="subtext">Leaves to Approve</Text>
              </Card>
            </Col>
          </Row>

          <Title
            level={3}
            style={{
              color: "#1890ff",
              fontWeight: "bold",
              marginTop: "40px",
              marginBottom: "25px",
            }}
          >
            Today's Attendance Details
          </Title>

          <Table
            dataSource={data}
            columns={columns}
            loading={loading}
            rowKey={(record) => record._id}
            pagination={{ pageSize: 10 }}
            bordered
          />
        </div>
      )}
    </AppLayout>
  );
};

export default AdminDashboard;
