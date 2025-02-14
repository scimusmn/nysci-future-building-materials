import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function Video({ src, active, resetIdleTimer }) {
  const vidRef = useRef(null);

  useEffect(() => {
    const video = vidRef.current;

    if (active) {
      resetIdleTimer();
      video.currentTime = 0;
      video.play().catch((error) => {
        if (error) {
          console.error('Video play was interrupted:', error);
          // Handle the error, e.g., reset the page
          window.location.reload();
        }
      });
    } else {
      video.pause();
    }
  }, [active]);

  return (
    <video
      id="media-video"
      loop
      autoPlay
      preload="auto"
      ref={vidRef}
    >
      <source src={src} />
      <track kind="captions" srcLang="en" src={null} />
    </video>
  );
}

Video.propTypes = {
  src: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  resetIdleTimer: PropTypes.func.isRequired,
};

export default Video;
