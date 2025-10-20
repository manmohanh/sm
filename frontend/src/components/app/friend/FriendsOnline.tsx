/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import Card from "../../shared/Card";
import socket from "../../../lib/socket";
import Context from "../../../Context";
import { Link } from "react-router-dom";
import IconButton from "../../shared/IconButton";

const FriendsOnline = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { session } = useContext(Context);

  const onlineHandler = (users: any) => {
    setOnlineUsers(users);
  };

  useEffect(() => {
    socket.on("online", onlineHandler);
    socket.emit("get-online");

    return ()=>{
      socket.off("online",onlineHandler)
    }
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
                  <Link to={`/app/chat/${item.id}`}>
                    <IconButton icon="chat-ai-line" type="warning" />
                  </Link>
                  <Link to={"/app/audio-chat"}>
                    <IconButton icon="phone-line" type="success" />
                  </Link>
                  <Link to={"/app/video-chat"}>
                    <IconButton icon="video-on-ai-line" type="danger" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
    </Card>
  );
};

export default FriendsOnline;
