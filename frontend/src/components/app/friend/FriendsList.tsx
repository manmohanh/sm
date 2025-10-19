import { Link } from "react-router-dom";
import Card from "../../shared/Card";
import IconButton from "../../shared/IconButton";
import SmallButton from "../../shared/SmallButton";
import type { FC } from "react";

export interface FriendListInterface {
  gap?: number;
  columns?: number;
}

const FriendsList: FC<FriendListInterface> = ({ gap = 8, columns = 3 }) => {
  return (
    <div className={`grid grid-cols-${columns} gap-${gap}`}>
      {Array(12)
        .fill(0)
        .map((item, index) => (
          <Card>
            <div className="flex flex-col items-center gap-4 mt-3">
              <img
                src="/images/profile.jpg"
                alt="Profile"
                className="rounded-full object-cover w-[80px] h-[80px]"
              />
              <h1>Ravi Kumar</h1>
              <div className="relative">
                <SmallButton type="danger" icon="user-minus-line">
                  Unfriend
                </SmallButton>
                <div className="w-2 h-2 bg-green-400 rounded-full absolute -top-2 -right-2 animate__animated animate__pulse animate__infinite" />
              </div>
              <div className="flex gap-3">
                <Link to={"/app/chat"}>
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
          </Card>
        ))}
    </div>
  );
};

export default FriendsList;
