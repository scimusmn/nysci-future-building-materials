import React from 'react';
import { renderRichText } from 'gatsby-source-contentful/rich-text';
import PropTypes from 'prop-types';

/* eslint-disable react/jsx-indent */
/* eslint-disable camelcase */

// const preventWidow = (body) => {
//   // Convert the rich text document to plain text
//   const text = renderRichText(body);

//   // Return an empty string if the input is falsy or if it's just whitespace
//   if (!text || !text.trim()) return '';

//   const words = text.trim().split(' ');
//   if (words.length < 2) return text;

//   return `${words.slice(0, -1).join(' ')}\u00A0${words.slice(-1)}`;
// };

function SlideContent({ locale }) {
  const {
    title,
    node_locale,
    body,
    imageInfo,
  } = locale;

  return (
    <>
        <div className={`${node_locale} text-container`} key={node_locale}>

          <h2>{({ title } && title) || null}</h2>
          <div className="separator" />
          <div className="body">
                {(body && renderRichText(body)) || null}
          </div>
        </div>
          <div className="slide-footer">
            <div className="img-info">
                <p>{ imageInfo }</p>
            </div>
          </div>
    </>
  );
}

SlideContent.propTypes = {
  locale: PropTypes.shape({
    title: PropTypes.string.isRequired,
    node_locale: PropTypes.string.isRequired,
    body: PropTypes.shape({
      raw: PropTypes.objectOf.isRequired,
    }),
    imageInfo: PropTypes.string.isRequired,
  }).isRequired,
};

export default SlideContent;
