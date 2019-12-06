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
import { auth, commonPropTypes, getStatus, i18nTxt } from '../../utils';
import BountyDeletedWarning from '../../components/BountyDeletedWarning';
import NoResult from '../../components/NoResult';
import media from '../../globalStyles/media';
import unitParser from '../../utils/device';

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
      &:first-child {
        white-space: nowrap;
      }
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
      font-weight: bold;
    }
    .order-reward {
      color: #4a9e81;
      font-weight: bold;
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
  ${media.mobile`
  h1 {
    font-size: ${unitParser(24)};
    line-height: ${unitParser(24)};
    margin-bottom: ${unitParser(20)};
  }
  .table-wrap {
    margin-top:0;
    table {
      tr {
        font-size: ${unitParser(12)};
        line-height: ${unitParser(12)};
        th, td {
          padding: ${unitParser(20)} 0;
        }
        // date
        td:first-child {
          color: #8E9394;
        }
      }
    }
  }
`}
`;

const RewardsTableStyle = styled.table`
  ${media.mobile`
tr {
  td:last-child {
    font-weight: bold;
    font-size: ${unitParser(14)};
    line-height: ${unitParser(14)};
  }
}
`}
`;

const WithdrawalTableStyle = styled.table`
  ${media.mobile`
tr {
  td:nth-child(2) {
    font-weight: bold;
    font-size: ${unitParser(14)};
    line-height: ${unitParser(14)};
  }
}
`}
`;

const PurchasingTableStyle = styled.table`
  ${media.mobile`
tr {
  td:not(:first-child) {
    font-weight: bold;
    font-size: ${unitParser(14)};
    line-height: ${unitParser(14)};
  }
}
`}
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
            <RewardsTableStyle>
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
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`/view-bounty?bountyId=${reward.info.bountyId}&language=${reward.createdSiteLang}`}
                        onClick={e => {
                          if (reward.transDeleted) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {reward.info.title}
                        {reward.transDeleted && <BountyDeletedWarning />}
                      </a>
                    );
                  } else if (reward.belongType === 'Checkin') {
                    bountyInfo = <span>{i18nTxt('CHECK IN')}</span>;
                  } else if (reward.belongType === 'Activity') {
                    bountyInfo = <span>{i18nTxt('Activity Reward')}</span>;
                  } else if (reward.belongType === 'Community') {
                    bountyInfo = <span>{i18nTxt('Community Reward')}</span>;
                  }

                  return (
                    <tr>
                      <td>{moment(reward.createdAt).format('HH:mm MM/DD')}</td>
                      <td>{bountyInfo}</td>
                      <td className="align-right order-reward">+{reward.fansCoin} FC</td>
                    </tr>
                  );
                })}
              </tbody>
            </RewardsTableStyle>
            {accountHistory.rewards.total === 0 && <NoResult marginTop={40} />}
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
          </div>

          <div
            style={{
              display: accountHistory.activeTab === 'withdraws' ? 'block' : 'none',
            }}
            className="table-wrap"
          >
            <WithdrawalTableStyle>
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
                      <td>{moment(withdraw.createdAt).format('HH:mm MM/DD')}</td>
                      <td>{withdraw.fansCoin}</td>
                      <td>{getStatus(withdraw.status)}</td>
                      <td className="align-right">
                        {withdraw.txHash && (
                          <a
                            rel="noopener noreferrer"
                            target="_blank"
                            href={`https://confluxscan.io/transactionsdetail/${withdraw.txHash}`}
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
            </WithdrawalTableStyle>

            {accountHistory.withdraws.total === 0 && <NoResult marginTop={40} />}
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
          </div>

          <div
            style={{
              display: accountHistory.activeTab === 'purchasing' ? 'block' : 'none',
            }}
            className="table-wrap"
          >
            <PurchasingTableStyle>
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
                      <td className="order-cost" style={{ color: '#F0453A' }}>{`- ${order.costFansCoin} FC`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </PurchasingTableStyle>

            {accountHistory.orders.total === 0 && <NoResult marginTop={40} />}
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
