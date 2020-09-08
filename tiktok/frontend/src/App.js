import React from "react";
import "./App.css";
import Video from "./components/Video/Video";

function App() {
  return (
    <div className="app">
      <div className="app__videos">
        <Video
          url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
          channel={"divyanshu"}
          description={"This is a description"}
          song={"This is the song"}
          likes={100}
          messages={300}
          shares={15}
        />
        <Video
          url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
          channel={"divyanshu"}
          description={"This is a description"}
          song={"This is the song"}
          likes={100}
          messages={300}
          shares={15}
        />
      </div>
    </div>
  );
}

export default App;
