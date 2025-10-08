import { Routes, Route } from "react-router-dom";
import "animate.css";
import "remixicon/fonts/remixicon.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Layout from "./components/app/Layout";
import Dashboard from "./components/app/Dashboard";
import Post from "./components/app/Post";
import Friends from "./components/app/Friends";
import Video from "./components/app/Video";
import Audio from "./components/app/Audio";
import Chat from "./components/app/Chat";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/app" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="my-posts" element={<Post />} />
        <Route path="friends" element={<Friends />} />
        <Route path="video-chat" element={<Video />} />
        <Route path="audio-chat" element={<Audio />} />
        <Route path="chat" element={<Chat />} />
      </Route>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  );
}

export default App;
