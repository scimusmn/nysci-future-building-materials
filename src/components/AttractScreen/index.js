import React from 'react';
import PropTypes from 'prop-types';

/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/media-has-caption */

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

function AttractScreen({
  defaultContent,
  nonDefaultContent,
}) {
  const defaultTitle = defaultContent.attractTitle;
  const defaultText = capitalize(defaultContent.attractSwipeText);
  const videoClipSrc = defaultContent.attractVideoClip;
  const nonDefaultTitle = nonDefaultContent.attractTitle;
  const nonDefaultText = nonDefaultContent.attractSwipeText;

  return (
    <div className="attract-screen">
      <div className="attract-content">
        <video
          loop
          controls={false}
          muted
          autoPlay
          className="attract-video-loop"
        >
          <source src={videoClipSrc} type="video/mp4" />
        </video>
        <div className="attract-swipe-icon" />
      <div className="attract-section-1">
        <div className="attract-title first">{defaultTitle}</div>
        <div className="attract-title second">{nonDefaultTitle}</div>
      </div>
        <div className="attract-section-2">
          <div
            className="attract-text default-locale"
          >
           {defaultText}
          </div>
          <div
            className="attract-text non-default-locale"
          >
            {nonDefaultText}
          </div>
        </div>
      </div>
    </div>
  );
}

AttractScreen.propTypes = {
  defaultContent: PropTypes.shape({
    attractTitle: PropTypes.string.isRequired,
    attractSwipeText: PropTypes.string.isRequired,
    attractVideoClip: PropTypes.string.isRequired,
  }).isRequired,
  nonDefaultContent: PropTypes.shape({
    attractTitle: PropTypes.string.isRequired,
    attractSwipeText: PropTypes.string.isRequired,
    attractVideoClip: PropTypes.string.isRequired,
  }).isRequired,
};

export default AttractScreen;
