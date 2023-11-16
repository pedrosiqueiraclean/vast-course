import { useState, useRef, useEffect, useCallback } from "react";

function useAdPlayback(vastParsed, videoRef) {
  const [adMedia, setAdMedia] = useState(null);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);
  const [currentAdIndex, setCurrentAdIndex] = useState(null);
  const skipButtonTimerRef = useRef(null);

  const convertOffsetToSeconds = (offset) => {
    const [hours, minutes, seconds] = offset.split(":").map(parseFloat);
    return hours * 3600 + minutes * 60 + seconds;
  };

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

  const playAd = (adIndex) => {
    if (vastParsed.mediaFileURLs.length > adIndex) {
      setCurrentAdIndex(adIndex);
      setPausedTime(videoRef.current.currentTime + 1);
      setAdMedia(vastParsed.mediaFileURLs[adIndex]);
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

  const skipAd = () => {
    sendTrackingRequestForAdEvent("skipped", videoRef.current.currentTime);
    setShowSkipButton(false);
    setIsAdPlaying(false);
    setCurrentAdIndex(null);
    setTimeout(() => {
      if (videoRef.current) {
        resumeVideoFromPausedTime();
      }
    }, 1);
  };

  useEffect(() => {
    if (!isAdPlaying && currentAdIndex !== null) {
      sendTrackingRequestForAdEvent("complete", videoRef.current.currentTime);
      setCurrentAdIndex(null);
    }
  }, [isAdPlaying, currentAdIndex, sendTrackingRequestForAdEvent, videoRef]);

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
    playAd,
    skipAd,
    setIsAdPlaying,
    setShowSkipButton,
    setPausedTime,
    resumeVideoFromPausedTime,
  };
}

export default useAdPlayback;
