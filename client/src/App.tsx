import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import UserProvider from "./context/userContext";

const isTokenValid = () => !!localStorage.getItem("token");

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  if (!isTokenValid()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  if (isTokenValid()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  return (
    <UserProvider>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated ? "/dashboard" : "/login"}
                replace
              />
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
