/**
 * @fileOverview page where user can buy things to extend their invite limit
 * @name buyMoreCodes.js
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { StyledWrapper } from '../../globalStyles/common';
import { notice } from '../../components/Message/notice';
import BackHeadDiv from '../../components/BackHeadDiv';
import { i18nTxt, commonPropTypes } from '../../utils';
import { reqCreateOrder } from '../../utils/api';
import Password from '../../components/Password';
import EmailCode from '../../components/EmailCode';
import Modal from '../../components/Modal';
import media from '../../globalStyles/media';
import close from '../../assets/iconfont/modal-close.svg';
import unitParser from '../../utils/device';

/* eslint-disable func-names */
function ConfirmPurchaseModal({ onConfirm, userEmail, onClose }) {
  let passwordRef;
  let emailCodeRef;
  let password;
  let emailCode;
  return (
    <Modal show showOverlay mobilePosBottom>
      <Confirm>
        <div>
          <h4>{i18nTxt('Confirm Payment')}</h4>
          <button type="button" aria-label="Close" className="close" onClick={onClose}>
            <img src={close} alt="close" />
          </button>
          <p className="noting">{i18nTxt('Please enter your password and E-mail code to confirm this payment')}.</p>
          <Password
            ref={function(ref) {
              passwordRef = ref;
            }}
            onChange={e => {
              password = e.target.value;
            }}
          />
          <EmailCode
            email={userEmail}
            verificationCodeType="PURCHASE"
            ref={function(ref) {
              emailCodeRef = ref;
            }}
            onChange={e => {
              emailCode = e.target.value;
            }}
          />
          <button
            type="button"
            className="btn primary waves"
            onClick={() => {
              if (passwordRef.hasError() || emailCodeRef.hasError()) {
                return;
              }

              onConfirm({ password, emailCode });
            }}
          >
            {i18nTxt('CONFIRM')}
          </button>
        </div>
      </Confirm>
    </Modal>
  );
}

ConfirmPurchaseModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function Shop({ history }) {
  const [productsCount, setProductsCount] = useState([]);
  const [confirming, setConfirming] = useState(false);
  if (!history.location.state) {
    history.push('/invite-friends');
    return false;
  }
  const {
    goodsList,
    user: { email },
  } = history.location.state;

  let total = 0;
  const listUI = goodsList.map(({ name, fansCoin, number: stock, restrictNumber, purchasedNumber, id, description = '' }, idx) => {
    productsCount[idx] = productsCount[idx] || 0;
    total += productsCount[idx] * fansCoin;
    const canBuyCount = restrictNumber - purchasedNumber;
    const limit = Math.min(stock, canBuyCount);
    const purchaseDisabled = productsCount[idx] >= limit;
    const whyCantAddMore = stock > canBuyCount ? i18nTxt('You reached your purchase limit of this product') : i18nTxt('Out of stock');

    return (
      <React.Fragment>
        <div className="product-wrap" key={id}>
          <h3 className="name">{name}</h3>
          <p className="description" style={{ display: description ? 'block' : 'none' }}>
            {description}
          </p>
          <p className="price">{`${i18nTxt('Price')}: ${fansCoin} FC`}</p>
          <div className="actions">
            <div className="controls">
              <button
                type="button"
                className="btn default"
                disabled={productsCount[idx] <= 0}
                onClick={() => {
                  productsCount[idx] -= 1;
                  if (productsCount[idx] <= 0) productsCount[idx] = 0;
                  setProductsCount(productsCount.slice());
                }}
              >
                -
              </button>
              <div className="input-field no-autoinit">
                <input
                  value={productsCount[idx]}
                  onKeyPress={e => {
                    const theEvent = e || window.event;

                    let key;
                    // Handle paste
                    if (theEvent.type === 'paste') {
                      key = window.event.clipboardData.getData('text/plain');
                    } else {
                      // Handle key press
                      key = theEvent.keyCode || theEvent.which;
                      key = String.fromCharCode(key);
                    }
                    const regex = /[0-9]|\./;
                    if (!regex.test(key)) {
                      theEvent.returnValue = false;
                      if (theEvent.preventDefault) theEvent.preventDefault();
                    }
                  }}
                  onChange={e => {
                    if (/^\d*$/.test(e.target.value)) {
                      productsCount[idx] = Math.min(limit, Number.parseInt(e.target.value, 10));
                      setProductsCount(productsCount.slice());
                    }
                  }}
                />
              </div>
              <button
                type="button"
                className="btn default"
                disabled={purchaseDisabled}
                onClick={() => {
                  productsCount[idx] += 1;
                  setProductsCount(productsCount.slice());
                }}
              >
                +
              </button>
            </div>
            <span style={{ display: purchaseDisabled ? 'block' : 'none' }}>{whyCantAddMore}</span>
          </div>
        </div>
      </React.Fragment>
    );
  });

  return (
    <React.Fragment>
      {confirming && (
        <ConfirmPurchaseModal
          userEmail={email}
          onClose={() => {
            setConfirming(false);
          }}
          onConfirm={async ({ emailCode, password }) => {
            const {
              code,
              result: { list },
            } = await reqCreateOrder({
              verificationCode: emailCode,
              password,
              orderList: productsCount.reduce((acc, count, idx) => {
                if (count) {
                  acc.push({ goodsId: goodsList[idx].id, number: count });
                }
                return acc;
              }, []),
            });
            if (code !== 0) return;
            let allOrderSuccessed = true;
            list.forEach(({ code: orderCode, goodsId }) => {
              if (orderCode === 2461) {
                notice.show({
                  content: `${i18nTxt('Failed to purchase product')}: ${goodsList.filter(({ id }) => id === goodsId)[0].name}. ${i18nTxt(
                    "You don't have enough FC"
                  )}.`,
                  type: 'message-error',
                  timeout: 3000,
                });
                allOrderSuccessed = false;
              } else if (orderCode === 7003) {
                notice.show({
                  content: `${i18nTxt('Failed to purchase product')}: ${goodsList.filter(({ id }) => id === goodsId)[0].name}. ${i18nTxt(
                    'Product out of stock'
                  )}.`,
                  type: 'message-error',
                  timeout: 3000,
                });
                allOrderSuccessed = false;
              } else if (orderCode === 7004) {
                notice.show({
                  content: `${i18nTxt('Failed to purchase product')}: ${goodsList.filter(({ id }) => id === goodsId)[0].name}. ${i18nTxt(
                    "You've reached the purchase limitation of this product"
                  )}.`,
                  type: 'message-error',
                  timeout: 3000,
                });
                allOrderSuccessed = false;
              }
            });

            if (allOrderSuccessed) {
              notice.show({ content: i18nTxt('Successful!'), type: 'message-success', timeout: 3000 });
            }
            setConfirming(false);
            history.push('/invite-friends');
          }}
        />
      )}
      <BackHeadDiv onClick={() => history.push('/invite-friends')}>
        <Link to="/invite-friends">{i18nTxt('Invite Friends')}</Link>
      </BackHeadDiv>
      <Wrapper>
        <h1>{i18nTxt('Buy More Codes')}</h1>
        <section className="products-list">{listUI}</section>
        <section className="total">
          <p>
            <span>{i18nTxt('Total price')}: </span>
            <span>{total} FC</span>
          </p>
          <button
            type="button"
            className="btn primary waves"
            onClick={async () => {
              setConfirming(true);
            }}
          >
            {i18nTxt('BUY')}
          </button>
        </section>
      </Wrapper>
    </React.Fragment>
  );
}

Shop.propTypes = {
  history: commonPropTypes.history.isRequired,
};

const Confirm = styled.div`
  padding: 26px 20px 20px 20px;
  ${media.mobile`
    padding: 0;
  `}
  h4 {
    font-weight: 500;
    font-size: 20px;
    line-height: 20px;
    color: #171d1f;
    margin: 0 0 20px 0;
  }
  > div {
    min-width: 350px;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: rgba(0, 0, 0, 0.12) 2px 4px 20px;
    ${media.mobile`
      border-radius: ${unitParser(12)} ${unitParser(12)} 0 0;
      box-shadow: none;
      padding: ${unitParser(24)} ${unitParser(12)} ${unitParser(20)} ${unitParser(12)};
    `}
  }
  .noting {
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 18px;
  }
  .close {
    cursor: pointer;
    position: absolute;
    right: 30px;
    top: 40px;
    ${media.mobile`
      right: ${unitParser(10)};
      top: ${unitParser(15)};
    `}

    &:hover {
      opacity: 1;
      filter: alpha(opacity=100);
      text-decoration: none;
    }
  }
`;

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  color: #171d1f;
  ${media.mobile`
    padding: ${unitParser(20)} ${unitParser(12)};
  `}
  h1 {
    margin: 0;
    font-size: 32px;
    line-height: 32px;
    font-weight: 500;
    ${media.mobile`
      font-size: ${unitParser(24)};
      line-height: ${unitParser(24)};
    `}
  }
  .total {
    text-align: center;
    button {
      width: 100%;
    }
  }
  .products-list {
    display: flex;
    margin-top: 40px;
    flex-direction: column;
    .product-wrap {
      padding: 20px;
      background: #ffffff;
      border: 1px solid #bfc5c7;
      box-sizing: border-box;
      border-radius: 4px;
      margin-bottom: 20px;
      h3 {
        margin: 0;
        font-size: 24px;
        line-height: 24px;
        margin-bottom: 12px;
      }
      .description {
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 12px;
      }
      .price {
        font-size: 16px;
        line-height: 16px;
        color: #f0453a;
        margin-bottom: 20px;
      }
      .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        ${media.mobile`
          flex-direction: column;
          align-items: flex-start;
        `}
        .controls {
          display: flex;
          justify-content: flex-start;
          ${media.mobile`
            margin-bottom: ${unitParser(12)};
            width: 100%;
            justify-content: space-between;
            button:last-child {
              margin-right: 0;
            }
          `}
          * {
            margin-right: 8px;
          }
          button {
            width: 44px;
            border: 1px solid #bfc5c7;
            box-shadow: unset;
            border-radius: 4px;
          }
          .input-field {
            margin: 0 8px 0 0;
            ${media.mobile`
              width: 100%;
            `}
            input {
              text-indent: unset;
              text-align: center;
              width: 56px;
              height: 44px;
              margin: 0;
              ${media.mobile`
                width: 100%;
              `}
            }
          }
        }

        span {
          text-align: right;
          font-size: 14px;
          line-height: 14px;
          color: #8e9394;
        }
      }
    }
  }
  .total {
    text-align: center;
    button {
      width: 100%;
    }
    p {
      margin: 0;
      font-size: 20px;
      line-height: 20px;
      margin-bottom: 20px;
      ${media.mobile`
        display: flex;
        justify-content: space-between;
      `}
    }
  }
`;
