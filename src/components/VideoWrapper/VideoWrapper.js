import React, { useEffect, useRef } from "react";
import Button from "../Button/Button";
import Video from "../Video/Video";
import { parseVAST, vast4, videoToPlay } from "../../utils/utils";
import useAdPlayback from "../../hooks/useAdPlayback";
import "./video-wrapper.css";

const parsedVastFile = parseVAST(vast4);

const VideoWrapper = () => {
  const videoRef = useRef(null);

  const {
    adMedia,
    isAdPlaying,
    showSkipButton,
    currentCreative,
    currentMedia,
    setCurrentMedia,
    setShowSkipButton,
    handleSkipAd,
    onTimeUpdate,
    onVideoEnd,
  } = useAdPlayback(parsedVastFile, videoRef);

  useEffect(() => {
    if (isAdPlaying && adMedia) {
      setCurrentMedia(adMedia);
    } else {
      setCurrentMedia(videoToPlay);
      setShowSkipButton(false);
    }
  }, [isAdPlaying, adMedia, setShowSkipButton, setCurrentMedia]);

  return (
    <div
      className="video-container"
      style={{
        width: `${currentMedia?.width}px`,
        height: `${currentMedia?.height}px`,
      }}
    >
      {currentMedia && (
        <Video
          videoRef={videoRef}
          currentMedia={currentMedia}
          onTimeUpdate={onTimeUpdate}
          onVideoEnd={onVideoEnd}
        />
      )}
      {isAdPlaying && (
        <Button
          position="left"
          aria-label="Visit website"
          onClick={() =>
            window.open(currentCreative?.clickThroughURL, "_blank")
          }
        >
          Visit Website
        </Button>
      )}

      {showSkipButton && isAdPlaying && (
        <Button position="right" aria-label="Skip ad" onClick={handleSkipAd}>
          Skip Ad
        </Button>
      )}
    </div>
  );
};

export default VideoWrapper;
