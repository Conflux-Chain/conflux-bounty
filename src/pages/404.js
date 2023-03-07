import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { i18nTxt } from '../utils';
import media from '../globalStyles/media';

const nfImg = require('../assets/images/404.gif');

const NfWrapDiv = styled.div`
  background: #fff;
  padding-top: 103px;
  padding-left: 126px;
  padding-bottom: 20px;
  ${media.pad`padding-left: 60px;`}
  ${media.mobile`
    padding-top: 85px;
    padding-left: 16px;
  `}
  img {
    width: 255px;
    ${media.mobile`
      margin-bottom: 60px;
    `}
  }
  .title {
    font-size: 54px;
    strong {
      margin-left: 5px;
    }
    ${media.mobile`
      font-size: 34px;
      line-height: 41px;
    `}
  }
  .row2,
  .row3,
  .row4 {
    font-size: 20px;
  }
  .row3 {
    font-weight: bold;
    color: rgba(0, 0, 0, 0.54);
  }
  .row5 {
    font-size: 20px;
    a {
      text-decoration: underline;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.87);
    }
  }
`;
class PageNotFound extends PureComponent {
  render() {
    return (
      <NfWrapDiv>
        <img src={nfImg} className="img" alt="not found" />
        <div className="title">{i18nTxt('Page not found')}</div>

        <div className="row2">
          <a href="/">{i18nTxt('home page')}</a>
        </div>

        <div className="row5">
          {i18nTxt('If you think there is something wrong, please ')}
          <a rel="noopener noreferrer" target="_blank" href="mailto:bounty@confluxnetwork.org">
            contact us
          </a>
        </div>
      </NfWrapDiv>
    );
  }
}

PageNotFound.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};

PageNotFound.defaultProps = {
  location: {
    search: '',
  },
};

export default PageNotFound;
