import React from "react";
import "./VideoFooter.css";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import Ticker from "react-ticker";

function VideoFooter() {
  return (
    <div className="VideoFooter">
      <div className="VideoFooter__text">
        <h3>@divyanshu</h3>
        <p>The description will be present</p>
        <div className="VideoFooter__ticker">
          <MusicNoteIcon className="VideoFooter__icon" />
          <Ticker mode="smooth">
            {({ index }) => (
              <>
                <p>I am a song</p>
              </>
            )}
          </Ticker>
        </div>
      </div>
      <img
        className="VideoFooter__record"
        src="https://static.thenounproject.com/png/934821-200.png"
        alt=""
      />
    </div>
  );
}

export default VideoFooter;
