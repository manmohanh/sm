/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import Card from "../../shared/Card";
import socket from "../../../lib/socket";
import Context from "../../../Context";

const FriendsOnline = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { session } = useContext(Context);

  console.log(onlineUsers);
  const onlineHandler = (users: any) => {
    setOnlineUsers(users);
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
            <div key={index}>
              <img
                src="/images/profile.jpg"
                alt="profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <h1 className="font-medium capitalize">{item.fullname}</h1>
                <label
                  className={`text-[10px] font-medium 
                 text-green-400 `}
                >
                  Online
                </label>
              </div>
            </div>
          ))}
    </Card>
  );
};

export default FriendsOnline;
