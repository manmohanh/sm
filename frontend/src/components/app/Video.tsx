import { useContext, useRef, useState } from "react";
import CatchError from "../../lib/CatchError";
import Button from "../shared/Button";
import Context from "../../Context";
import { toast } from "react-toastify";

const Video = () => {
  const { session } = useContext(Context);

  const localVideoContainerRef = useRef<HTMLDivElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoContainerRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [isVideoSharing, setIsVideoSharing] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMic, setIsMic] = useState(false);

  const toggleScreen = async () => {
    try {
      const localVideo = localVideoRef.current;
      if (!localVideo) return;

      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        localVideo.srcObject = stream;
        localStreamRef.current = stream;
        setIsScreenSharing(true);
      } else {
        const localStream = localStreamRef.current;
        if (!localStream) return;

        localStream.getTracks().forEach((track) => {
          track.stop();
        });
        localVideo.srcObject = null;
        localStreamRef.current = null;
        setIsScreenSharing(false);
      }
    } catch (error) {
      CatchError(error);
    }
  };

  const toggleVideo = async () => {
    try {
      const localVideo = localVideoRef.current;
      if (!localVideo) return;

      if (!isVideoSharing) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localVideo.srcObject = stream;
        localStreamRef.current = stream;
        setIsVideoSharing(true);
        setIsMic(true)
      } else {
        const localStream = localStreamRef.current;
        if (!localStream) return;

        localStream.getTracks().forEach((track) => {
          track.stop();
        });
        localVideo.srcObject = null;
        localStreamRef.current = null;
        setIsVideoSharing(false);
        setIsMic(false)
      }
    } catch (error) {
      CatchError(error);
    }
  };

  const toggleMic = () => {
    try {
      const localStream = localStreamRef.current;
      if (!localStream) return;

      const audioTrack = localStream
        .getTracks()
        .find((tracks) => tracks.kind === "audio");
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMic(!audioTrack.enabled);
      }
    } catch (error) {
      CatchError(error);
    }
  };

  const toggleFullscreen = (type: "local" | "remote") => {
    if (!isVideoSharing && !isScreenSharing)
      return toast.warn("Please start your video first", {
        position: "top-center",
      });

    const videoContainer =
      type === "local"
        ? localVideoContainerRef.current
        : remoteVideoContainerRef.current;

    if (!videoContainer) return;

    videoContainer.requestFullscreen();

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="space-y-6">
      <div
        ref={remoteVideoContainerRef}
        className="bg-black w-full h-0 relative pb-[56.25%] rounded-xl"
      >
        <video
          ref={remoteVideoRef}
          className="w-full h-full absolute"
          autoPlay
          playsInline
        ></video>
        <button
          className="absolute bottom-2 left-2 bg-white text-xs px-2.5 py-1 rounded-md text-white"
          style={{
            background: "rgba(0,0,0,0.7)",
          }}
        >
          Rahul Kumar
        </button>

        <button
          onClick={() => toggleFullscreen("remote")}
          className="absolute bottom-2 right-2 bg-white text-xs px-2.5 py-1 rounded-md text-white hover:scale-125"
          style={{
            background: "rgba(0,0,0,0.7)",
          }}
        >
          <i className="ri-fullscreen-exit-line"></i>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div
          ref={localVideoContainerRef}
          className="bg-black w-full h-0 relative pb-[56.25%] rounded-xl"
        >
          <video
            ref={localVideoRef}
            className="w-full h-full absolute"
            autoPlay
            playsInline
          ></video>
          <button
            className="absolute bottom-2 left-2 bg-white text-xs px-2.5 py-1 rounded-md text-white capitalize"
            style={{
              background: "rgba(0,0,0,0.7)",
            }}
          >
            {session && session.fullname}
          </button>

          <button
            onClick={() => toggleFullscreen("local")}
            className="absolute bottom-2 right-2 bg-white text-xs px-2.5 py-1 rounded-md text-white hover:scale-125"
            style={{
              background: "rgba(0,0,0,0.7)",
            }}
          >
            <i className="ri-fullscreen-exit-line"></i>
          </button>
        </div>

        <Button icon="user-add-line">Add</Button>
      </div>

      <div className="border-b border-b-gray-200 -mx-5 my-4" />

      <div className="flex justify-between items-center">
        <div className="space-x-4">
          <button
            onClick={toggleMic}
            className="bg-amber-50 text-amber-500 w-12 h-12 rounded-full hover:bg-amber-500 hover:text-white"
          >
            {isMic ? (
              <i className="ri-mic-line"></i>
            ) : (
              <i className="ri-mic-off-line"></i>
            )}
          </button>

          <button
            onClick={toggleVideo}
            className="bg-green-50 text-green-500 w-12 h-12 rounded-full hover:bg-green-500 hover:text-white"
          >
            {isVideoSharing ? (
              <i className="ri-video-on-line"></i>
            ) : (
              <i className="ri-video-off-line"></i>
            )}
          </button>

          <button
            onClick={toggleScreen}
            className="bg-pink-50 text-pink-500 w-12 h-12 rounded-full hover:bg-pink-500 hover:text-white"
          >
            <i className="ri-tv-2-line"></i>
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
