import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Typography,
  Modal,
  DatePicker,
  Input,
  Space,
  Tag,
  Form,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import AppLayout from "../components/layout";
import {
  useApplyLeave,
  useDeleteLeave,
  useGetLeaves,
  useGetSingleLeave,
  useUpdateLeave,
} from "../../../actions/_user";
import { useAuth } from "../../../context/auth";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const ApplyLeave = () => {
  const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [singleLeave, setSingleLeave] = useState({});
  const { postLeave, loading: applyLeaveLoading } = useApplyLeave();
  const { data, loading: newLeaveLoading } = useGetLeaves();
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [filteredData, setFilteredData] = useState([]);
  const [previousData, setPreviousData] = useState([]);
  const { fetchData, loading: singleLeaveLoading } = useGetSingleLeave();
  const { updateLeave, loading: updateLeaveLoading } = useUpdateLeave();
  const { deleteLeave, loading: deleteLeaveLoading } = useDeleteLeave();
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    const today = moment().startOf("day");

    console.log(today, "today");

    const newLeaves = data.filter((leave) => {
      console.log(leave, "leave");
      console.log(moment(leave.startDate).isSameOrAfter(today), "same");
      return (
        moment(leave.startDate).isSameOrAfter(today) ||
        leave.status === "Pending"
      );
    });

    const previousLeaves = data.filter(
      (leave) =>
        !moment(leave.startDate).isSameOrAfter(today) &&
        leave.status !== "Pending"
    );

    setFilteredData(newLeaves);
    setPreviousData(previousLeaves);
  }, [data]);

  const handleOpenApplyModal = () => {
    setIsApplyModalVisible(true);
  };

  const handleCloseApplyModal = () => {
    form.resetFields();
    setIsApplyModalVisible(false);
  };

  const handleOpenEditModal = async (leaveId) => {
    const data = await fetchData(leaveId);

    console.log(data, "data");

    setSingleLeave(data);

    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    form.resetFields();
    setIsEditModalVisible(false);
  };

  const handleApplyLeave = async () => {
    try {
      const values = await form.validateFields();
      const fromDate = moment(values.dates[0].$d).format("YYYY-MM-DD");
      const toDate = moment(values.dates[1].$d).format("YYYY-MM-DD");

      console.log(fromDate, toDate, "dates");
      const newLeaveRequest = {
        userId: user?._id,
        fromDate,
        toDate,
        reason: values.reason,
      };

      await postLeave(newLeaveRequest);
      handleCloseApplyModal();
    } catch (error) {
      console.error("Failed to apply for leave:", error);
    }
  };

  const handleUpdateLeave = async () => {
    try {
      const values = await form.validateFields();
      const startDate = moment(values.LeaveDates[0].$d).format("YYYY-MM-DD");
      const endDate = moment(values.LeaveDates[1].$d).format("YYYY-MM-DD");

      const updatedLeave = {
        leaveId: singleLeave?._id,
        startDate,
        endDate,
        reason: values.LeaveReason,
      };

      await updateLeave(updatedLeave);
      handleCloseEditModal();
    } catch (error) {
      console.error("Failed to update leave:", error);
    }
  };

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
            loading={selectedLeave == record._id ? updateLeaveLoading : false}
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedLeave(record._id);
              handleOpenEditModal(record._id);
            }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            loading={selectedLeave == record._id ? deleteLeaveLoading : false}
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
          <span className="amazing-text">Request Your Leave Seamlessly</span>
        </Title>
        <div className="leave-actions">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenApplyModal}
            style={{
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
            }}
          >
            Apply for Leave
          </Button>
        </div>
        <Paragraph style={{ color: "grey", marginBottom: "10px" }}>
          New Leave Requests
        </Paragraph>
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
        {/* Apply Leave Modal */}
        <Modal
          title="Apply for Leave"
          open={isApplyModalVisible}
          onCancel={handleCloseApplyModal}
          footer={[
            <Button key="cancel" onClick={handleCloseApplyModal}>
              Cancel
            </Button>,
            <Button
              key="apply"
              type="primary"
              loading={applyLeaveLoading}
              onClick={handleApplyLeave}
            >
              Apply
            </Button>,
          ]}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="dates"
              label="Select Date Range"
              rules={[
                { required: true, message: "Please select the date range!" },
              ]}
            >
              <RangePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="reason"
              label="Reason for Leave"
              rules={[
                {
                  required: true,
                  message: "Please provide a reason for your leave!",
                },
              ]}
            >
              <TextArea rows={4} placeholder="Reason for leave" />
            </Form.Item>
          </Form>
        </Modal>
        {/* Edit Leave Modal */}
        <Modal
          title="Edit Leave Request"
          open={isEditModalVisible}
          onCancel={handleCloseEditModal}
          footer={[
            <Button key="cancel" onClick={handleCloseEditModal}>
              Cancel
            </Button>,
            <Button
              key="update"
              type="primary"
              loading={updateLeaveLoading}
              onClick={handleUpdateLeave}
            >
              Update
            </Button>,
          ]}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="LeaveDates"
              label="Select Date Range"
              rules={[
                { required: true, message: "Please select the date range!" },
              ]}
            >
              <RangePicker
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                placeholder={[
                  moment(singleLeave?.startDate).format("DD/MM/YYYY"),
                  moment(singleLeave?.endDate).format("DD/MM/YYYY"),
                ]}
              />
            </Form.Item>
            <Form.Item
              name="LeaveReason"
              label="Reason for Leave"
              rules={[
                {
                  required: true,
                  message: "Please provide a reason for your leave!",
                },
              ]}
              initialValue={singleLeave?.reason}
            >
              <TextArea rows={4} placeholder="Reason for leave" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default ApplyLeave;
