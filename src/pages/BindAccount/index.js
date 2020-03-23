import React, { useState } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useEffectOnce } from 'react-use';
import { StyledWrapper } from '../../globalStyles/common';
import media from '../../globalStyles/media';
import { i18nTxt, commonPropTypes, getQuery, notice, auth } from '../../utils';
import { reqLoginBind } from '../../utils/api';
import Input from '../../components/Input';
import { REGEX } from '../../constants';

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  color: #171d1f;

  .bindaccount-wrap {
    width: 360px;
    margin: 0 auto;
    h1 {
      font-size: 32px;
      line-height: 32px;
      margin: 0;
      margin-bottom: 40px;
      font-weight: 500;
      text-align: center;
    }
    ${media.mobile`
      width: auto;
    `}
  }
  .btn-wrap {
    display: flex;
    margin-top: 10px;
    > button {
      flex: 1;
      &:first-child {
        margin-right: 13px;
      }
    }
  }
  .forget-pass {
    margin-top: 23px;
    font-size: 14px;
    line-height: 14px;
    color: #595f61;
    display: block;
  }
  .to-setup {
    display: flex;
    padding-top: 97px;
    > button {
      flex: 1;
    }
  }
  .link-to-setup {
    margin-top: 13px;
  }
  . ${media.mobile`
  .faq-wrap {
    
  }
`};
`;

function BindAccount({ history }) {
  useEffectOnce(() => {
    document.title = i18nTxt('Bind your account');
  });

  const [emailErr, updateEmailErr] = useState('');
  const [email, updateEmail] = useState('');
  const [password, updatePassword] = useState('');
  const [passwordErr, updatePasswordErr] = useState('');

  return (
    <React.Fragment>
      <Wrapper>
        <div className="bindaccount-wrap">
          <h1>{i18nTxt('Bind your account')}</h1>

          <Input
            {...{
              label: i18nTxt('Email'),
              placeHolder: '',
              value: email,
              errMsg: i18nTxt(emailErr),
              onChange: e => {
                updateEmailErr('');
                updateEmail(e.target.value);
              },
              onBlur: () => {
                if (!REGEX.EMAIL.test(email)) {
                  updateEmailErr('Invalid email address');
                }
              },
            }}
          />
          <Input
            {...{
              label: i18nTxt('Password'),
              type: 'password',
              placeHolder: '',
              value: password,
              errMsg: i18nTxt(passwordErr),
              onChange: e => {
                updatePasswordErr('');
                updatePassword(e.target.value);
              },
              onBlur: () => {
                if (!password) {
                  updatePasswordErr('Password is empty');
                }
              },
            }}
          />
          <div className="btn-wrap">
            <button
              className="btn default"
              type="button"
              onClick={() => {
                history.goBack();
              }}
            >
              {i18nTxt('bindacc.BACK')}
            </button>
            <button
              onClick={() => {
                let isValid = true;
                if (!REGEX.EMAIL.test(email)) {
                  isValid = false;
                  updateEmailErr('Invalid email address');
                }

                if (!password) {
                  isValid = false;
                  updatePasswordErr('Password is empty');
                }

                if (!isValid) {
                  return;
                }
                const query = getQuery();

                reqLoginBind({
                  email,
                  password,
                  ...query,
                  source: query.source,
                  accessToken: query.accessToken,
                  userId: query.userId,
                }).then(body => {
                  if (body.code === 0) {
                    auth.setToken(body.result.accessToken);
                    history.push('/');
                    notice.show({ content: i18nTxt('Binded Successfully'), type: 'message-success', timeout: 3000 });
                  }
                });
              }}
              className="btn waves-effect waves-light primary"
              type="button"
            >
              {i18nTxt('bindacc.DONE')}
            </button>
          </div>

          <Link className="forget-pass" to="/reset-password">
            {i18nTxt('Forget password?')}
          </Link>
        </div>
      </Wrapper>
    </React.Fragment>
  );
}

BindAccount.propTypes = {
  history: commonPropTypes.history.isRequired,
};

export default connect()(BindAccount);
