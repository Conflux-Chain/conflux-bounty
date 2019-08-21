import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ImgDiv = styled.div`
  vertical-align: middle;
  border-radius: 50%;
  background: #333;
  &.withimg {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
    background: #fff;
  }
  position: relative;
  overflow: hidden;
  display: inline-block;
  width: 44px;
  height: 44px;

  > img {
    max-width: 100%;
    max-height: 100%;
    min-width: 70%;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
`;

class PhotoImg extends PureComponent {
  render() {
    const { imgSrc, alt, className } = this.props;

    return (
      <ImgDiv className={imgSrc ? `${className} withimg` : className}>
        <img alt={alt} src={imgSrc} />
      </ImgDiv>
    );
  }
}

PhotoImg.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
};

PhotoImg.defaultProps = {
  alt: '',
  className: '',
};
export default PhotoImg;
