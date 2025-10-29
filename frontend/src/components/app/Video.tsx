import { useContext, useEffect, useRef, useState, useCallback } from "react";
import CatchError from "../../lib/CatchError";
import Button from "../shared/Button";
import Context from "../../Context";
import { toast } from "react-toastify";
import socket from "../../lib/socket";
import { useParams } from "react-router-dom";
import { notification } from "antd";
import "@ant-design/v5-patch-for-react-19";

const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

interface OnOfferInterface {
  offer: RTCSessionDescriptionInit;
  from: string;
}

interface OnAnswerInterface {
  answer: RTCSessionDescriptionInit;
  from: string;
}

interface OnCandidateInterface {
  candidate: RTCIceCandidateInit;
  from: string;
}

type CallType = "pending" | "calling" | "incoming" | "talking" | "end";

const Video = () => {
  const { session } = useContext(Context);
  const { id } = useParams();
  const [notify, notifyUi] = notification.useNotification();

  const localVideoContainerRef = useRef<HTMLDivElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoContainerRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const rtc = useRef<RTCPeerConnection | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const [isVideoSharing, setIsVideoSharing] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [status, setStatus] = useState<CallType>("pending");

  const toggleScreen = async () => {
    try {
      const localVideo = localVideoRef.current;
      if (!localVideo || !rtc.current) return;

      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        const videoTrack = stream.getVideoTracks()[0];
        const sender = rtc.current
          .getSenders()
          .find((s) => s.track?.kind === "video");

        if (sender) {
          await sender.replaceTrack(videoTrack);
        }

        // Stop previous video track
        const oldStream = localStreamRef.current;
        if (oldStream) {
          oldStream.getVideoTracks().forEach((track) => track.stop());
        }

        // Combine audio from old stream with new video
        const audioTracks = oldStream?.getAudioTracks() || [];
        const newStream = new MediaStream([videoTrack, ...audioTracks]);

        localVideo.srcObject = newStream;
        localStreamRef.current = newStream;
        setIsScreenSharing(true);

        // Handle screen share stop
        videoTrack.onended = () => {
          setIsScreenSharing(false);
          if (isVideoSharing) {
            toggleVideo(); // Switch back to camera
          }
        };
      } else {
        // Switch back to camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        const videoTrack = stream.getVideoTracks()[0];
        const sender = rtc.current
          .getSenders()
          .find((s) => s.track?.kind === "video");

        if (sender) {
          await sender.replaceTrack(videoTrack);
        }

        // Stop screen share track
        const oldStream = localStreamRef.current;
        if (oldStream) {
          oldStream.getVideoTracks().forEach((track) => track.stop());
        }

        localVideo.srcObject = stream;
        localStreamRef.current = stream;
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
        setIsMicMuted(false);
      } else {
        const localStream = localStreamRef.current;
        if (!localStream) return;

        localStream.getTracks().forEach((track) => {
          track.stop();
        });
        localVideo.srcObject = null;
        localStreamRef.current = null;
        setIsVideoSharing(false);
        setIsMicMuted(false);
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
        .find((track) => track.kind === "audio");
      
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
      }
    } catch (error) {
      CatchError(error);
    }
  };

  const toggleFullscreen = (type: "local" | "remote") => {
    if (!isVideoSharing && !isScreenSharing) {
      return toast.warn("Please start your video first", {
        position: "top-center",
      });
    }

    const videoContainer =
      type === "local"
        ? localVideoContainerRef.current
        : remoteVideoContainerRef.current;

    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const createPeerConnection = useCallback(() => {
    if (rtc.current) {
      rtc.current.close();
    }

    rtc.current = new RTCPeerConnection(config);

    const localStream = localStreamRef.current;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        rtc.current?.addTrack(track, localStream);
      });
    }

    rtc.current.onicecandidate = (e) => {
      if (e.candidate && id) {
        socket.emit("candidate", { candidate: e.candidate, to: id });
      }
    };

    rtc.current.onconnectionstatechange = () => {
      console.log("Connection state:", rtc.current?.connectionState);
      
      if (rtc.current?.connectionState === "connected") {
        setStatus("talking");
        notify.destroy();
        if (audio.current) {
          audio.current.pause();
        }
      } else if (
        rtc.current?.connectionState === "disconnected" ||
        rtc.current?.connectionState === "failed"
      ) {
        setStatus("end");
        endCall();
      }
    };

    rtc.current.ontrack = (event) => {
      console.log("Receiving remote stream");
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return rtc.current;
  }, [id]);

  const addPendingCandidates = useCallback(async () => {
    if (!rtc.current || rtc.current.remoteDescription === null) return;

    while (pendingCandidatesRef.current.length > 0) {
      const candidateInit = pendingCandidatesRef.current.shift();
      if (candidateInit) {
        try {
          const candidate = new RTCIceCandidate(candidateInit);
          await rtc.current.addIceCandidate(candidate);
        } catch (error) {
          console.error("Error adding pending candidate:", error);
        }
      }
    }
  }, []);

  const startCall = async () => {
    try {
      if (!isVideoSharing) {
        return toast.warn("Start your video", { position: "top-center" });
      }

      createPeerConnection();

      if (!rtc.current) return;

      const offer = await rtc.current.createOffer();
      await rtc.current.setLocalDescription(offer);
      setStatus("calling");
      
      notify.open({
        key: "call-notification",
        message: "Calling",
        description: "Waiting for response...",
        duration: 0,
        placement: "bottomRight",
        actions: [
          <button
            key="end"
            onClick={endCall}
            className="bg-rose-400 px-3 py-2 rounded text-white hover:bg-rose-500"
          >
            End call
          </button>,
        ],
      });

      socket.emit("offer", {
        offer,
        to: id,
      });
    } catch (error) {
      CatchError(error);
    }
  };

  const accept = async (payload: OnOfferInterface) => {
    try {
      createPeerConnection();

      if (!rtc.current) return;

      const offer = new RTCSessionDescription(payload.offer);
      await rtc.current.setRemoteDescription(offer);
      
      // Add any pending candidates
      await addPendingCandidates();

      const answer = await rtc.current.createAnswer();
      await rtc.current.setLocalDescription(answer);

      setStatus("talking");
      notify.destroy();

      socket.emit("answer", { answer, to: id });
    } catch (error) {
      CatchError(error);
    }
  };

  const endCall = useCallback(() => {
    if (rtc.current) {
      rtc.current.close();
      rtc.current = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    if (audio.current) {
      audio.current.pause();
    }

    pendingCandidatesRef.current = [];
    setStatus("pending");
    notify.destroy();

    socket.emit("end-call", { to: id });
  }, [id]);

  const onOffer = useCallback((payload: OnOfferInterface) => {
    setStatus("incoming");
    notify.open({
      key: "call-notification",
      message: "Incoming Call",
      description: "Someone is calling you...",
      duration: 0,
      placement: "bottomRight",
      actions: [
        <div key="calls" className="space-x-4">
          <button
            onClick={() => accept(payload)}
            className="bg-green-400 px-3 py-2 rounded text-white hover:bg-green-500"
          >
            Accept
          </button>
          <button
            onClick={endCall}
            className="bg-rose-400 px-3 py-2 rounded text-white hover:bg-rose-500"
          >
            Decline
          </button>
        </div>,
      ],
    });
  }, [endCall]);

  const onAnswer = useCallback(async (payload: OnAnswerInterface) => {
    try {
      if (!rtc.current) return;

      const answer = new RTCSessionDescription(payload.answer);
      await rtc.current.setRemoteDescription(answer);
      
      // Add any pending candidates
      await addPendingCandidates();
    } catch (error) {
      CatchError(error);
    }
  }, [addPendingCandidates]);

  const onCandidate = useCallback(async (payload: OnCandidateInterface) => {
    try {
      if (!rtc.current || !rtc.current.remoteDescription) {
        // Queue candidates if remote description not set yet
        pendingCandidatesRef.current.push(payload.candidate);
        return;
      }

      const candidate = new RTCIceCandidate(payload.candidate);
      await rtc.current.addIceCandidate(candidate);
    } catch (error) {
      CatchError(error);
    }
  }, []);

  const onEndCall = useCallback(() => {
    endCall();
    toast.info("Call ended", { position: "top-center" });
  }, [endCall]);

  useEffect(() => {
    toggleVideo();

    socket.on("offer", onOffer);
    socket.on("candidate", onCandidate);
    socket.on("answer", onAnswer);
    socket.on("end-call", onEndCall);

    return () => {
      socket.off("offer", onOffer);
      socket.off("candidate", onCandidate);
      socket.off("answer", onAnswer);
      socket.off("end-call", onEndCall);
      
      // Cleanup on unmount
      if (rtc.current) {
        rtc.current.close();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audio.current) {
        audio.current.pause();
      }
    };
  }, [onOffer, onCandidate, onAnswer, onEndCall]);

  useEffect(() => {
    if (status === "pending") return;

    if (!audio.current) {
      audio.current = new Audio();
    }

    if (status === "calling" || status === "incoming") {
      audio.current.pause();
      audio.current.src = "/sound/ring.mp3";
      audio.current.currentTime = 0;
      audio.current.loop = true;
      audio.current.play().catch((error) => {
        console.error("Error playing ringtone:", error);
      });
    } else if (status === "talking" || status === "end") {
      audio.current.pause();
    }
  }, [status]);

  return (
    <div className="space-y-6">
      <div
        ref={remoteVideoContainerRef}
        className="bg-black w-full h-0 relative pb-[56.25%] rounded-xl"
      >
        <video
          ref={remoteVideoRef}
          className="w-full h-full absolute object-cover"
          autoPlay
          playsInline
        ></video>
        <button
          className="absolute bottom-2 left-2 bg-white text-xs px-2.5 py-1 rounded-md text-white"
          style={{
            background: "rgba(0,0,0,0.7)",
          }}
        >
          Remote User
        </button>

        <button
          onClick={() => toggleFullscreen("remote")}
          className="absolute bottom-2 right-2 bg-white text-xs px-2.5 py-1 rounded-md text-white hover:scale-125 transition-transform"
          style={{
            background: "rgba(0,0,0,0.7)",
          }}
        >
          <i className="ri-fullscreen-line"></i>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div
          ref={localVideoContainerRef}
          className="bg-black w-full h-0 relative pb-[56.25%] rounded-xl"
        >
          <video
            ref={localVideoRef}
            className="w-full h-full absolute object-cover"
            autoPlay
            playsInline
            muted
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
            className="absolute bottom-2 right-2 bg-white text-xs px-2.5 py-1 rounded-md text-white hover:scale-125 transition-transform"
            style={{
              background: "rgba(0,0,0,0.7)",
            }}
          >
            <i className="ri-fullscreen-line"></i>
          </button>
        </div>

        <Button icon="user-add-line">Add</Button>
      </div>

      <div className="border-b border-b-gray-200 -mx-5 my-4" />

      <div className="flex justify-between items-center">
        <div className="space-x-4">
          <button
            onClick={toggleMic}
            className="bg-amber-50 text-amber-500 w-12 h-12 rounded-full hover:bg-amber-500 hover:text-white transition-colors"
          >
            {isMicMuted ? (
              <i className="ri-mic-off-line"></i>
            ) : (
              <i className="ri-mic-line"></i>
            )}
          </button>

          <button
            onClick={toggleVideo}
            className="bg-green-50 text-green-500 w-12 h-12 rounded-full hover:bg-green-500 hover:text-white transition-colors"
          >
            {isVideoSharing ? (
              <i className="ri-video-on-line"></i>
            ) : (
              <i className="ri-video-off-line"></i>
            )}
          </button>

          <button
            onClick={toggleScreen}
            className="bg-pink-50 text-pink-500 w-12 h-12 rounded-full hover:bg-pink-500 hover:text-white transition-colors"
            disabled={!isVideoSharing}
          >
            <i className="ri-tv-2-line"></i>
          </button>
        </div>
        <div className="space-x-3">
          {status === "pending" && (
            <Button onClick={startCall} icon="phone-line" type="success">
              Call
            </Button>
          )}
          {(status === "calling" || status === "incoming" || status === "talking") && (
            <Button onClick={endCall} icon="close-circle-fill" type="danger">
              End
            </Button>
          )}
        </div>
      </div>
      {notifyUi}
    </div>
  );
};

export default Video;