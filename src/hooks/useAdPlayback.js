import { useState, useRef, useEffect, useCallback } from "react";
import { convertOffsetToSeconds, videoToPlay } from "../utils/utils";

function useAdPlayback(vastParsed, videoRef) {
  const [adMedia, setAdMedia] = useState(null);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);
  const [currentCreative, setCurrentCreative] = useState(null);
  const [currentMedia, setCurrentMedia] = useState(null);
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
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = pausedTime;
        videoRef.current.play();
      }
    }, 1);
  };

  const handleSkipAd = () => {
    sendTrackingRequestForAdEvent("skipped", videoRef.current.currentTime);
    setShowSkipButton(false);
    setIsAdPlaying(false);
    setCurrentCreative(null);
    resumeVideoFromPausedTime();
  };

  const onTimeUpdate = (event) => {
    const currentTime = event.target.currentTime;

    if (!isAdPlaying) {
      vastParsed.creativeDetails.forEach((creative, index) => {
        const offsetSeconds = convertOffsetToSeconds(creative.offset);
        if (currentTime >= offsetSeconds && !creative.hasPlayed) {
          creative.hasPlayed = true;
          videoRef.current.pause();
          handlePlayAd(index);
        }
      });
    }
  };

  const onVideoEnd = () => {
    if (isAdPlaying) {
      setIsAdPlaying(false);
      setCurrentMedia(videoToPlay);

      resumeVideoFromPausedTime();
    }
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
    currentCreative,
    currentMedia,
    setCurrentMedia,
    setShowSkipButton,
    handleSkipAd,
    onTimeUpdate,
    onVideoEnd,
  };
}

export default useAdPlayback;
