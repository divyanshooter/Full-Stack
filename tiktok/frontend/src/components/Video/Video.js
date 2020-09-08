import React, { useRef, useState } from "react";
import VideoFooter from "../VideoFooter/VideoFooter";
import "./Video.css";

function Video() {
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
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      />
      <VideoFooter />
    </div>
  );
}

export default Video;
