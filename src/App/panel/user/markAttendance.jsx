import AppLayout from "../components/layout";
import React, { useEffect, useState } from "react";
import { Card, Button, Typography, Table, Tag, Spin } from "antd";
import moment from "moment";
import {
  useGetLastWeekAttendance,
  useGetProfile,
  useGetTodayAttendance,
  useMarkAttendance,
} from "../../../actions/_user";

const { Title, Text } = Typography;

const MarkAttendance = () => {
  const { postAttendance, loading, isDisabled, setIsDisabled } =
    useMarkAttendance();
  const { status, loading: todayAttendanceLoading } = useGetTodayAttendance(1);
  const { data: user, loading: profileLoading } = useGetProfile();
  const { data: lastWeekAttendance, loading: lastWeekAttendanceLoading } =
    useGetLastWeekAttendance();

  useEffect(() => {
    if (status) setIsDisabled(true);
  }, [status]);

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

  const data = lastWeekAttendance?.map((item) => ({
    key: item._id,
    profilePic: item.userId?.profilePic,
    userName: item.userId?.userName,
    email: item.userId?.email,
    status: item.status,
    date: item.date,
  }));

  return (
    <AppLayout>
      <div
        style={{
          padding: "0px 20px",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        <Title level={3} style={{ color: "#1890ff", fontWeight: "bold" }}>
          Today's Attendance
        </Title>
        <Text style={{ fontSize: "1.1rem", color: "#555" }}>
          Mark your attendance for the day with a single click!
        </Text>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <Card
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                textAlign: "center",
                padding: "15px 20px",
                height: "100%",
              }}
            >
              {profileLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "35vh",
                  }}
                >
                  <Spin size="medium" />
                </div>
              ) : (
                <div>
                  <div className="date-label">
                    <span>{moment().format("DD MMM YYYY")}</span>
                  </div>
                  <div
                    className="user-info"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <div className="profile-picture">
                      <img
                        style={{
                          borderRadius: "50%",
                          border: "2px solid #ddd",
                          padding: "10px",
                          width: "120px",
                          height: "120px",
                        }}
                        src={user?.profilePic}
                        alt="Profile"
                      />
                    </div>
                    <div className="name">
                      <Title level={3} style={{ paddingTop: "10px" }}>
                        {user?.userName}
                      </Title>
                    </div>
                  </div>
                  {todayAttendanceLoading ? (
                    <Spin size="small" />
                  ) : (
                    <Button
                      type="primary"
                      block
                      onClick={() => {
                        postAttendance(user?._id);
                      }}
                      disabled={isDisabled}
                      style={{
                        backgroundColor: isDisabled ? "#aaa" : "#1890ff",
                        borderColor: isDisabled ? "#aaa" : "#1890ff",
                      }}
                      loading={loading}
                    >
                      {isDisabled || status ? "Marked" : "Mark Attendance"}
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </div>

          <div className="col-md-6">
            <Card
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                textAlign: "center",
                padding: "15px 20px",
                height: "100%",
              }}
            >
              <div
                className="attendance-day"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Title
                  level={1}
                  style={{
                    fontSize: "9rem",
                    margin: 0,
                    fontWeight: "bold",
                    color: "#1890ff", 
                  }}
                  className="day-label"
                >
                  {moment().format("D")}
                </Title>
                <Text style={{ color: "#aaa", fontSize: "1.5rem" }}>
                  Attendance Day
                </Text>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "20px",
        }}
      >
        <Title
          level={2}
          style={{ color: "#1890ff", fontWeight: "bold", marginTop: "15px" }}
        >
          Last Seven Days Attendance
        </Title>
        <Table
          columns={columns}
          dataSource={data}
          loading={lastWeekAttendanceLoading}
          pagination={{ pageSize: 5 }}
          bordered
          style={{ marginTop: "20px" }}
        />
      </div>
    </AppLayout>
  );
};

export default MarkAttendance;
