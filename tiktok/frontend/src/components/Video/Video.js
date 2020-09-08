import React, { useRef, useState } from "react";
import VideoFooter from "../VideoFooter/VideoFooter";
import "./Video.css";
import VideoSidebar from "../VideoSidebar/VideoSidebar";

function Video({ url, channel, description, song, likes, messages, shares }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const hanndleVideoPress = () => {
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };
  return (
    <div className="video">
      <video
        className="video__player"
        loop
        onClick={hanndleVideoPress}
        ref={videoRef}
        src={url}
      />
      <VideoFooter channel={channel} description={description} song={song} />
      <VideoSidebar likes={likes} messages={messages} shares={shares} />
    </div>
  );
}

export default Video;
