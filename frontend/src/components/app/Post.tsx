const env = import.meta.env;
import { useState } from "react";
import Button from "../shared/Button";
import Card from "../shared/Card";
import { Card as AntCard, message, Skeleton } from "antd";
import Divider from "../shared/Divider";
import Editor from "../shared/Editor";
import IconButton from "../shared/IconButton";
import CatchError from "../../lib/CatchError";
import HttpInterceptor from "../../lib/HttpInterceptor";
import { v4 as uuid } from "uuid";
import moment from "moment";
import useSWR, { mutate } from "swr";
import Fetcher from "../../lib/Fetcher";

interface FileDataInterface {
  url: string;
  file: File;
}

const Post = () => {
  const { data, error, isLoading } = useSWR("/post", Fetcher);
  const [value, setValue] = useState("");
  const [fileData, setFileData] = useState<FileDataInterface | null>(null);

  const attachFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.click();

    input.onchange = () => {
      if (!input.files) return;
      const file = input.files[0];
      input.remove();
      const url = URL.createObjectURL(file);
      setFileData({ url, file });
    };
  };

  const createPost = async () => {
    try {
      let path = null;
      if (fileData) {
        const ext = fileData.file.name.split(".").pop();
        const filename = `${uuid()}.${ext}`;
        path = `posts/${filename}`;
        const payload = {
          path,
          type: fileData.file.type,
          status: "public-read",
        };
        const options = {
          headers: {
            "Content-Type": fileData.file.type,
          },
        };
        const { data } = await HttpInterceptor.post("/storage/upload", payload);
        await HttpInterceptor.put(data.url, fileData.file, options);
        message.success("success");
      }
      const formData = {
        attachment: path,
        type: path ? fileData?.file.type : null,
        content: value,
      };
      await HttpInterceptor.post("/post", formData);
      mutate("/post")
      message.success("Post created successfully");
      setFileData(null);
      setValue("");
    } catch (error) {
      CatchError(error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-8">
        {value.length > 0 && (
          <AntCard>
            <div className="space-y-6">
              {fileData && fileData.file.type.startsWith("image/") && (
                <img
                  src={fileData.url}
                  alt="placeholder"
                  className="rounded-lg object-cover w-full"
                />
              )}
              {fileData && fileData.file.type.startsWith("video/") && (
                <video
                  src={fileData.url}
                  className="rounded-lg object-cover w-full"
                  controls
                />
              )}
              <div
                dangerouslySetInnerHTML={{ __html: value }}
                className="hard-reset"
              />
              <label className="text-gray-500">
                {moment().format("MMM DD,hh:mm A")}
              </label>
            </div>
          </AntCard>
        )}

        <Editor value={value} onChange={setValue} />
        <div className="space-x-3">
          <Button type="danger" icon="attachment-line" onClick={attachFile}>
            Attach
          </Button>
          {fileData && (
            <Button
              type="danger"
              icon="loop-left-line"
              onClick={() => setFileData(null)}
            >
              Reset
            </Button>
          )}
          <Button
            type="secondary"
            icon="arrow-right-up-fill"
            onClick={createPost}
          >
            Post
          </Button>
        </div>
      </div>
      {isLoading && <Skeleton active />}
      {error && <h1>{error.message}</h1>}
      {data &&
        data.map((item: any, index: number) => (
          <Card key={index}>
            <div className="space-y-3">
              {item.type?.startsWith("image/") && (
                <img
                  src={`${env.VITE_S3_URL}/${item.attachment}`}
                  alt="placeholder"
                  className="rounded-lg object-cover w-full"
                />
              )}
              {item.type?.startsWith("video/") && (
                <video
                  src={`${env.VITE_S3_URL}/${item.attachment}`}
                  className="rounded-lg object-cover w-full"
                  controls
                />
              )}

              <div
                dangerouslySetInnerHTML={{ __html: item.content }}
                className="hard-reset"
              />
              <div className="flex justify-between items-center">
                <label className="text-sm font-normal">
                  {moment(item.createdAt).format("MMM DD YYY,hh:mm A")}
                </label>
                
              </div>
              <Divider />
              <div className="space-x-4">
                <Button type="secondary" icon="thumb-up-line">
                  20K
                </Button>
                <Button type="warning" icon="thumb-down-line">
                  20K
                </Button>
                <Button type="danger" icon="chat-ai-line">
                  20K
                </Button>
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
};

export default Post;
