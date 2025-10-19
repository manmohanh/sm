import { useEffect } from "react";
import socket from "../../lib/socket";
import Avatar from "../shared/Avatar";
import Button from "../shared/Button";
import Input from "../shared/Input";

const Chat = () => {




  return (
    <div>
      <div className="h-[500px] overflow-auto space-y-12">
        {Array(20)
          .fill(0)
          .map((item, index) => (
            <div className="space-y-12" key={index}>
              <div className="flex gap-3 items-start">
                <Avatar image="/images/profile.jpg" size="md" />
                <div className="relative bg-rose-100 text-rose-400 px-4 py-2 rounded-lg flex-1 border border-rose-100">
                  <h1 className="font-medium text-black">Manmohan</h1>
                  <label>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. A,
                    tenetur?
                  </label>
                  <i className="ri-arrow-left-s-fill absolute top-0 -left-5 text-4xl text-rose-100"></i>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="relative bg-violet-100 text-violet-500 px-4 py-2 rounded-lg flex-1 border border-violet-100">
                  <h1 className="font-medium text-black">Rahul</h1>
                  <label>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. A,
                    tenetur?
                  </label>
                  <i className="ri-arrow-right-s-fill absolute top-0 -right-5 text-4xl text-violet-100"></i>
                </div>
                <Avatar image="/images/profile.jpg" size="md" />
              </div>
            </div>
          ))}
      </div>
      <div className="p-3">
        <div className="flex gap-4 items-center">
        
            <form className="flex gap-4 flex-1">
                <Input name="messaage" placeholder="Type your message"></Input>
                <Button icon="send-plane-fill" type="secondary">Send</Button>
            </form>

            <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-slate-200 hover:text-black">
                <i className="ri-attachment-2"></i>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
