import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";

import LoginPage from "scenes/login";
import RequireAuth from "components/Auth/RequireAuth";
import UnProtectedRoute from "components/Auth/UnprotectedRoute";

import DashboardPage from "scenes/Dashboard";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <UnProtectedRoute>
            <LoginPage />
          </UnProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
