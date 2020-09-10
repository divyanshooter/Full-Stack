import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "./axios";
import Video from "./components/Video/Video";

function App() {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    async function fetchPosts() {
      const result = await axios.get("/v2/posts");
      setVideos(result.data);
      return result;
    }
    fetchPosts();
  }, []);
  return (
    <div className="app">
      <div className="app__videos">
        {videos.map(
          ({ url, channel, description, song, shares, likes, messages }) => {
            return (
              <Video
                url={url}
                channel={channel}
                description={description}
                song={song}
                likes={likes}
                messages={messages}
                shares={shares}
              />
            );
          }
        )}
      </div>
    </div>
  );
}

export default App;
