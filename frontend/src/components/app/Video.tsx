import Button from "../shared/Button";

const Video = () => {
  return (
    <div className="space-y-6">
      <div className="bg-black w-full h-0 relative pb-[56.25%] rounded-xl">
        <video className="w-full h-full absolute"></video>
        <button
          className="absolute bottom-2 left-2 bg-white text-xs px-2.5 py-1 rounded-md text-white"
          style={{
            background: "rgba(255,255,255,0.1)",
          }}
        >
          Rahul Kumar
        </button>

                <button
          className="absolute bottom-2 right-2 bg-white text-xs px-2.5 py-1 rounded-md text-white hover:scale-125"
          style={{
            background: "rgba(255,255,255,0.1)",
          }}
        >
          <i className="ri-fullscreen-exit-line"></i>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black w-full h-0 relative pb-[56.25%] rounded-xl">
          <video className="w-full h-full absolute"></video>
          <button
            className="absolute bottom-5 left-5 bg-white text-xs px-2.5 py-1 rounded-md text-white"
            style={{
              background: "rgba(255,255,255,0.1)",
            }}
          >
            Rahul Kumar
          </button>
          
        </div>

        <Button icon="user-add-line">Add</Button>

        
      </div>

      <div className="border-b border-b-gray-200 -mx-5 my-4"/>

      <div className="flex justify-between items-center">
        <div className="space-x-4">
          <button className="bg-amber-50 text-amber-500 w-12 h-12 rounded-full hover:bg-amber-500 hover:text-white">
            <i className="ri-mic-line"></i>
          </button>

          <button className="bg-green-50 text-green-500 w-12 h-12 rounded-full hover:bg-green-500 hover:text-white">
            <i className="ri-video-on-line"></i>
          </button>

          <button className="bg-pink-50 text-pink-500 w-12 h-12 rounded-full hover:bg-pink-500 hover:text-white">
            <i className="ri-tv-2-line"></i>
          </button>

          <button className="bg-amber-50 text-amber-500 w-12 h-12 rounded-full hover:bg-amber-500 hover:text-white">
            <i className="ri-mic-line"></i>
          </button>

          <button className="bg-amber-50 text-amber-500 w-12 h-12 rounded-full hover:bg-amber-500 hover:text-white">
            <i className="ri-mic-line"></i>
          </button>
        </div>
        <Button icon="close-circle-fill" type="danger">
          End
        </Button>
      </div>
    </div>
  );
};

export default Video;
