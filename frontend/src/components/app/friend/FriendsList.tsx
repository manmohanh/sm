import Card from "../../shared/Card";
import IconButton from "../../shared/IconButton";
import SmallButton from "../../shared/SmallButton";

const FriendsList = () => {
  return (
    <div className="grid grid-cols-3 gap-8">
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
              <SmallButton type="danger" icon="user-minus-line">Unfriend</SmallButton>
              <div className="flex gap-3">
                <IconButton icon="chat-ai-line" type="warning"/>
                <IconButton icon="phone-line" type="success"/>
                <IconButton icon="video-on-ai-line" type="danger"/>
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
};

export default FriendsList;
