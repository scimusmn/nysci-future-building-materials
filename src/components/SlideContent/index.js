import React, { useEffect } from 'react';
import { renderRichText } from 'gatsby-source-contentful/rich-text';
import PropTypes from 'prop-types';

/* eslint-disable react/jsx-indent */
/* eslint-disable camelcase */

// const usePreventWidow = () => {
//   useEffect(() => {
//     document.querySelectorAll('.body').forEach((paragraph) => {
//       const words = paragraph.innerHTML.split(' ');
//       console.log('words', words);
//       if (words.length > 1) {
//         const lastWord = words.pop();
//         const secondToLastWord = words.pop();
//         const joinedLastTwoWords = `${secondToLastWord}\u00A0${lastWord}`;
//         /* eslint-disable no-param-reassign */
//         paragraph.innerHTML = `${words.join(' ')} ${joinedLastTwoWords}`;
//       }
//     });
//   }, []);
// };

function SlideContent({ locale }) {
  const {
    title,
    node_locale,
    body,
    imageInfo,
  } = locale;

  useEffect(() => {
    console.log('locale', locale);
  }, [locale]);

  /* eslint-disable no-param-reassign */
  /* eslint-disable no-plusplus */
  useEffect(() => {
    document.querySelectorAll('.body').forEach((paragraph) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(paragraph.innerHTML, 'text/html');
      const textNodes = [];

      // Extract text nodes
      const extractTextNodes = (node) => {
        node.childNodes.forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            textNodes.push(child);
          } else {
            extractTextNodes(child);
          }
        });
      };

      extractTextNodes(doc.body);

      // Combine text content
      const words = textNodes.map((node) => node.textContent).join(' ').split(' ');

      if (words.length > 1) {
        const lastWord = words.pop();

        // Update text nodes
        let wordIndex = 0;
        textNodes.forEach((node) => {
          const nodeWords = node.textContent.split(' ');
          const newText = nodeWords.map((word) => {
            if (wordIndex === words.length - 1) {
              /* eslint-disable no-plusplus */
              wordIndex++;
              return `${word}\u00A0${lastWord}`;
            }
            return words[wordIndex++];
          }).join(' ');

          node.textContent = newText;
        });

        // Set the updated HTML back to the paragraph
        paragraph.innerHTML = doc.body.innerHTML;
      }
    });
  }, [locale]);

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
