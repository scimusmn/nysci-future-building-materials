/* eslint no-console: 0 */
import React, { useState, useEffect } from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { renderRichText } from 'gatsby-source-contentful/rich-text';
import SwiperCore, { Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useIdleTimer } from 'react-idle-timer';
import Video from '../../components/Video';
import AttractScreen from '../../components/AttractScreen';

import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

SwiperCore.use([Pagination, Navigation]);

export const slideTypes = graphql`
  fragment SlideTypes on ContentfulSlideContentfulTitleSlideUnion {
    ... on ContentfulTitleSlide {
      __typename
      node_locale
      id
    }
    ... on ContentfulSlide {
      __typename
      node_locale
      id
      title
      body {
        raw
      }
      imageInfo
      media {
        credit
        altText {
          altText
        }
        media {
          file {
            contentType
            url
          }
          localFile {
            publicURL
            childImageSharp {
              gatsbyImageData(
                width: 950
                height: 1080
                layout: FIXED
                placeholder: BLURRED
              )
            }
          }
        }
      }
    }
  }
`;

export const pageQuery = graphql`
  fragment FlipbookFragment on ContentfulFlipbook {
    slug
    inactivityTimeout
    node_locale
    slides {
      ...SlideTypes
    }
  } 
  query ($slug: String!, $locales: [String]) {
    allContentfulLocale {
      edges {
        node {
          code
          name
          default
        }
      }
    }
    allContentfulFlipbook(
      filter: {
        slug: { eq: $slug }
        node_locale: { in: $locales }
      }
    ) {
      edges {
        node {
          ...FlipbookFragment
        }
      }
    }
  }
`;

function Flipbook({ data, pageContext, location }) {
  console.log('Page data:', data);
  console.log('Page context:', pageContext);
  console.log('Page location:', location);

  const localeNodes = data.allContentfulFlipbook.edges.map((edge) => edge.node);

  const { titleSlideContent } = pageContext;
  const titleSlideDefaultData = titleSlideContent.filter((slide) => slide.node_locale === 'en-US');
  const titleSlideNonDefaultData = titleSlideContent.filter((slide) => slide.node_locale === 'es');

  const titleSlideDefaultContent = {
    attractTitle: titleSlideDefaultData[0].mainTitle,
    attractSwipeText: titleSlideDefaultData[0].instructionText,
    attractVideoClip: titleSlideDefaultData[0].titleSlideVideo.videoAsset.localFile.publicURL,
  };

  const titleSlideNonDefaultContent = {
    attractTitle: titleSlideNonDefaultData[0].mainTitle,
    attractSwipeText: titleSlideNonDefaultData[0].instructionText,
    attractVideoClip: titleSlideNonDefaultData[0].titleSlideVideo.videoAsset.localFile.publicURL,
  };

  // Array of multi-locale slides
  const slides = localeNodes[0].slides.map((slide, i) => localeNodes.map((node) => node.slides[i]));
  const localesInfo = data.allContentfulLocale.edges.map((edge) => edge.node);

  // Get default locale info
  const defaultLocale = localesInfo.filter((locale) => locale.default === true);

  // Filter out current locale
  const buttonLocales = localesInfo.filter((locale) => !pageContext.locales.includes(locale.code));

  // To sync slide index between locales
  const [currentSlide, setCurrentSlide] = useState(null);
  const [slideChangeCount, setSlideChangeCount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let slideIndex = params.get('currentSlide');
    if (!slideIndex) slideIndex = 0;
    setCurrentSlide(parseInt(slideIndex, 10));
  }, []);

  // Inactivity timeout
  const { inactivityTimeout } = localeNodes[0];
  const { reset } = useIdleTimer({
    timeout: inactivityTimeout * 1000,
    debounce: 500,
    startOnMount: false,
    onIdle: () => {
      window.location.replace(`${window.origin}/${defaultLocale[0].code}/${pageContext.slug}?currentSlide=0`);
    },
  });

  const getAltText = (altObj) => {
    if (altObj) return altObj.altText;
    return 'Image';
  };

  const setUrlParam = (key, value) => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set(key, value);
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState(null, null, newUrl);
    }
  };

  const onSlideChange = (swiper) => {
    const { realIndex } = swiper;
    console.log('realIndex: ', realIndex);
    setUrlParam('currentSlide', realIndex);
    setCurrentSlide(realIndex);
    setSlideChangeCount((prevCount) => prevCount + 1);

    // Trigger a hard reload after 100 slide changes
    if (slideChangeCount >= 100) {
      setSlideChangeCount(0);
      window.location.replace(`${window.origin}/${defaultLocale[0].code}/${pageContext.slug}?currentSlide=${realIndex}`);
      window.location.reload();
    }
  };

  const renderLocaleButtons = () => (
    <button type="button" className={`locale-toggle-button ${currentSlide === 0 ? 'hidden' : 'visible'}`}>
      { buttonLocales && buttonLocales.map((localeInfo) => (
        <Link
          key={localeInfo.code}
          to={`/${localeInfo.code}/${pageContext.slug}?currentSlide=${currentSlide}`}
          className={`locale-toggle-button ${localeInfo.code}`}
        />
      ))}
    </button>
  );

  const renderTitleSlide = (slide) => (
    <SwiperSlide key={slide[0].id} className="title-slide">
      <AttractScreen
        defaultContent={titleSlideDefaultContent}
        nonDefaultContent={titleSlideNonDefaultContent}
      />
    </SwiperSlide>
  );

  const renderSlides = slides.map((slide) => {
    // eslint-disable-next-line no-underscore-dangle
    if (slide[0].__typename === 'ContentfulTitleSlide') return renderTitleSlide(slide);

    return (
      <SwiperSlide key={slide[0].id}>
        {({ isActive }) => (
          <div className="slide-wrapper">
            {/* Media */}
            {(slide[0].media && slide[0].media.media) && (
              <div>
                {
                (slide[0].media.media.file.contentType).includes('video')
                  ? <Video id="media" src={slide[0].media.media.localFile.publicURL} active={isActive} resetIdleTimer={reset} />
                  : (
                    <GatsbyImage
                      id="media"
                      image={getImage(slide[0].media.media.localFile)}
                      alt={getAltText(slide[0].media.altText)}
                      loading="eager"
                    />
                  )
                }
                <span className="credit" key={slide[0].id}>{slide[0].media.credit}</span>
              </div>
            )}
            {/* Title and body for each locale */}
            <div className="content-wrapper">
              {slide.map((locale) => (
                <>
                  <div className={`${locale.node_locale} text-container`} key={locale.node_locale}>
                    <h2>{(locale.title && locale.title) || null}</h2>
                    <div className="separator" />
                    <div className="body">
                      {(locale.body && renderRichText(locale.body)) || null}
                    </div>
                  </div>
                  <div className="slide-footer">
                    <div className="img-info">
                      <p>{locale.imageInfo}</p>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        )}
      </SwiperSlide>
    );
  });
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {currentSlide !== null
      && (
      <Swiper
        initialSlide={currentSlide}
        spaceBetween={0}
        slidesPerView={1}
        loop
        centeredSlides
        navigation
        direction="vertical"
        pagination={{
          clickable: true,
        }}
        onSlideChange={onSlideChange}
        className={localeNodes[0].slug}
      >
        {renderSlides}
        {renderLocaleButtons()}
      </Swiper>
      )}
    </>
  );
}

/* eslint-disable react/forbid-prop-types */

Flipbook.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
  pageContext: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Flipbook;
