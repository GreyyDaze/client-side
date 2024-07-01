import React, { useState, useEffect } from "react";
import { Table, Button, Typography, Space, Tag } from "antd";
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import moment from "moment";
import AppLayout from "../components/layout";
import { useApproveLeave, useGetAllLeaves } from "../../../actions/_admin";
import { useDeleteLeave } from "../../../actions/_user";

const { Title, Text } = Typography;

const ApproveLeave = () => {
  const { data, loading: newLeaveLoading } = useGetAllLeaves();
  const [filteredData, setFilteredData] = useState([]);
  const [previousData, setPreviousData] = useState([]);
  const { deleteLeave, loading: deleteLeaveLoading } = useDeleteLeave();
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [status, setStatus] = useState(null);
  const { approveLeave, loading } = useApproveLeave();

  useEffect(() => {
    const today = moment().startOf("day");

    const newLeaves = data.filter((leave) => {
      return (
        moment(leave.endDate).isSameOrAfter(today) || leave.status === "Pending"
      );
    });

    const previousLeaves = data.filter(
      (leave) =>
        moment(leave.endDate).isBefore(today) && leave.status !== "Pending"
    );

    setFilteredData(newLeaves);
    setPreviousData(previousLeaves);
  }, [data]);

  const columns = [
    {
      title: "User Details",
      dataIndex: "userDetails",
      key: "userDetails",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record?.userId?.profilePic}
            alt="Profile"
            style={{
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              marginRight: "10px",
            }}
          />
          <div>
            <Text strong>{record?.userId?.userName}</Text>
            <br />
            <Text type="secondary">{record?.userId?.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => moment(text).format("DD MMM YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => moment(text).format("DD MMM YYYY"),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        let color;
        switch (text) {
          case "Approved":
            color = "green";
            break;
          case "Rejected":
            color = "red";
            break;
          case "Pending":
          default:
            color = "gold";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            loading={
              selectedLeave === record._id && loading && status === "Approved"
            }
            onClick={() => {
              setStatus("Approved");
              setSelectedLeave(record._id);
              approveLeave(record._id, "Approved");
            }}
          />
          <Button
            icon={<CloseOutlined />}
            loading={
              selectedLeave === record._id && loading && status === "Rejected"
            }
            onClick={() => {
              setStatus("Rejected");
              setSelectedLeave(record._id);
              approveLeave(record._id, "Rejected");
            }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            loading={selectedLeave === record._id && deleteLeaveLoading}
            onClick={() => {
              setSelectedLeave(record._id);
              deleteLeave(record._id);
            }}
          />
        </Space>
      ),
    },
  ];

  const previousColumns = columns.filter((col) => col.key !== "action");

  return (
    <AppLayout>
      <div className="leave-container">
        <Title
          level={2}
          style={{
            color: "#1890ff",
            fontWeight: "bold",
            marginTop: "15px",
            marginBottom: "30px",
          }}
        >
          <span className="amazing-text">
            Efficiently Oversee Leave Applications
          </span>
        </Title>

        <Table
          columns={columns}
          dataSource={filteredData}
          loading={newLeaveLoading}
          pagination={{ pageSize: 5 }}
          bordered
        />
        <Title
          level={3}
          style={{
            color: "#1890ff",
            fontWeight: "bold",
            marginTop: "30px",
            marginBottom: "20px",
          }}
        >
          View All Previous Processed Leave Requests
        </Title>
        <Table
          columns={previousColumns}
          dataSource={previousData}
          loading={newLeaveLoading}
          pagination={{ pageSize: 5 }}
          bordered
        />
      </div>
    </AppLayout>
  );
};

export default ApproveLeave;
