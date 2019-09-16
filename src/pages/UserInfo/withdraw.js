import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as actions from './action';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { i18nTxt } from '../../utils';

const WithdrawContent = styled.div`
  background: #fff;
  width: 400px;
  z-index: 100;
  padding: 20px;
  > h3 {
    font-weight: 500;
    margin: 0;
    padding: 0;
    font-size: 20px;
    margin-bottom: 20px;
  }
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
    font-size: 14px;
    color: #8e9394;
    line-height: 1;
    padding-bottom: 5px;
  }
  .input-field {
    margin: 0;
    margin-top: 6px;
  }
  .withdraw-emailcode {
    display: flex;
    > .input-field {
      flex: 1;
    }
    > button {
      height: 56px;
      margin-top: 4px;
      margin-left: 10px;
    }
  }
  .btn-withdraw {
    width: 100%;
    margin-top: 10px;
  }
  .close {
    position: absolute;
    color: #8e9394;
    font-weight: 500;
    right: 2px;
    top: 9px;
    font-style: normal;
    cursor: pointer;
    outline: none;
  }
`;

// eslint-disable-next-line react/prefer-stateless-function
class Withdraw extends Component {
  componentWillUnmount() {
    const { updateUserAccount } = this.props;
    updateUserAccount({
      codeCount: 0,
    });
  }

  render() {
    const { userAccount, updateUserAccount, head, getCode, doWithdraw } = this.props;
    return (
      <Modal
        show={userAccount.showWithdrawDialog}
        onEsc={() => {
          updateUserAccount({
            showWithdrawDialog: false,
          });
        }}
      >
        <WithdrawContent>
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

          <h3>{i18nTxt('Withdraw FC')}</h3>
          <p>
            <strong>{head.fansCoin} FC </strong>
            <span>{i18nTxt('available to withdraw')}</span>
          </p>

          <Input
            {...{
              id: 'withdraw-amount',
              errMsg: userAccount.withDrawAmountErr,
              value: userAccount.withDrawAmount,
              label: i18nTxt('Amount'),
              onChange: e => {
                updateUserAccount({
                  withDrawAmountErr: '',
                  withDrawAmount: e.target.value,
                });
              },
            }}
          />
          <div className="withdraw-tips">{i18nTxt('Minimum withdraw amount')} 50 FC</div>

          <Input
            {...{
              id: 'wallet-address',
              errMsg: i18nTxt(userAccount.walletAddressErr),
              value: userAccount.walletAddress,
              label: i18nTxt('To Address'),
              placeHolder: '',
              onChange: e => {
                updateUserAccount({
                  walletAddressErr: '',
                  walletAddress: e.target.value,
                });
              },
            }}
          />

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
            <button onClick={getCode} className="btn default waves-effect" type="button">
              {userAccount.codeCount > 0 ? `${userAccount.codeCount}${i18nTxt('s')}` : i18nTxt('SEND')}
            </button>
          </div>

          <button onClick={doWithdraw} className="btn-withdraw btn waves-effect waves-light primary" type="button">
            {i18nTxt('Withdraw')}
          </button>
        </WithdrawContent>
      </Modal>
    );
  }
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
