import React, { useState, useEffect, useRef } from "react";
import Button from "../Button/Button";
import Video from "../Video/Video";
import { calculateAdPlayTimes, videoToPlay } from "../../utils/utils";
import useAdPlayback from "../../hooks/useAdPlayback";

const VideoWrapper = ({ vastParsed }) => {
  const videoRef = useRef(null);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [currentTrackingURLs, setCurrentTrackingURLs] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoTime, setVideoTime] = useState(0);

  const {
    adMedia,
    isAdPlaying,
    showSkipButton,
    pausedTime,
    playAd,
    setIsAdPlaying,
    setShowSkipButton,
    skipAd,
  } = useAdPlayback(vastParsed, videoRef);

  useEffect(() => {
    if (isAdPlaying && adMedia) {
      setCurrentMedia(adMedia);
    } else {
      setCurrentMedia(videoToPlay);
      setShowSkipButton(false);
    }

    setCurrentTrackingURLs(vastParsed.trackingURLs);
  }, [isAdPlaying, adMedia, vastParsed.trackingURLs, setShowSkipButton]);

  const onVideoEnd = (event) => {
    if (isAdPlaying) {
      setIsAdPlaying(false);
      setCurrentMedia(videoToPlay);

      setTimeout(() => {
        videoRef.current.currentTime = pausedTime;
        videoRef.current.play();
      }, 0);
    } else {
      onVideoEvent(event);
    }
  };

  const onVideoLoadedMetadata = () => {
    setVideoDuration(videoRef.current.duration);
  };

  const onTimeUpdate = (event) => {
    const currentTime = event.target.currentTime;
    setVideoTime(currentTime);

    if (!isAdPlaying) {
      const adPlayTimes = calculateAdPlayTimes(
        videoDuration,
        vastParsed.mediaFileURLs.length
      );

      adPlayTimes.forEach((time, index) => {
        if (currentTime >= time.start && currentTime < time.end) {
          videoRef.current.pause();
          playAd(index); // playAd will handle tracking for ads
        }
      });
    }
  };

  const onVideoEvent = (event) => {
    const eventType = event.type;
    // Find and send tracking request for matched events (start, firstQuartile, midpoint, etc.)
    const track = currentTrackingURLs.find((t) => t.event === eventType);
    if (track) {
      sendTrackingRequest(track.url);
    }
  };

  const sendTrackingRequest = (url) => {
    // Implement sending tracking request to the URL
    console.log(`Sending tracking request to ${url} at ${videoTime} seconds}`);
  };

  return (
    <div
      style={{
        position: "relative",
        width: `${currentMedia?.width}px`,
        height: `${currentMedia?.height}px`,
      }}
    >
      {currentMedia && (
        <Video
          videoRef={videoRef}
          currentMedia={currentMedia}
          onVideoLoadedMetadata={onVideoLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onVideoEnd={onVideoEnd}
        />
      )}
      {isAdPlaying && (
        <Button
          position="left"
          aria-label="Visit website"
          tabIndex={0}
          onClick={() => window.open(vastParsed.clickThroughURL, "_blank")}
        >
          Visit Website
        </Button>
      )}

      {showSkipButton && (
        <Button
          position="right"
          aria-label="Skip ad"
          tabIndex={0}
          onClick={skipAd}
        >
          Skip Ad
        </Button>
      )}
    </div>
  );
};

export default VideoWrapper;
