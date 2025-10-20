/* eslint-disable @typescript-eslint/no-explicit-any */

import { useContext, useEffect, useRef, useState } from "react";
import socket from "../../lib/socket";
import Avatar from "../shared/Avatar";
import Button from "../shared/Button";
import Form from "../shared/Form";
import Input from "../shared/Input";
import Context from "../../Context";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import Fetcher from "../../lib/Fetcher";

interface MsgReceivedInterface {
  from: string;
  message: string;
}

const Chat = () => {
  const chatContainer = useRef<HTMLDivElement | null>(null);

  const { session } = useContext(Context);
  const { id } = useParams();
  const { data } = useSWR(id ? `/chat/${id}` : null, id ? Fetcher : null);
  const [chats, setChats] = useState<any>([]);

  const messageHandler = (msgRcv: MsgReceivedInterface) => {
    setChats((prev: any) => [...prev, msgRcv]);
  };

  useEffect(() => {
    const chatDiv = chatContainer.current;
    if (chatDiv) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
  }, [chats]);

  useEffect(() => {
    socket.on("message", messageHandler);

    return () => {
      socket.off("message", messageHandler);
    };
  }, []);

  useEffect(() => {
    if (data) {
      setChats(data);
    }
  }, [data]);

  const sendMessage = (values: any) => {
    const payload = {
      from: session,
      to: id,
      message: values.message,
    };
    setChats((prev: any) => [...prev, payload]);
    socket.emit("message", payload);
  };

  return (
    <div>
      <div className="h-[480px] overflow-auto space-y-12" ref={chatContainer}>
        {chats.map((item: any, index: number) => (
          <div className="space-y-12" key={index}>
            {item.from._id === session.id || item.from.id === session.id ? (
              <div className="flex gap-3 items-start">
                <Avatar
                  image={session.image || "/images/profile.jpg"}
                  size="md"
                />
                <div className="relative bg-rose-100 text-rose-400 px-4 py-2 rounded-lg flex-1 border border-rose-100">
                  <h1 className="font-medium text-black capitalize">You</h1>
                  <label>{item.message}</label>
                  <i className="ri-arrow-left-s-fill absolute top-0 -left-5 text-4xl text-rose-100"></i>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 items-start">
                <div className="relative bg-violet-100 text-violet-500 px-4 py-2 rounded-lg flex-1 border border-violet-100">
                  <h1 className="font-medium text-black capitalize">
                    {item.from.fullname}
                  </h1>
                  <label>{item.message}</label>
                  <i className="ri-arrow-right-s-fill absolute top-0 -right-5 text-4xl text-violet-100"></i>
                </div>
                <Avatar
                  image={item.from.image || "/images/profile.jpg"}
                  size="md"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-3">
        <div className="flex gap-4 items-center">
          <Form className="flex gap-4 flex-1" onValue={sendMessage} reset>
            <Input name="message" placeholder="Type your message"></Input>
            <Button icon="send-plane-fill" type="secondary">
              Send
            </Button>
          </Form>

          <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-slate-200 hover:text-black">
            <i className="ri-attachment-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
