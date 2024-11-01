import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import SignUp from "./components/Signup";
import Otp from "./components/Otp";
import UploadPodcast from "./pages/UploadPodcast";
import PrivateRoute from "./components/PrivateRoute";
import Player from "./pages/Player";
const App = () => {
  return (
    <div className="px-12 py-6 bg-gray-900">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/player" element={<Player />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/otp" element={<Otp />} />
          <Route element={<PrivateRoute />}>
            <Route path="/uploadpodcast" element={<UploadPodcast />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
