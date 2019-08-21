import React from 'react';
import styled from 'styled-components';
import imgGoogle from '../../assets/iconfont/google-logo.svg';
import { i18nTxt } from '../../utils';
// import imgWechat from '../../assets/iconfont/wechat-logo.svg';

const Wrapper = styled.div`
  .signin-via-wrap {
    margin-top: 38px;
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
          {/* <div className="seperator" /> */}
          {/* <div> */}
          {/*   <img className="wechat-logo" src={imgWechat} alt="Sign in With WeChat" /> */}
          {/* </div> */}
        </div>
      </div>
    </Wrapper>
  );
}
