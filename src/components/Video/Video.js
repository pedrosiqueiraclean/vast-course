const Video = ({
  videoRef,
  currentMedia,
  onVideoLoadedMetadata,
  onTimeUpdate,
  onVideoEnd,
}) => (
  <video
    ref={videoRef}
    src={currentMedia.url}
    width="100%"
    height="100%"
    controls
    autoPlay
    aria-label="video-player"
    controlsList="nofullscreen"
    muted={true}
    onLoadedMetadata={onVideoLoadedMetadata}
    onTimeUpdate={onTimeUpdate}
    onEnded={onVideoEnd}
  />
);

export default Video;
