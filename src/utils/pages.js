import AdminLogin from "../App/panel/admin/adminLogin";
import Home from "../App/common/home";
import Signup from "../App/panel/user/signup";
import Login from "../App/panel/user/login";
import AppLayout from "../App/panel/components/layout";
import UserDashboard from "../App/panel/user/userDashboard";
import MarkAttendance from "../App/panel/user/markAttendance";
import ApplyLeave from "../App/panel/user/applyLeave";
import ViewAttendance from "../App/panel/user/viewAttendance";
import UserSettings from "../App/panel/user/userSettings";
import AdminDashboard from "../App/panel/admin/adminDashboard";
import AdminSettings from "../App/panel/admin/adminSettings";
import ApproveLeave from "../App/panel/admin/approveLeave";
import GenerateReport from "../App/panel/admin/generateReport";


export {
  // common pages
  Home,
  AppLayout,

  // user pages
  Signup,
  Login,
  UserDashboard,
  MarkAttendance,
  ApplyLeave,
  ViewAttendance,
  UserSettings,

  // admin pages
  AdminLogin,
  AdminDashboard,
  AdminSettings,
  ApproveLeave,
  GenerateReport,
};
