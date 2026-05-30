import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import DashboardLayout from "../../layouts/DashboardLayout";
import LoginPage from "../../pages/auth/LoginPage";
import RegisterPage from "../../pages/auth/RegisterPage";
import DashboardPage from "../../pages/dashboard/DashboardPage";
import StudentProfilePage from "../../pages/students/StudentProfilePage";
import BehaviorManagementPage from "../../pages/behavior-management/BehaviorManagementPage";
import StudentClusteringPage from "../../pages/clustering/StudentClusteringPage";
import SettingsPage from "../../pages/settings/SettingsPage";
import HelpPage from "../../pages/help/HelpPage";
import { isAuthenticated } from "../../utils/auth";

function RequireAuth() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}

function RedirectIfAuthed() {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

function HomeRedirect() {
  return <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route element={<RedirectIfAuthed />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/students/:id" element={<StudentProfilePage />} />
            <Route
              path="/behavior-management"
              element={<BehaviorManagementPage />}
            />
            <Route path="/clustering" element={<StudentClusteringPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
