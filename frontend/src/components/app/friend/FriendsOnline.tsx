/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import Card from "../../shared/Card";
import socket from "../../../lib/socket";
import Context from "../../../Context";
import { useNavigate } from "react-router-dom";

const FriendsOnline = () => {
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { session, setLiveActiveSession } = useContext(Context);

  const onlineHandler = (users: any) => {
    setOnlineUsers(users);
  };

  const generateActiveSession = (url: string, user: any) => {
    setLiveActiveSession(user);
    navigate(url);
  };

  useEffect(() => {
    socket.on("online", onlineHandler);
    socket.emit("get-online");

    return () => {
      socket.off("online", onlineHandler);
    };
  }, []);
  return (
    <Card title="Online Friends">
      {session &&
        onlineUsers
          .filter((item: any) => item.id !== session.id)
          .map((item: any, index) => (
            <div key={index} className="flex gap-3">
              <img
                src={item.image || "/images/profile.jpg"}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="space-y-4">
                <h1 className="font-medium capitalize">{item.fullname}</h1>

                <div className="flex gap-3 items-center">
                  <label
                    className={`text-[10px] font-medium 
                 text-green-400 `}
                  >
                    Online
                  </label>
                  <button
                    className="hover:cursor-pointer"
                    onClick={() =>
                      generateActiveSession(`/app/chat/${item.id}`, item)
                    }
                  >
                    <i className="ri-chat-ai-line text-rose-400"></i>
                  </button>
                  <button
                    className="hover:cursor-pointer"
                    onClick={() =>
                      generateActiveSession(`/app/audio-chat/${item.id}`, item)
                    }
                  >
                    <i className="ri-phone-line text-amber-400"></i>
                  </button>
                  <button
                    className="hover:cursor-pointer"
                    onClick={() =>
                      generateActiveSession(`/app/video-chat/${item.id}`, item)
                    }
                  >
                    <i className="ri-video-on-ai-line text-green-400"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
    </Card>
  );
};

export default FriendsOnline;
