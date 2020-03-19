import React, { Fragment } from 'react';
import styled from 'styled-components';
import imgGoogle from '../../assets/iconfont/google-logo.svg';
import { i18nTxt } from '../../utils';
import media from '../../globalStyles/media';
import imgWechat from '../../assets/iconfont/wechat-logo.svg';
import { useMobile } from '../../utils/device';

const Wrapper = styled.div`
  .signin-via-wrap {
    margin-top: 38px;
    ${media.mobile`
      text-align: center;
    `}
  }
  .signin-via-text {
    font-size: 14px;
    line-height: 14px;
    color: #8e9394;
  }
  .third-party-signin-wrap {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .seperator {
    border: 1px solid #ebeded;
    margin: 0 20px;
  }
`;

export default function SignInVia() {
  const isMobile = useMobile();

  return (
    <Wrapper>
      <div className="signin-via-wrap">
        <span className="signin-via-text">{i18nTxt('Sign in via')}</span>
        <div className="third-party-signin-wrap">
          <div>
            <a href="/api/user/google-auth">
              <img className="google-logo" src={imgGoogle} alt={i18nTxt('Sign in With Google')} />
            </a>
          </div>
          {!isMobile && (
            <Fragment>
              <div className="seperator" />
              <a href="/api/user/wechat/auth">
                <img className="wechat-logo" src={imgWechat} alt={i18nTxt('Sign in With WeChat')} />
              </a>
            </Fragment>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
