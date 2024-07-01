import React from "react";
import { Card, Col, Row, Typography, Spin } from "antd";
import { useGetNumbers } from "../../../actions/_user";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell,
} from "recharts";
import AppLayout from "../components/layout";

const { Title, Text } = Typography;

const UserDashboard = () => {
  const { data, loading } = useGetNumbers();

  const attendanceData = data.data || [];

  const processDataForCharts = (data) => {
    return data.map((record) => ({
      date: new Date(record.date).toLocaleDateString(),
      status: record.status === "Present" ? 1 : 0,
      leave: record.status === "Leave" ? 1 : 0,
    }));
  };

  const chartData = processDataForCharts(attendanceData);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { date, status } = payload[0].payload;
      const statusLabel = status === 1 ? "Present" : "Absent";
      return (
        <div className="custom-tooltip">
          <p className="label">{`Date : ${date}`}</p>
          <p className="label">{`Status : ${statusLabel}`}</p>
        </div>
      );
    }

    return null;
  };

  const legendData = [
    { status: 1, label: "Present", color: "#2ecc71" },
    { status: 0, label: "Absent", color: "#e74c3c" },
  ];

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
              This Month's Attendance Statistics
            </Title>
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
                  {data.present}
                </Title>
                <Text className="subtext">Presents</Text>
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
                  {data.absent}
                </Title>
                <Text className="subtext">Absences</Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="attendance-card" bordered={false}>
                <div className="leave-info">
                  <div className="leave-chip">
                    <span>Remaining {7 - data.leave} Out of 7</span>
                  </div>
                  <Title
                    style={{
                      fontSize: "3rem",
                      fontWeight: "bold",
                      marginTop: "0.5rem",
                    }}
                    className="text-statistic"
                  >
                    {data.leave}
                  </Title>
                </div>
                <Text className="subtext">Leaves</Text>
              </Card>
            </Col>
          </Row>

          <Title
            level={3}
            style={{ color: "#1890ff", fontWeight: "bold", marginTop: "20px" }}
          >
            Productivity Level Graph
          </Title>

          <Row gutter={30} className="graph">
            <Col span={12}>
              <Card className="chart-card" bordered={false}>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart
                    margin={{ top: 30, right: 40, left: 20, bottom: 20 }}
                    data={chartData}
                    className="scatter-chart"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="category" dataKey="date" name="Date" />
                    <YAxis
                      name="Status"
                      tickFormatter={(value) =>
                        value === 0 ? "Absent" : "Present"
                      }
                      ticks={[0, 1]}
                    />
                    <Legend
                      verticalAlign="bottom"
                      // wrapperStyle={{ lineHeight: "40px" }}
                      formatter={() => (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 10,
                          }}
                        >
                          {legendData.map((entry, index) => (
                            <span
                              key={`span-${index}`}
                              style={{ marginRight: 10 }}
                            >
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  backgroundColor: entry.color,
                                  marginRight: 5,
                                }}
                              ></span>
                              <span style={{ color: entry.color }}>
                                {entry.label}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter
                      dataKey="status"
                      fill="#1890ff"
                      shape="circle"
                      name="Attendance"
                      line
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.status === 1 ? "#2ecc71" : "#e74c3c"}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col span={12}>
              <Card className="chart-card" bordered={false}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      tickFormatter={(value) =>
                        value === 0 || value === 1 ? value : ""
                      }
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="leave" fill="#1890ff" name="Leaves" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </AppLayout>
  );
};

export default UserDashboard;
