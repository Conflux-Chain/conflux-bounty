import React, { Component, Fragment } from 'react';
// import PropTypes from "prop-types";
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';
// import { connect } from 'react-redux';
import { commonPropTypes, isPath } from '../../utils';
// import media from '../../globalStyles/media';
import footImg from '../../assets/iconfont/conflux-foot-logo.svg';
import medium from '../../assets/iconfont/medium.svg';
import reddit from '../../assets/iconfont/reddit.svg';
import telegram from '../../assets/iconfont/telegram.svg';
import twitter from '../../assets/iconfont/twitter.svg';
import wechat from '../../assets/iconfont/wechat.svg';
import weibo from '../../assets/iconfont/weibo.svg';
import github from '../../assets/iconfont/github.svg';
import code from '../../assets/images/code.jpg';
import media from '../../globalStyles/media';

const Wrap = styled.div`
  ${media.tablet`display: none!important;`}
  background: #33353d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 142px;
  width: 100%;
  padding: 40px 0 20px;
  justify-content: space-between;
  overflow: hidden;
  z-index: 9;
  &.home {
    margin-top: 0px;
  }
  .foot-content {
    width: 1200px;
    display: flex;
    justify-content: space-between;
    position: absolute;
  }
  .foot-portal {
    display: flex;
    justify-content: center;
    margin-top: 25px;
    a {
      color: #fff;
      opacity: 0.8;
      font-size: 16px;
      font-weight: 300;
      margin-right: 40px;
      text-decoration: none;
      img {
        margin-left: 2px;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .foot-icon {
    display: flex;
    a {
      margin-right: 16px;
    }
    .wechat {
      position: relative;
      z-index: 9999;
      .wechat-code {
        display: none;
        position: absolute;
        bottom: 72px;
        left: -45px;
        max-width: 114px;
      }
      &:hover {
        .wechat-code {
          display: inline-block;
        }
      }
    }
  }
  .foot-copyright {
    color: rgba(255, 255, 255, 0.8);
    opacity: 0.6;
    font-weight: 300;
    a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: underline;
    }
  }
`;

const WrapMobile = styled.div`
  z-index: 9;
  display: none;
  ${media.tablet`display: block!important;`}
  background: #33353D;
  padding: 20px 28px;

  .bottom-line1 {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 20px;

    .bottom-line1-right {
      text-align: right;
      > a {
        display: block;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 14px;
        line-height: 14px;
      }
    }
  }

  .bottom-line2 {
    margin-top: 12px;
    display: flex;
    justify-content: center;
    a {
      margin-right: 16px;
    }
    .wechat {
      position: relative;
      z-index: 9999;
      .wechat-code {
        display: none;
        position: fixed;
        min-width: 70vw;
        max-width: 80vw;
        top: 30%;
        left: 50%;
        transform: translateX(-50%);
      }
      &:hover {
        .wechat-code {
          display: block;
        }
      }
    }
  }
  .bottom-line3 {
    font-size: 14px;
    margin-top: 15px;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
    a {
      color: rgba(255, 255, 255, 0.6);
      margin: 0 2px;
    }
  }
`;

// eslint-disable-next-line react/prefer-stateless-function
class PageFooter extends Component {
  render() {
    const { location } = this.props;
    let wrapClass;
    if (isPath(location, '/')) {
      wrapClass = 'home';
    } else {
      wrapClass = 'normal';
    }
    return (
      <Fragment>
        <Wrap className={wrapClass}>
          <div className="foot-content">
            <Link to="/">
              <img src={footImg} alt="logo" />
            </Link>
            <div>
              <div className="foot-copyright">
                © 2021 Conflux. All Rights Reserved.{' '}
                <Link to="/terms" target="_blank">
                  Terms Privacy
                </Link>{' '}
                |{' '}
                <Link to="/policy" target="_blank">
                  Policy
                </Link>
              </div>
              <div className="foot-portal">
                <a href="/faqs" target="_blank">
                  FAQs
                </a>
                <a href="http://www.conflux-chain.org/" rel="noopener noreferrer" target="_blank">
                  Conflux
                </a>
                <a href="http://www.confluxscan.io/" rel="noopener noreferrer" target="_blank">
                  Explorer
                </a>
                <a href="https://wallet.confluxscan.io/" rel="noopener noreferrer" target="_blank">
                  Wallet
                </a>
              </div>
            </div>
            <div className="foot-icon">
              <a href="https://twitter.com/ConfluxChain" rel="noopener noreferrer" target="_blank">
                <img src={twitter} alt="twitter" />
              </a>
              <a href="https://github.com/conflux-chain" rel="noopener noreferrer" target="_blank">
                <img src={github} alt="github" />
              </a>
              <a href="https://www.reddit.com/user/ConfluxChain" rel="noopener noreferrer" target="_blank">
                <img src={reddit} alt="reddit" />
              </a>
              <a href="https://medium.com/@Confluxchain" rel="noopener noreferrer" target="_blank">
                <img src={medium} alt="medium" />
              </a>
              <a href="http://t.me/Conflux_English" rel="noopener noreferrer" target="_blank">
                <img src={telegram} alt="telegram" />
              </a>
              <a href="https://weibo.com/confluxchain" rel="noopener noreferrer" target="_blank">
                <img src={weibo} alt="weibo" />
              </a>
              <div className="wechat">
                <img src={wechat} alt="wechat" />
                <img src={code} className="wechat-code" alt="code" />
              </div>
            </div>
          </div>
        </Wrap>

        <WrapMobile>
          <div className="bottom-line1">
            <img src={footImg} alt="logo" />
            <div className="bottom-line1-right">
              <a href="/faqs" target="_blank">
                FAQs
              </a>
              <a href="http://www.conflux-chain.org/" rel="noopener noreferrer" target="_blank">
                Conflux Official Site
              </a>
              <a href="http://www.confluxscan.io/" rel="noopener noreferrer" target="_blank">
                Explorer
              </a>
              <a href="https://wallet.confluxscan.io/" rel="noopener noreferrer" target="_blank">
                Wallet
              </a>
            </div>
          </div>
          <div className="bottom-line2">
            <a href="https://twitter.com/ConfluxChain" rel="noopener noreferrer" target="_blank">
              <img src={twitter} alt="twitter" />
            </a>
            <a href="https://github.com/conflux-chain" rel="noopener noreferrer" target="_blank">
              <img src={github} alt="github" />
            </a>
            <a href="https://www.reddit.com/user/ConfluxChain" rel="noopener noreferrer" target="_blank">
              <img src={reddit} alt="reddit" />
            </a>
            <a href="https://medium.com/@Confluxchain" rel="noopener noreferrer" target="_blank">
              <img src={medium} alt="medium" />
            </a>
            <a href="http://t.me/Conflux_English" rel="noopener noreferrer" target="_blank">
              <img src={telegram} alt="telegram" />
            </a>
            <a href="https://weibo.com/confluxchain" rel="noopener noreferrer" target="_blank">
              <img src={weibo} alt="weibo" />
            </a>
            <div className="wechat">
              <img src={wechat} alt="wechat" />
              <img src={code} className="wechat-code" alt="code" />
            </div>
          </div>

          <div className="bottom-line3">
            <span> © 2021 Conflux. All Rights Reserved. </span>
            <br />
            <Link to="/terms" target="_blank">
              Terms Privacy
            </Link>
            <span>|</span>
            <Link to="/policy" target="_blank">
              Policy
            </Link>
          </div>
        </WrapMobile>
      </Fragment>
    );
  }
}

PageFooter.propTypes = {
  // history: commonPropTypes.history,
  location: commonPropTypes.location.isRequired,
};
PageFooter.defaultProps = {};

export default withRouter(PageFooter);
