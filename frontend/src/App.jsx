import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Otp from "./components/Otp";
import UploadPodcast from "./pages/UploadPodcast";
import PrivateRoute from "./components/PrivateRoute";
import Player from "./pages/Player";
import Favorite from "./pages/Favorite";
import YoutubeSearch from "./pages/YoutubeSearch";

// 🔐 Admin imports
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

const App = () => {
  return (
    <div className="px-12 py-6 bg-black min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/player" element={<Player />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/search-youtube" element={<YoutubeSearch />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/otp" element={<Otp />} />

          {/* 🔐 Private route for uploading podcast */}
          <Route element={<PrivateRoute />}>
            <Route path="/uploadpodcast" element={<UploadPodcast />} />
          </Route>

          {/* 🔐 Admin login and protected dashboard */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
