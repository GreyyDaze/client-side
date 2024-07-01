import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <div className="container mt-3">
      <div className="row align-items-center">
        <div className="col">
          <div className="gradient-text">Attendance System</div>
        </div>
        <div className="col-auto">
          <Menu mode="horizontal" className="border-bottom shadow-sm z-10 position-relative">
            <Menu.Item key="login">
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="admin">
              <Link to="/admin/login">Admin Login</Link>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
