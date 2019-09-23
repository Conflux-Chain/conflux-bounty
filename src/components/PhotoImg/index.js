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
  > .backimg {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }
`;

class PhotoImg extends PureComponent {
  render() {
    const { imgSrc, className } = this.props;

    return (
      <ImgDiv className={imgSrc ? `${className} withimg` : className}>
        <div
          className="backimg"
          style={{
            backgroundImage: `url(${imgSrc})`,
          }}
        ></div>
      </ImgDiv>
    );
  }
}

PhotoImg.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  className: PropTypes.string,
};

PhotoImg.defaultProps = {
  className: '',
};
export default PhotoImg;
