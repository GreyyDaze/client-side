import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import { Button, Row, Col } from "antd";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div className="container hero-section">
        <Row justify="center" align="middle" className="hero-content">
          <Col xs={24} md={12} className="text-md-left hero-text">
            <p>
              Efficient and reliable attendance tracking for your organization.
            </p>
            <Button
              type="primary"
              size="large"
              className="register-button"
              onClick={() => navigate("/signup")}
            >
              Register
            </Button>
          </Col>
          <Col xs={24} md={12} className="text-center hero-image-container">
            <img
              src="./src/assets/attendance.jpg"
              alt="Attendance System"
              className="hero-image"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default Home;
