import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cx from 'classnames';
import moment from 'moment';
import * as actions from './action';
import { StyledWrapper } from '../../globalStyles/common';
import BackHeadDiv from '../../components/BackHeadDiv';
import * as s2 from './commonStyle';
import noResult from '../../assets/images/icon-no-results.png';
import { auth, commonPropTypes, getStatus, i18nTxt } from '../../utils';

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  color: #171d1f;
  h1 {
    font-size: 32px;
    line-height: 32px;
    margin: 0;
    margin-bottom: 40px;
    font-weight: 500;
  }
  .table-wrap {
    margin-top: 9px;
    .align-right {
      text-align: right;
    }
    th {
      font-weight: 500;
      color: #8e9394;
    }
    td {
      color: #171d1f;
    }
    .text-gray {
      color: #8e9394;
    }
    .text-green {
      color: #4a9e81;
    }
    .show-more {
      text-align: center;
      margin-top: 40px;
    }
    .order-cost {
      font-size: 14px;
      line-height: 14px;
      text-align: right;
      color: #f0453a;
    }
    tr {
      th:last-child {
        text-align: right;
      }
    }
  }
  .arrow-link {
    span,
    i {
      vertical-align: middle;
    }
  }
`;

const NoResult = styled.div`
  display: block;
  text-align: center;
  margin-top: 40px;
  > img {
    width: 80px;
    margin: 0 auto;
    display: block;
  }
  img + div {
    margin-top: 20px;
    color: rgb(142, 147, 148);
    margin-bottom: 20px;
  }
`;

// eslint-disable-next-line react/prefer-stateless-function
class AccountHistory extends Component {
  constructor(...args) {
    super(...args);

    const { accountHistory, history, getWithdrawList, getRewardList, getOrderList, resetHistory, updateHistory } = this.props;
    if (!auth.loggedIn()) {
      history.push('/signin');
      return;
    }

    const getdata = async () => {
      await Promise.all([getRewardList(1), getWithdrawList(1), getOrderList(1)]);

      updateHistory({
        initDataFetched: true,
      });
    };

    if (accountHistory.action === 'PUSH') {
      resetHistory();
      getdata();
    } else if (accountHistory.initDataFetched === false) {
      getdata();
    }

    document.title = i18nTxt('History');
  }

  render() {
    const { history, accountHistory, updateHistory, getWithdrawList, getRewardList, getOrderList } = this.props;

    return (
      <React.Fragment>
        <BackHeadDiv onClick={() => history.push('/user-info')}>{i18nTxt('My Account')}</BackHeadDiv>
        <Wrapper>
          <h1>{i18nTxt('History')}</h1>

          <s2.TabDiv>
            <div className="tab-s">
              <button
                onClick={() => {
                  updateHistory({
                    activeTab: 'rewards',
                  });
                }}
                type="button"
                className={cx('tab-item', {
                  'tab-item-active': accountHistory.activeTab === 'rewards',
                })}
              >
                {i18nTxt('Bounty Rewards')}
              </button>
              <button
                onClick={() => {
                  updateHistory({
                    activeTab: 'withdraws',
                  });
                }}
                type="button"
                className={cx('tab-item', {
                  'tab-item-active': accountHistory.activeTab === 'withdraws',
                })}
              >
                {i18nTxt('Withdrawal')}
              </button>
              <button
                onClick={() => {
                  updateHistory({
                    activeTab: 'purchasing',
                  });
                }}
                type="button"
                className={cx('tab-item', {
                  'tab-item-active': accountHistory.activeTab === 'purchasing',
                })}
              >
                {i18nTxt('Purchasing')}
              </button>
            </div>
          </s2.TabDiv>

          <div
            style={{
              display: accountHistory.activeTab === 'rewards' ? 'block' : 'none',
            }}
            className="table-wrap"
          >
            <table>
              <tr>
                <th>{i18nTxt('Date')}</th>
                <th>{i18nTxt('Bounty')}</th>
                <th className="align-right">{i18nTxt('Amount')}</th>
              </tr>
              <tbody>
                {accountHistory.rewards.list.map(reward => {
                  let bountyInfo;
                  if (reward.info) {
                    bountyInfo = (
                      <a target="_blank" rel="noopener noreferrer" href={`/view-bounty?bountyId=${reward.info.bountyId}`}>
                        {reward.info.title}
                      </a>
                    );
                  } else if (reward.belongType === 'Checkin') {
                    bountyInfo = <span>{i18nTxt('CHECK IN')}</span>;
                  }

                  return (
                    <tr>
                      <td>{moment(reward.updatedAt || reward.createdAt).format('HH:mm MM/DD')}</td>
                      <td>{bountyInfo}</td>
                      <td className="align-right">+{reward.fansCoin} FC</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div
              style={{
                display: accountHistory.rewards.total > accountHistory.rewards.list.length ? 'block' : 'none',
              }}
              className="show-more"
            >
              <button
                onClick={() => {
                  getRewardList(accountHistory.rewards.page + 1);
                }}
                className="btn waves-effect waves-light default"
                type="button"
              >
                {i18nTxt('SHOW MORE')}
              </button>
            </div>

            {accountHistory.rewards.total === 0 && (
              <NoResult>
                <img src={noResult} alt="noresult" />
                <div>{i18nTxt('No data available')}</div>
              </NoResult>
            )}
          </div>

          <div
            style={{
              display: accountHistory.activeTab === 'withdraws' ? 'block' : 'none',
            }}
            className="table-wrap"
          >
            <table>
              <tr>
                <th>{i18nTxt('Date')}</th>
                <th>{i18nTxt('Amount')}</th>
                <th>{i18nTxt('Status')}</th>
                <th className="align-right">{i18nTxt('Action')}</th>
              </tr>
              <tbody>
                {accountHistory.withdraws.list.map(withdraw => {
                  // accountId: "5d19bc789f94562b3546d6b6"
                  // createdAt: "2019-07-04T12:27:05.760Z"
                  // fansCoin: 12
                  // id: "5d1df0995180d96ae071992f"
                  // status: "PENDING"
                  // txHash: null
                  // updatedAt: "2019-07-04T12:27:05.760Z"
                  // walletAddress: "asdad"
                  // _id: "5d1df0995180d96ae071992f"

                  return (
                    <tr key={withdraw.id}>
                      <td>{moment(withdraw.updatedAt || withdraw.createdAt).format('HH:mm MM/DD')}</td>
                      <td>{withdraw.fansCoin}</td>
                      <td>{getStatus(withdraw.status)}</td>
                      <td className="align-right">
                        {withdraw.txHash && (
                          <a
                            rel="noopener noreferrer"
                            target="_blank"
                            href={`https://confluxscan.io/${withdraw.txHash}`}
                            className="arrow-link"
                          >
                            <span>{i18nTxt('VIEW MORE')}</span>
                            <i className="material-icons dp48">chevron_right</i>
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div
              className="show-more"
              style={{
                display: accountHistory.withdraws.total > accountHistory.withdraws.list.length ? 'block' : 'none',
              }}
            >
              <button
                onClick={() => {
                  getWithdrawList(accountHistory.withdraws.page + 1);
                }}
                className="btn waves-effect waves-light default"
                type="button"
              >
                {i18nTxt('SHOW MORE')}
              </button>
            </div>
            {accountHistory.withdraws.total === 0 && (
              <NoResult>
                <img src={noResult} alt="noresult" />
                <div>{i18nTxt('No data available')}</div>
              </NoResult>
            )}
          </div>

          <div
            style={{
              display: accountHistory.activeTab === 'purchasing' ? 'block' : 'none',
            }}
            className="table-wrap"
          >
            <table>
              <tr>
                <th>{i18nTxt('Date')}</th>
                <th>{i18nTxt('Item')}</th>
                <th>{i18nTxt('Expense')}</th>
              </tr>
              <tbody>
                {accountHistory.orders.list.map(order => {
                  return (
                    <tr key={order.id}>
                      <td>{moment(order.createdAt).format('HH:mm MM/DD')}</td>
                      <td>{order.goods.name}</td>
                      <td className="order-cost">{`- ${order.costFansCoin} FC`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div
              className="show-more"
              style={{
                display: accountHistory.orders.total > accountHistory.orders.list.length ? 'block' : 'none',
              }}
            >
              <button
                onClick={() => {
                  getOrderList(accountHistory.orders.page + 1);
                }}
                className="btn waves-effect waves-light default"
                type="button"
              >
                {i18nTxt('SHOW MORE')}
              </button>
            </div>
            {accountHistory.orders.total === 0 && (
              <NoResult>
                <img src={noResult} alt="noresult" />
                <div>{i18nTxt('No data available')}</div>
              </NoResult>
            )}
          </div>
        </Wrapper>
      </React.Fragment>
    );
  }
}

AccountHistory.propTypes = {
  history: commonPropTypes.history.isRequired,
  accountHistory: PropTypes.objectOf({
    activeTab: PropTypes.string,
  }).isRequired,
  getOrderList: PropTypes.func.isRequired,
  getWithdrawList: PropTypes.func.isRequired,
  resetHistory: PropTypes.func.isRequired,
  updateHistory: PropTypes.func.isRequired,
  getRewardList: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    accountHistory: state.userInfo.accountHistory,
  };
}

export default connect(
  mapStateToProps,
  actions
)(AccountHistory);
