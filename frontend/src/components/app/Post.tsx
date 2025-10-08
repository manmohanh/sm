import Button from "../shared/Button";
import Card from "../shared/Card";
import Divider from "../shared/Divider";
import IconButton from "../shared/IconButton";

const Post = () => {
  return (
    <div className="space-y-8">
      {Array(20)
        .fill(0)
        .map((item, index) => (
          <Card key={index}>
            <div className="space-y-3">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Accusamus itaque assumenda molestias perferendis labore. Sed quo
                laboriosam officiis labore eligendi perspiciatis illo nostrum
                enim consequuntur, possimus amet doloribus dolor accusamus.
              </p>
              <div className="flex justify-between items-center">
                <label className="text-sm font-normal">
                  Jan 2, 2026 07:00PM
                </label>
                <div className="flex gap-3">
                  <IconButton type="info" icon="edit-line"></IconButton>
                  <IconButton
                    type="danger"
                    icon="delete-bin-4-line"
                  ></IconButton>
                </div>
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
