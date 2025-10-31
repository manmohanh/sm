import { Routes, Route, BrowserRouter } from "react-router-dom";
import "animate.css";
import "remixicon/fonts/remixicon.css";
import "font-awesome/css/font-awesome.min.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Layout from "./components/app/Layout";
import Dashboard from "./components/app/Dashboard";
import Post from "./components/app/Post";
import Video from "./components/app/Video";
import Audio from "./components/app/Audio";
import Chat from "./components/app/Chat";
import NotFound from "./components/NotFound";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./guards/PrivateRoute";
import Context from "./Context";
import { useState } from "react";
import RedirectGuard from "./guards/RedirectGuard";
import FriendsList from "./components/app/friend/FriendsList";

function App() {
  const [session, setSession] = useState(null);
  const [liveActiveSession, setLiveActiveSession] = useState(null);
  return (
    <Context.Provider
      value={{ session, setSession, liveActiveSession, setLiveActiveSession }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<RedirectGuard />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/app" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="my-posts" element={<Post />} />
              <Route path="friends" element={<FriendsList />} />
              <Route path="video-chat/:id" element={<Video />} />
              <Route path="audio-chat/:id" element={<Audio />} />
              <Route path="chat/:id" element={<Chat />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
