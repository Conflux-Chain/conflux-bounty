import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import cx from 'classnames';
import * as actions from './action';
import { StyledWrapper } from '../../globalStyles/common';
import BackHeadDiv from '../../components/BackHeadDiv';
import * as s2 from './commonStyle';
import Modal from '../../components/Modal';
import { fmtToDay, auth, commonPropTypes, getStatus, i18nTxt } from '../../utils';
import BountyDeletedWarning from '../../components/BountyDeletedWarning';

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
    margin-top: 40px;
    .align-right {
      text-align: right;
    }
    .align-right button:hover {
      text-decoration: underline;
      cursor: pointer;
    }
    th {
      font-weight: normal;
      color: #8e9394;
    }
    td {
      color: #171d1f;
    }
    tr:first-child {
      border-top: 1px solid #ebeded;
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
    .like-title {
      font-size: 16px;
      line-height: 16px;
      color: #000000;
      font-weight: 500;
    }
    .like-sub {
      margin-top: 4px;
      > span {
        font-size: 14px;
        margin-right: 12px;
      }
    }
    .like-state {
      font-weight: 500;
    }
    .arrow-link {
      > span,
      > i {
        vertical-align: middle;
      }
    }
    .arrow-link.disabled {
      cursor: default;
      pointer-events: none;
    }
  }
  .like-subm-from {
    color: #999;
  }
`;

const Confirm = styled.div`
  padding: 20px;
  > div {
    width: 240px;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: rgba(0, 0, 0, 0.12) 2px 4px 20px;
  }
  p {
    font-size: 20px;
    line-height: 20px;
    color: #171d1f;
    margin: 0;
    font-weight: 500;
  }
  .confirm-actions {
    text-align: right;
    margin-top: 20px;
  }
  .confirm-actions > button {
    outline: none;
    border: none;
    cursor: pointer;
    color: #595f61;
    padding-left: 5px;
    padding-right: 5px;
    font-size: 16px;
    &:focus {
      background: none;
    }
  }
  .confirm-actions .agree {
    margin-left: 20px;
    color: #22b2d6;
  }
`;

// eslint-disable-next-line react/prefer-stateless-function
class MyLikes extends Component {
  constructor(...args) {
    super(...args);

    const { myLike, resetMyLike, history, getMyBounty, getMySolution, updateMyLike } = this.props;
    if (!auth.loggedIn()) {
      history.push('/signin');
      return;
    }

    const getdata = async () => {
      await getMyBounty(1);
      await getMySolution(1);

      updateMyLike({
        initDataFetched: true,
      });
    };

    if (history.action === 'PUSH') {
      resetMyLike();
      getdata();
    } else if (myLike.initDataFetched === false) {
      getdata();
    }
    document.title = i18nTxt('My Likes');
    this.removeLike = () => {};
  }

  showConfirm = () => {
    const { myLike, updateMyLike } = this.props;
    if (myLike.showRemoveDialog) {
      return;
    }
    updateMyLike({
      showRemoveDialog: true,
    });
  };

  cancelConfirm = () => {
    const { updateMyLike } = this.props;
    updateMyLike({
      showRemoveDialog: false,
    });
  };

  render() {
    const {
      history,
      myLike,
      updateMyLike,
      updateMyLikeBounty,
      updateMyLikeSolution,
      delLikeBounty,
      delLikeSolution,
      getMyBounty,
      getMySolution,
    } = this.props;

    return (
      <React.Fragment>
        <BackHeadDiv onClick={() => history.push('/user-info')}>
          {' '}
          <Link to="/user-info">{i18nTxt('My Account')}</Link>
        </BackHeadDiv>
        <Wrapper>
          <h1>{i18nTxt('My Likes')}</h1>

          <s2.TabDiv>
            <div className="tab-s">
              <button
                onClick={() => {
                  updateMyLike({
                    activeTab: 'bounty',
                  });
                }}
                type="button"
                className={cx('tab-item', {
                  'tab-item-active': myLike.activeTab === 'bounty',
                })}
              >
                {i18nTxt('mylikes.Bounties')}
              </button>
              <button
                onClick={() => {
                  updateMyLike({
                    activeTab: 'solution',
                  });
                }}
                type="button"
                className={cx('tab-item', {
                  'tab-item-active': myLike.activeTab === 'solution',
                })}
              >
                {i18nTxt('Submissions')}
              </button>
            </div>
          </s2.TabDiv>

          <div
            className="table-wrap"
            style={{
              display: myLike.activeTab === 'bounty' ? 'block' : 'none',
            }}
          >
            <table>
              <tbody>
                {myLike.bounty.list.map((bounty, index) => {
                  const showConfirm = () => {
                    this.showConfirm();
                    this.removeLike = () => {
                      delLikeBounty(bounty.id).then(() => {
                        const bountyList = myLike.bounty.list.slice();
                        bountyList.splice(index, 1);
                        updateMyLikeBounty({
                          list: bountyList,
                          total: myLike.bounty.total - 1,
                        });
                        updateMyLike({
                          showRemoveDialog: false,
                        });
                      });
                    };
                  };
                  return (
                    <tr>
                      <td>
                        <div className="like-title">{bounty.title}</div>
                        <div className="like-sub">
                          <span style={{ color: '#666' }}>{fmtToDay(bounty.createdAt)}</span>
                          <span className="like-state">{getStatus(bounty.status)}</span>
                          {bounty.transDeleted && <BountyDeletedWarning />}
                        </div>
                      </td>
                      <td className="align-right">
                        <button type="button" onClick={showConfirm}>
                          {i18nTxt('REMOVE')}
                        </button>
                      </td>
                      <td className="align-right">
                        <Link
                          to={`/view-bounty?bountyId=${bounty.id}&language=${bounty.createdSiteLang}`}
                          className={`arrow-link ${bounty.transDeleted ? 'disabled' : ''}`}
                          onClick={e => {
                            if (bounty.transDeleted) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <span>{i18nTxt('VIEW MORE')}</span>
                          <i className="material-icons dp48">chevron_right</i>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div
              className="show-more"
              style={{
                visibility: myLike.bounty.total > myLike.bounty.list.length ? 'visible' : 'hidden',
              }}
            >
              <button
                onClick={() => {
                  getMyBounty(myLike.bounty.page + 1);
                }}
                className="btn waves-effect waves-light default"
                type="button"
              >
                {i18nTxt('SHOW MORE')}
              </button>
            </div>
          </div>

          <div
            className="table-wrap"
            style={{
              display: myLike.activeTab === 'solution' ? 'block' : 'none',
            }}
          >
            <table>
              <tbody>
                {myLike.solution.list.map((solution, index) => {
                  const showConfirm = () => {
                    this.showConfirm();
                    this.removeLike = () => {
                      delLikeSolution(solution.id).then(() => {
                        const solutionList = myLike.solution.list.slice();
                        solutionList.splice(index, 1);
                        updateMyLikeSolution({
                          list: solutionList,
                          total: myLike.solution.total - 1,
                        });
                        updateMyLike({
                          showRemoveDialog: false,
                        });
                      });
                    };
                  };

                  return (
                    <tr>
                      <td>
                        <div className="like-title">{solution.title}</div>
                        <div className="like-sub">
                          <span style={{ color: '#666' }}>{fmtToDay(solution.createdAt)}</span>
                          <span className="like-state">{getStatus(solution.status)}</span>
                          <span className="like-subm-from">
                            {i18nTxt('Submission from')} {solution.user.nickname}
                          </span>
                          {solution.transDeleted && <BountyDeletedWarning />}
                        </div>
                      </td>
                      <td className="align-right">
                        <button type="button" onClick={showConfirm}>
                          {i18nTxt('REMOVE')}
                        </button>
                      </td>
                      <td className="align-right">
                        <Link
                          to={`/view-submission?submissionId=${solution.id}`}
                          className={`arrow-link ${solution.transDeleted ? 'disabled' : ''}`}
                          onClick={e => {
                            if (solution.transDeleted) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <span>{i18nTxt('VIEW MORE')}</span>
                          <i className="material-icons dp48">chevron_right</i>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div
              style={{
                visibility: myLike.solution.total > myLike.solution.list.length ? 'visible' : 'hidden',
              }}
              className="show-more"
            >
              <button
                onClick={() => {
                  getMySolution(myLike.solution.page + 1);
                }}
                className="btn waves-effect waves-light default"
                type="button"
              >
                {i18nTxt('SHOW MORE')}
              </button>
            </div>
          </div>

          <Modal show={myLike.showRemoveDialog} showOverlay={false}>
            <Confirm>
              <div style={{ textAlign: 'center' }}>
                <p>{i18nTxt('Sure to remove?')}</p>
                <div className="confirm-actions">
                  <button type="button" onClick={this.cancelConfirm}>
                    {i18nTxt('NO')}
                  </button>
                  <button
                    className="agree"
                    type="button"
                    onClick={() => {
                      this.removeLike();
                    }}
                  >
                    {i18nTxt('YES')}
                  </button>
                </div>
              </div>
            </Confirm>
          </Modal>
        </Wrapper>
      </React.Fragment>
    );
  }
}

MyLikes.propTypes = {
  history: commonPropTypes.history.isRequired,
  myLike: PropTypes.objectOf({
    activeTab: PropTypes.string,
  }).isRequired,
  resetMyLike: PropTypes.func.isRequired,
  updateMyLike: PropTypes.func.isRequired,
  updateMyLikeBounty: PropTypes.func.isRequired,
  updateMyLikeSolution: PropTypes.func.isRequired,
  delLikeBounty: PropTypes.func.isRequired,
  delLikeSolution: PropTypes.func.isRequired,
  getMyBounty: PropTypes.func.isRequired,
  getMySolution: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    myLike: state.userInfo.myLike,
  };
}

export default connect(
  mapStateToProps,
  actions
)(MyLikes);
