import { Route, Routes } from "react-router-dom";
import * as pages from "../utils/pages.js";
import { paths } from "../utils/paths";
import { useAuth } from "../context/auth.jsx";

const App = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="gradient-circle"></div>
      <Routes>
        {/* common pages */}
        <Route path={paths.home} element={<pages.Home />} />

        {/* user pages */}
        <Route path={paths.signup} element={<pages.Signup />} />
        <Route path={paths.login} element={<pages.Login />} />
        {user && user.role === "user" && (
          <Route>
            <Route
              path={paths.userDashboard}
              element={<pages.UserDashboard />}
            />
            <Route
              path={paths.markAttendance}
              element={<pages.MarkAttendance />}
            />
            <Route path={paths.applyLeave} element={<pages.ApplyLeave />} />
            <Route
              path={paths.viewAttendance}
              element={<pages.ViewAttendance />}
            />
            <Route path={paths.userSettings} element={<pages.UserSettings />} />
          </Route>
        )}

        {/* admin pages */}
        <Route path={paths.adminLogin} element={<pages.AdminLogin />} />
        {user && user.role === "admin" && (
          <Route>
            <Route
              path={paths.adminDashboard}
              element={<pages.AdminDashboard />}
            />
            <Route path={paths.approveLeave} element={<pages.ApproveLeave />} />
            <Route path={paths.generateReport} element={<pages.GenerateReport />} />
            <Route
              path={paths.adminSettings}
              element={<pages.AdminSettings />}
            />
          </Route>
        )}
      </Routes>
    </div>
  );
};

export default App;
