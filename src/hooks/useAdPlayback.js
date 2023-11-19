import { useState, useRef, useEffect, useCallback } from "react";
import { convertOffsetToSeconds } from "../utils/utils";

function useAdPlayback(vastParsed, videoRef) {
  const [adMedia, setAdMedia] = useState(null);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);
  const [currentCreative, setCurrentCreative] = useState(null);
  const skipButtonTimerRef = useRef(null);

  const sendTrackingRequest = (url) => {
    console.log(`Sending tracking request to ${url}`);
  };

  const sendTrackingRequestForAdEvent = useCallback(
    (eventType, currentTime) => {
      vastParsed.trackingURLs.forEach((track) => {
        if (track.event === eventType) {
          if (
            !track.offset ||
            currentTime >= convertOffsetToSeconds(track.offset)
          ) {
            sendTrackingRequest(track.url);
          }
        }
      });
    },
    [vastParsed.trackingURLs]
  );

  const handlePlayAd = (adIndex) => {
    if (vastParsed.creativeDetails.length > adIndex) {
      const selectedCreative = vastParsed.creativeDetails[adIndex];
      setCurrentCreative(selectedCreative);
      setPausedTime(videoRef.current.currentTime);
      setAdMedia(selectedCreative.mediaFileDetails);
      setIsAdPlaying(true);
      setShowSkipButton(false);
      sendTrackingRequestForAdEvent("start", videoRef.current.currentTime);

      skipButtonTimerRef.current = setTimeout(() => {
        setShowSkipButton(true);
      }, 5000);
    }
  };

  const resumeVideoFromPausedTime = () => {
    videoRef.current.currentTime = pausedTime;
    videoRef.current.play();
  };

  const handleSkipAd = () => {
    sendTrackingRequestForAdEvent("skipped", videoRef.current.currentTime);
    setShowSkipButton(false);
    setIsAdPlaying(false);
    setCurrentCreative(null);
    setTimeout(() => {
      if (videoRef.current) {
        resumeVideoFromPausedTime();
      }
    }, 1);
  };

  useEffect(() => {
    if (!isAdPlaying && currentCreative !== null) {
      sendTrackingRequestForAdEvent("complete", videoRef.current.currentTime);
      setCurrentCreative(null);
    }
  }, [isAdPlaying, currentCreative, sendTrackingRequestForAdEvent, videoRef]);

  useEffect(() => {
    return () => {
      if (skipButtonTimerRef.current) {
        clearTimeout(skipButtonTimerRef.current);
      }
    };
  }, []);

  return {
    adMedia,
    isAdPlaying,
    showSkipButton,
    pausedTime,
    currentCreative,
    handlePlayAd,
    handleSkipAd,
    setIsAdPlaying,
    setShowSkipButton,
  };
}

export default useAdPlayback;
