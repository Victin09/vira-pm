import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ResetPassword from "./components/auth/ResetPassword";
import RequestPasswordReset from "./components/auth/RequestPasswordReset";
import Home from "./components/guild/Home";
import Calendar from "./components/calendar/Calendar";
import LandingPage from "./components/landing/LandingPage";
import PrivateRoute from "./components/auth/PrivateRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route
          path="/auth/req/password"
          element={RequestPasswordReset}
        />
        <Route
          path="/auth/reset/password/:token"
          element={ResetPassword}
        />
        <Route path="/app" element={<PrivateRoute />}>
          <Route path="/app" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
