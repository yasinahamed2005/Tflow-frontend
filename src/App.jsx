import React, { useEffect, useState } from "react";
import { Outlet, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./pages/Dashboard";
import Pendingpage from "./pages/Pendingpage";
import CompletePage from "./pages/CompletePage";
import Profile from "./components/Profile";
const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const handleAuthSubmit = (data) => {
    const user = {
      email: data.email,
      name: data.name || "User",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        data.name || "User"
      )}&background=random`,
    };

    setCurrentUser(user);
    navigate("/", { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  const ProtectedLayout = () => (
    <Layout user={currentUser} onLogout={handleLogout}>
      <Outlet />
    </Layout>
  );

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Login
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/signup")}
            />
          </div>
        }
      />

      {/* SignUp */}
      <Route
        path="/signup"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <SignUp
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/login")}
            />
          </div>
        }
      />

      {/* Protected Routes */}
      <Route
        element={currentUser ? <ProtectedLayout /> : <Navigate to="/login" replace />}
      >
        <Route path="/" element={<Dashboard />} />
        <Route path='/pending' element={<Pendingpage/>}/>
        <Route path='/Complete' element={<CompletePage/>}/>
        <Route path='/profile' element={<Profile user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout}/>}/>

      </Route>

      {/* Catch-all */}
      <Route
        path="*"
        element={<Navigate to={currentUser ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default App;
