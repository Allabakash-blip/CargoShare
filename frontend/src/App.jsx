import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import ActivityLogs from "./pages/ActivityLogs";
import Users from "./pages/Users";
import Bookings from "./pages/Bookings";
import Tracking from "./pages/Tracking";
import Containers from "./pages/Containers";
import Logistics from "./pages/Logistics";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";

import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Landing />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />

          <Route
            path="activity-logs"
            element={<ActivityLogs />}
          />

          <Route
            path="users"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="bookings"
            element={<Bookings />}
          />

          <Route
            path="tracking"
            element={<Tracking />}
          />

          <Route
            path="containers"
            element={<Containers />}
          />

          <Route
            path="logistics"
            element={<Logistics />}
          />

          <Route
            path="payments"
            element={<Payments />}
          />

          <Route
            path="notifications"
            element={<Notifications />}
          />
          <Route
  path="chat"
  element={
    <ProtectedRoute roles={["Trader", "Logistics"]}>
      <Chat />
    </ProtectedRoute>
  }
/>
          <Route
  path="profile"
  element={<Profile />}
/>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;