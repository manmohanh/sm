/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
} from "react";
import socket from "../../lib/socket";
import Avatar from "../shared/Avatar";
import Button from "../shared/Button";
import Form from "../shared/Form";
import Input from "../shared/Input";
import Context from "../../Context";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import Fetcher from "../../lib/Fetcher";
import CatchError from "../../lib/CatchError";
import HttpInterceptor from "../../lib/HttpInterceptor";
import { v4 as uuid } from "uuid";
import Card from "../shared/Card";
import SmallButton from "../shared/SmallButton";
import moment from "moment";

interface MsgReceivedInterface {
  from: string;
  message: string;
}

interface AttachmentUiInterface {
  file: {
    path: string;
    type: string;
  };
}

const AttachmentUi: FC<AttachmentUiInterface> = ({ file }) => {
  if (file.type.startsWith("video/")) {
    return <video className="w-full" controls src={file.path}></video>;
  }

  if (file.type.startsWith("image/")) {
    return <img className="w-full" src={file.path} />;
  }
  return (
    <Card>
      <i className="ri-file-line text-5xl"></i>
    </Card>
  );
};

const Chat = () => {
  const chatContainer = useRef<HTMLDivElement | null>(null);

  const { session } = useContext(Context);
  const { id } = useParams();
  const { data } = useSWR(id ? `/chat/${id}` : null, id ? Fetcher : null);
  const [chats, setChats] = useState<any>([]);

  const messageHandler = (msgRcv: MsgReceivedInterface) => {
    setChats((prev: any) => [...prev, msgRcv]);
  };

  const attachmentHandler = (msgRcv: any) => {
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
    socket.on("attachment", attachmentHandler);

    return () => {
      socket.off("message", messageHandler);
      socket.off("attachment", attachmentHandler);
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

  const fileSharing = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const input = e.target;
      if (!input.files) return;

      const file = input.files[0];
      const url = URL.createObjectURL(file);
      const ext = file.name.split(".").pop();
      const filename = `${uuid()}.${ext}`;
      const path = `chats/${filename}`;
      const payload = {
        path,
        type: file.type,
        status: "private",
      };

      const options = {
        headers: {
          "Content-Type": file.type,
        },
      };

      const { data } = await HttpInterceptor.post("/storage/upload", payload);
      await HttpInterceptor.put(data.url, file, options);

      const remoteMetadata = {
        file: {
          path: path,
          type: file.type,
        },
      };

      const localMetadata = {
        file: {
          path: url,
          type: file.type,
        },
      };

      const attachmentPayload = {
        from: session,
        to: id,
        message: filename,
      };

      setChats((prev: any) => [
        ...prev,
        { ...attachmentPayload, ...localMetadata },
      ]);
      socket.emit("attachment", { ...attachmentPayload, ...remoteMetadata });
    } catch (error) {
      CatchError(error);
    }
  };

  const downloadFile = async (filename: string) => {
    try {
      const path = `chats/${filename}`
      const { data } = await HttpInterceptor.post("/storage/download", {
        path,
      });

      //download a file
      const a = document.createElement("a");
      a.href = data.url;
      a.download = filename;
      a.click();
      a.remove();
    } catch (error) {
      CatchError(error);
    }
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
                <div className="flex flex-col gap-3 relative bg-rose-100 text-rose-400 px-4 py-2 rounded-lg flex-1 border border-rose-100">
                  <h1 className="font-medium text-black capitalize">You</h1>
                  {item.file && <AttachmentUi file={item.file} />}
                  {!item.file && <label>{item.message}</label>}
                  {item.file && (
                    <div>
                      <SmallButton
                        onClick={() => downloadFile(item.message)}
                        icon="download-line"
                        type="danger"
                      >
                        Download
                      </SmallButton>
                    </div>
                  )}
                  <div className="text-gray-500 text-right text-xs">
                    {moment().format("MMM DD, YYYY hh:mm:ss A")}
                  </div>
                  <i className="ri-arrow-left-s-fill absolute top-0 -left-5 text-4xl text-rose-100"></i>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 items-start">
                <div className="relative bg-violet-100 text-violet-500 px-4 py-2 rounded-lg flex-1 border border-violet-100">
                  <h1 className="font-medium text-black capitalize">
                    {item.from.fullname}
                  </h1>
                  {item.file && <AttachmentUi file={item.file} />}
                  {!item.file && <label>{item.message}</label>}
                  {item.file && (
                    <div>
                      <SmallButton
                        onClick={() => downloadFile(item.message)}
                        type="success"
                        icon="download-line"
                      >
                        Download
                      </SmallButton>
                    </div>
                  )}
                  <div className="text-gray-500 text-right text-xs">
                    {moment().format("MMM DD, YYYY hh:mm:ss A")}
                  </div>
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

          <button className="relative w-10 h-10 rounded-full bg-gray-100 hover:bg-slate-200 hover:text-black">
            <i className="ri-attachment-2"></i>
            <input
              onChange={fileSharing}
              type="file"
              className="w-full h-full absolute top-0 left-0 rounded-full opacity-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
