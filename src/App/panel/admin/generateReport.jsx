import React, { useState } from "react";
import AppLayout from "../components/layout";
import {
  Button,
  Typography,
  Table,
  Tag,
  DatePicker,
  Space,
  Modal,
  Form,
  Select,
  Spin,
  notification,
} from "antd";
import moment from "moment";
import {
  useCreateAttendance,
  useDeleteAttendance,
  useGetAllAttendance,
  useGetAllUsers,
  useGetSingleAttendance,
  useSystemReport,
  useUpdateAttendance,
  useUserReport,
} from "../../../actions/_admin";
import toast from "react-hot-toast";
import { PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const GenerateReport = () => {
  const { data: attendance, loading } = useGetAllAttendance();
  const { fetchData, loading: singleAttendanceLoading } =
    useGetSingleAttendance();
  const { updateAttendance, loading: updateAttendanceLoading } =
    useUpdateAttendance();
  const { deleteAttendance, loading: deleteAttendanceLoading } =
    useDeleteAttendance();
  const { data: users, loading: usersLoading } = useGetAllUsers();
  const { generateReport, loading: systemReportLoading } = useSystemReport();
  const { generateUserReport, loading: userReportLoading } = useUserReport();
  const { createAttendance, loading: createAttendanceLoading } =
    useCreateAttendance();

  const [filteredData, setFilteredData] = useState([]);
  const [dates, setDates] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [api, contextHolder] = notification.useNotification();

  const importantSystemToast = () => {
    api["info"]({
      message: "Note",
      description:
        "The System Report is generated for all users and for the current month. If you want to generate for other months, please select the date range.",
    });
  };

  const importantUserToast = () => {
    api["info"]({
      message: "Note",
      description:
        "The User Report is generated for selected users and for the current month. If you want to generate for other months, please select the date range.",
    });
  };

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
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record.key)}>
            Edit
          </Button>
          <Button
            danger
            onClick={() => {
              setSelectedItem(record.key);
              handleDelete(record.key);
            }}
            loading={deleteAttendanceLoading && selectedItem === record.key}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const data = attendance?.map((item) => ({
    key: item._id,
    profilePic: item.userId?.profilePic,
    userName: item.userId?.userName,
    email: item.userId?.email,
    status: item.status,
    date: item.date,
    userId: item.userId?._id,
  }));

  const handleDateChange = (dates) => {
    setDates(dates);
  };

  const handleSearch = () => {
    setSearchLoading(true);
    let filtered = data;

    if (selectedUserIds.length > 0) {
      filtered = filtered.filter((item) =>
        selectedUserIds.includes(item.userId)
      );
    }

    if (dates.length === 2) {
      const [start, end] = dates.map((date) =>
        moment(date.$d).startOf("day").format("YYYY-MM-DD")
      );
      filtered = filtered.filter((item) => {
        const itemDate = moment(item.date).startOf("day").format("YYYY-MM-DD");
        return itemDate >= start && itemDate <= end;
      });
    }

    setSearchLoading(false);
    setFilteredData(filtered);
  };

  const handleEdit = async (id) => {
    const attendanceData = await fetchData(id);
    if (attendanceData) {
      setEditingAttendance(attendanceData);
      setEditModalVisible(true);
    }
  };

  const handleDelete = async (id) => {
    await deleteAttendance(id);
  };

  const handleEditSubmit = async (values) => {
    const { date, status } = values;
    await updateAttendance(editingAttendance._id, status, date);
    setEditModalVisible(false);
  };

  const handleUserSelectChange = (selectedIds) => {
    setSelectedUserIds(selectedIds);
  };

  const handleGenerateSystemReport = () => {
    if (dates == null) {
      importantSystemToast();
      generateReport(null, null);
    } else {
      const startDate = moment(dates[0].$d).format("YYYY-MM-DD");
      const endDate = moment(dates[1].$d).format("YYYY-MM-DD");
      generateReport(startDate, endDate);
    }
  };

  const handleGenerateUserReport = () => {
    if (selectedUserIds.length === 0) {
      toast.error("Please select at least one user.");
      return;
    }

    if (dates.length === 0) {
      importantUserToast();
      generateUserReport(selectedUserIds, null, null);
    } else {
      const startDate = moment(dates[0].$d).format("YYYY-MM-DD");
      const endDate = moment(dates[1].$d).format("YYYY-MM-DD");

      generateUserReport(selectedUserIds, startDate, endDate);
    }
  };

  const handleCreateAttendance = () => {
    setCreateModalVisible(true);
  };

  const handleCreateSubmit = (values) => {
    const { date, status, userId } = values;
    createAttendance(userId, status, date);
    setCreateModalVisible(false);
  };

  return (
    <AppLayout>
      {contextHolder}
      <div style={{ padding: "0px 20px" }}>
        <Title
          level={2}
          style={{
            color: "#1890ff",
            fontWeight: "bold",
            marginTop: "15px",
            marginBottom: "30px",
          }}
        >
          Manage Attendance And Generate Reports
        </Title>

        <div style={{ marginTop: "10px", marginBottom: "20px"  }}>
          <Button
            type="primary"
            onClick={handleCreateAttendance}
            icon={<PlusOutlined />}
          >
            Create Attendance
          </Button>
        </div>

        <div style={{ marginBottom: 16, display: "flex", width: "100%" }}>
          <RangePicker
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            style={{ marginRight: "10px" }}
          />

          <Select
            mode="multiple"
            placeholder="Select users"
            onChange={handleUserSelectChange}
            loading={usersLoading}
            style={{ width: "30%" }}
          >
            {users.map((user) => (
              <Option key={user._id} value={user._id}>
                <div>
                  <span className="fw-bold" style={{ marginRight: "5px" }}>
                    {user.userName}
                  </span>
                  <span>{user.email}</span>
                </div>
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            onClick={handleSearch}
            style={{
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
              marginLeft: "10px",
            }}
            loading={searchLoading}
          >
            Search
          </Button>

          <Button
            type="primary"
            onClick={handleGenerateSystemReport}
            style={{
              backgroundColor: "#facc14",
              borderColor: "#facc14",
              marginLeft: "10px",
            }}
            loading={systemReportLoading}
          >
            Generate System Report
          </Button>

          <Button
            type="primary"
            onClick={handleGenerateUserReport}
            style={{
              backgroundColor: "#d8bff0",
              borderColor: "#d8bff0",
              marginLeft: "10px",
            }}
            loading={userReportLoading}
          >
            Generate User Report
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData.length ? filteredData : data}
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
          style={{ marginTop: "20px" }}
        />

        <Modal
          title="Edit Attendance"
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
        >
          {singleAttendanceLoading ? (
            <Spin />
          ) : (
            <Form
              initialValues={{
                status: editingAttendance?.status,
                date: editingAttendance
                  ? moment(editingAttendance.date)
                  : undefined,
              }}
              onFinish={handleEditSubmit}
            >
              <Form.Item name="date" label="Date">
                <DatePicker
                  format="DD/MM/YYYY"
                  placeholder={
                    editingAttendance
                      ? moment(editingAttendance.date).format("DD/MM/YYYY")
                      : ""
                  }
                />
              </Form.Item>
              <Form.Item name="status" label="Status">
                <Select>
                  <Option value="Present">Present</Option>
                  <Option value="Absent">Absent</Option>
                  <Option value="Leave">Leave</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updateAttendanceLoading}
                >
                  Update
                </Button>
              </Form.Item>
            </Form>
          )}
        </Modal>

        <Modal
          title="Create Attendance"
          open={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          footer={null}
        >
          <Form onFinish={handleCreateSubmit}>
            <Form.Item
              name="userId"
              label="User"
              rules={[{ required: true, message: "Please select a user" }]}
            >
              <Select placeholder="Select a user" loading={usersLoading}>
                {users.map((user) => (
                  <Option key={user._id} value={user._id}>
                    <div>
                      <span className="fw-bold" style={{ marginRight: "5px" }}>
                        {user.userName}
                      </span>
                      <span>{user.email}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select>
                <Option value="Present">Present</Option>
                <Option value="Absent">Absent</Option>
                <Option value="Leave">Leave</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={createAttendanceLoading}
              >
                Add
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default GenerateReport;
