import React, { useEffect } from 'react';
import { renderRichText } from 'gatsby-source-contentful/rich-text';
import PropTypes from 'prop-types';

/* eslint-disable react/jsx-indent */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

function fixWidows(node) {
  if (node.getAttribute('widows-were-fixed')) {
    return;
  }
  const words = node.innerHTML.split(' ');
  if (words.length > 1) {
    if (words.length > 1) {
      const lastTwoWords = words.splice(-2).join('&nbsp;');
      node.innerHTML = `${words.join(' ')} ${lastTwoWords}`;
      node.setAttribute('widows-were-fixed', 'true');
    }
  }
}

function SlideContent({ locale }) {
  const {
    title,
    node_locale,
    body,
    imageInfo,
  } = locale;

  useEffect(() => {
    const paragraphs = document.querySelectorAll('.body p');
    paragraphs.forEach((paragraph) => {
      fixWidows(paragraph);
    });
  }, [node_locale]);

  useEffect(() => {
    const imgInfo = document.querySelectorAll('.img-info p');
    imgInfo.forEach((info) => {
      fixWidows(info);
    });
  }, [node_locale]);

  return (
    <>
        <div key={node_locale} className={`${node_locale} text-container`}>

          <h2>{({ title } && title) || null}</h2>
          <div className="separator" />
          <div className="body">
                {(body && renderRichText(body)) || null}
          </div>
        </div>
          <div className="slide-footer">
            <div className="img-info">
                <p>{ imageInfo.imageInfo }</p>
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
      raw: PropTypes.string.isRequired,
    }).isRequired,
    imageInfo: PropTypes.string.isRequired,
  }).isRequired,
};

export default SlideContent;
