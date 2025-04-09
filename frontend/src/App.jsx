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
const App = () => {
  return (
    <div className="px-12 py-6  bg-black">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/player" element={<Player />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/search-youtube" element={<YoutubeSearch />} />
          <Route path="/favorite" element={<Favorite />} />
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
