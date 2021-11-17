import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as actions from './action';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { i18nTxt } from '../../utils';
import unitParser, { useMobile } from '../../utils/device';
import media from '../../globalStyles/media';
import Tooltip from '../../components/Tooltip';

const WithdrawContent = styled.div`
  background: #fff;
  width: 400px;
  z-index: 100;
  padding: 20px;
  box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  > p {
    font-size: 14px;
    line-height: 14px;
  }
  > p strong {
    color: #171d1f;
    font-weight: 500;
    border-bottom: 1px dashed #171d1f;
  }
  .withdraw-tips {
    margin-top: 12px;
    font-size: 14px;
    color: #8e9394;
    line-height: 1;
    padding-bottom: 5px;
  }
  .input-field {
    margin: 0;
    margin-top: 12px;
  }
  .withdraw-emailcode {
    display: flex;
    > .input-field {
      flex: 1;
    }
    > button {
      height: 56px;
      margin-top: 12px;
      margin-left: 10px;
    }
  }
  .btn-withdraw {
    width: 100%;
    margin-top: 10px;
  }
  .question {
    margin-left: 5px;
  }
  .tooltip-panel {
    line-height: 20px;
    background: #484848;
    color: #fff;
    svg path {
      fill: #484848;
    }
  }
  .wallet-link {
    display: block;
    margin-top: 8px;
    > span {
      color: #8e9394;
      display: inline-block;
      margin-right: 7px;
    }
    a {
      text-decoration: underline;
      margin-right: 5px;
    }
  }

  .wallet-address {
    display: block;
    margin-top: 8px;
    > span {
      color: #8e9394;
      margin-right: 7px;
    }
    a {
      text-decoration: underline;
      margin-right: 5px;
    }
  }

  ${media.mobile`
    width: 100%;
    border-radius: ${unitParser(12)} ${unitParser(12)} 0 0;
    padding-top: ${unitParser(26)};
    > p {
      font-size: ${unitParser(14)};
      line-height: ${unitParser(14)};
    }
    .withdraw-tips {
      font-size: ${unitParser(14)};
    }
    .withdraw-emailcode {
      align-items:baseline;
      > button {
        height: ${unitParser(44)};
        margin-top: ${unitParser(12)};
      }
    }
  `}
`;

const HeadStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  > h3 {
    font-weight: 500;
    margin: 0;
    padding: 0;
    font-size: 20px;
  }
  .close {
    color: #8e9394;
    font-weight: bold;
    cursor: pointer;
    outline: none;
  }
  ${media.mobile`
  font-size: ${unitParser(20)};
  line-height: ${unitParser(20)};
`}
`;

function Withdraw({ userAccount, updateUserAccount, head, getCode, doWithdraw }) {
  useEffect(() => {
    updateUserAccount({
      codeCount: 0,
    });
  }, []);

  const withdrawContent = (
    <WithdrawContent>
      <HeadStyle>
        <h3>{i18nTxt('Withdraw FC')}</h3>

        <button
          className="material-icons close"
          onClick={() => {
            updateUserAccount({
              showWithdrawDialog: false,
            });
          }}
          type="button"
        >
          close
        </button>
      </HeadStyle>

      <p>
        <strong>{head.fansCoin} FC </strong>
        <span>{i18nTxt('available to withdraw')}</span>
        <Tooltip direction="up" tipSpan={<i className="question"></i>}>
          <div>{i18nTxt('withdraw.limit')}</div>
        </Tooltip>
      </p>

      <Input
        {...{
          id: 'withdraw-amount',
          errMsg: userAccount.withDrawAmountErr,
          value: userAccount.withDrawAmount,
          placeHolder: `${i18nTxt('Minimum withdraw amount')} ${head.fansCoin < 50 ? head.fansCoin : 50} FC`,
          label: i18nTxt('Amount'),
          onChange: e => {
            updateUserAccount({
              withDrawAmountErr: '',
              withDrawAmount: e.target.value,
            });
          },
        }}
      />

      <Input
        {...{
          id: 'wallet-address',
          errMsg: i18nTxt(userAccount.walletAddressErr),
          value: userAccount.walletAddress,
          label: i18nTxt('To Address'),
          placeHolder: i18nTxt('withdraw.address'),
          onChange: e => {
            updateUserAccount({
              walletAddressErr: '',
              walletAddress: e.target.value,
            });
          },
        }}
      />

      <div className="wallet-address">
        <span>{i18nTxt('Address Conversion Tip')}</span>
        <span>
          <a href="https://confluxscan.io/address-converter" rel="noopener noreferrer" target="_blank">
            {i18nTxt('Address Conversion')}
          </a>
        </span>
      </div>

      <div className="wallet-link">
        <span>{i18nTxt('Available Wallets:')}</span>
        <div>
          <a href="https://portal.conflux-chain.org" rel="noopener noreferrer" target="_blank">
            ConfluxPortal
          </a>
          <a href="https://moonswap.fi/app" rel="noopener noreferrer" target="_blank">
            Moonswap
          </a>
          <a href="https://store.dappbirds.com/download" rel="noopener noreferrer" target="_blank">
            Dappbirds
          </a>
          <a href="https://cobo.com" rel="noopener noreferrer" target="_blank">
            Cobo
          </a>
        </div>
      </div>

      <Input
        {...{
          id: 'wallet-pass',
          errMsg: i18nTxt(userAccount.walletPassWordErr),
          value: userAccount.walletPassWord,
          label: i18nTxt('Password'),
          type: 'password',
          onChange: e => {
            updateUserAccount({
              walletPassWordErr: '',
              walletPassWord: e.target.value,
            });
          },
        }}
      />

      <div className="withdraw-emailcode">
        <Input
          {...{
            id: 'email-code',
            errMsg: i18nTxt(userAccount.emailCodeErr),
            value: userAccount.emailCode,
            label: i18nTxt('Email Code'),
            onChange: e => {
              updateUserAccount({
                emailCodeErr: '',
                emailCode: e.target.value,
              });
            },
          }}
        />
        <button onClick={getCode} className="btn default" type="button">
          {userAccount.codeCount > 0 ? `${userAccount.codeCount}${i18nTxt('s')}` : i18nTxt('SEND')}
        </button>
      </div>

      <button onClick={doWithdraw} className="btn-withdraw btn waves-effect waves-light primary" type="button">
        {i18nTxt('Withdraw')}
      </button>
    </WithdrawContent>
  );
  const isMobile = useMobile();

  const modal = (
    <Modal
      show={userAccount.showWithdrawDialog}
      mobilePosBottom={isMobile}
      showOverlay
      onEsc={() => {
        updateUserAccount({
          showWithdrawDialog: false,
        });
      }}
    >
      {withdrawContent}
    </Modal>
  );

  return modal;
}

Withdraw.propTypes = {
  userAccount: PropTypes.objectOf({
    walletAddress: PropTypes.string,
  }).isRequired,
  updateUserAccount: PropTypes.func.isRequired,
  user: PropTypes.objectOf({
    id: PropTypes.string,
  }).isRequired,
  head: PropTypes.objectOf({
    fansCoin: PropTypes.string,
  }).isRequired,
  getCode: PropTypes.func.isRequired,
  doWithdraw: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    head: state.head,
    userAccount: state.userInfo.userAccount,
  };
}

export default connect(
  mapStateToProps,
  actions
)(Withdraw);
