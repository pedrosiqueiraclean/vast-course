import React, { useState, useEffect, useRef } from "react";
import Button from "../Button/Button";
import Video from "../Video/Video";
import {
  convertOffsetToSeconds,
  parseVAST,
  vast4,
  videoToPlay,
} from "../../utils/utils";
import useAdPlayback from "../../hooks/useAdPlayback";
import "./video-wrapper.css";

const parsedVastFile = parseVAST(vast4);

const VideoWrapper = () => {
  const videoRef = useRef(null);
  const [currentMedia, setCurrentMedia] = useState(null);

  const {
    adMedia,
    isAdPlaying,
    showSkipButton,
    pausedTime,
    currentCreative,
    handlePlayAd,
    setIsAdPlaying,
    setShowSkipButton,
    handleSkipAd,
  } = useAdPlayback(parsedVastFile, videoRef);

  useEffect(() => {
    if (isAdPlaying && adMedia) {
      setCurrentMedia(adMedia);
    } else {
      setCurrentMedia(videoToPlay);
      setShowSkipButton(false);
    }
  }, [isAdPlaying, adMedia, setShowSkipButton]);

  const onVideoEnd = () => {
    if (isAdPlaying) {
      setIsAdPlaying(false);
      setCurrentMedia(videoToPlay);

      setTimeout(() => {
        videoRef.current.currentTime = pausedTime;
        videoRef.current.play();
      }, 0);
    }
  };

  const onTimeUpdate = (event) => {
    const currentTime = event.target.currentTime;

    if (!isAdPlaying) {
      parsedVastFile.creativeDetails.forEach((creative, index) => {
        const offsetSeconds = convertOffsetToSeconds(creative.offset);
        if (currentTime >= offsetSeconds && !creative.hasPlayed) {
          creative.hasPlayed = true;
          videoRef.current.pause();
          handlePlayAd(index);
        }
      });
    }
  };

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

      {showSkipButton && (
        <Button position="right" aria-label="Skip ad" onClick={handleSkipAd}>
          Skip Ad
        </Button>
      )}
    </div>
  );
};

export default VideoWrapper;
