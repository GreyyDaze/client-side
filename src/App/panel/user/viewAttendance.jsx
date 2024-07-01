import { useState } from "react";
import { useGetPreviousAttendance } from "../../../actions/_user";
import AppLayout from "../components/layout";
import { Card, Button, Typography, Table, Tag, DatePicker, Space } from "antd";
import moment from "moment";
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const ViewAttendance = () => {
  const { data: previousAttendance, loading } = useGetPreviousAttendance();
  const [filteredData, setFilteredData] = useState([]);
  const [dates, setDates] = useState([]);

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

  const data = previousAttendance?.map((item) => ({
    key: item._id,
    profilePic: item.userId?.profilePic,
    userName: item.userId?.userName,
    email: item.userId?.email,
    status: item.status,
    date: item.date,
  }));

  const handleDateChange = (dates, dateStrings) => {
    setDates(dates);
  };

  const handleSearch = () => {
    if (dates.length === 2) {
      const [start, end] = dates.map((date) => {
        // console.log(date.$d, "date1");
        return moment(date.$d).startOf("day").format("YYYY-MM-DD");
      });
      const filtered = data.filter((item) => {
        const itemDate = moment(item.date).startOf("day").format("YYYY-MM-DD");
        // console.log(itemDate, "itemDate");
        // console.log(start, "start");
        // console.log(end, "end");
        // console.log(itemDate >= start && itemDate <= end, "filtered");
        return itemDate >= start && itemDate <= end;
      });
      // console.log(filtered, "filtered");
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  return (
    <AppLayout>
      <div
        style={{
          padding: "0px 20px",
        }}
      >
        <Title
          level={2}
          style={{
            color: "#1890ff",
            fontWeight: "bold",
            marginTop: "15px",
            marginBottom: "30px",
          }}
        >
          View Your Previous Attendance Status
        </Title>

        <Space style={{ marginBottom: 16 }}>
          <RangePicker
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
          />
          <Button
            type="primary"
            onClick={handleSearch}
            style={{
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
              marginLeft: "10px",
            }}
          >
            Search
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredData.length ? filteredData : data}
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
          style={{ marginTop: "20px" }}
        />
      </div>
    </AppLayout>
  );
};

export default ViewAttendance;
