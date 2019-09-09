import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import moment from 'moment';
import * as actions from './action';
import { StyledWrapper, flexCenterMiddle } from '../../globalStyles/common';
import * as s from './commonStyle';
import BackHeadDiv from '../../components/BackHeadDiv';
import { i18nTxt, fmtToDay, getQuery, commonPropTypes, htmlsafe, notice, auth, getStatus, downLink, renderAny } from '../../utils';
import { getCategory } from '../../utils/api';
import { updateShare } from '../../components/Share/action';
import PhotoImg from '../../components/PhotoImg';
import UserBack from '../../assets/iconfont/user-back.svg';
import { BOUNTY_STATUS_ENUM } from '../../constants';
import ViewSolution from '../Solution/viewsolution';
import sortImg from '../../assets/iconfont/sort.svg';
import Tooltip from '../../components/Tooltip';

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  color: #171d1f;
  h1 {
    font-size: 32px;
    line-height: 32px;
    margin: 0;
    margin-bottom: 12px;
    font-weight: 500;
  }
  .bounty-status {
    font-size: 14px;
    color: #8e9394;
  }
  .bounty-category {
    overflow: auto;
    padding-top: 12px;
    > span {
      border: 1px solid #d7dddf;
      border-radius: 16px;
      height: 32px;
      margin-right: 8px;
      padding-left: 12px;
      padding-right: 12px;
      float: left;
      ${flexCenterMiddle}
    }
  }
  .reward {
    font-size: 20px;
    line-height: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .reward-rule {
    margin-top: 8px;
    font-size: 14px;
    line-height: 20px;
    color: #595f61;
  }
  .desc {
    margin-top: 12px;
    font-size: 14px;
    line-height: 20px;
    color: #595f61;
    white-space: pre-wrap;
  }
  .submission-sort-wrap {
    margin-bottom: 20px;
    margin-top: 20px;
    margin-left: -5px;
  }
  .submission-sort-item {
    color: #8E9394;
    cursor: pointer;
    > span, > img {
      vertical-align: middle;
    }
    > img {
      margin-left: 5px;
      height: 14px;
    }
    margin-right: 5px;
  }
  .solution-item-star {
    margin-left: 20px;
    display: flex;
    align-items: center;
    > i {
      font-size: 17px;
      margin-right: 2px;
    }
  }
  .solution-item-desc {
    padding-left: 8px;
    color: #595F61;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: block;
    padding-right: 20px;
  }

  .solution-list {
    margin-top: 12px;
  }
  .solution-item {
    border-top: 1px solid #ebeded;
    height: 54px;
    display: flex;
    align-items: center;
    color: #8E9394;
    > a {
      color: #22b2d6;
      > i {
        font-size: 16px;
        font-weight: 500;
        vertical-align: text-bottom;
      }
    }
  }
  .solution-item-left {
    flex-shrink: 0;
    > span {
      vertical-align: middle;
      color: #595F61;
      max-width: 50px;
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .withimg {
      width: 25px;
      height: 25px;
    }
  }
  .solution-item-descwrap {
    flex: 1;
    max-width: 300px;
    margin-left: 10px;
    line-height: 20px;
    padding-top: 3px;
    padding-bottom: 3px;
   :hover {
      background: #EBEDED;
      border-radius: 4px;
   }
   > span {
     width: 100%;
   }
  }
  .solution-item:last-of-type {
    border-bottom: 1px solid #ebeded;
  }

  .solution-bottom {
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &.comment {
    margin-top: 20px;
    > .btn {
      margin: auto;
      display: flex;
      margin-top: 20px;
    }
  }
  .comment-list {
    padding-top: 10px;
  }
  .comment-send {
    margin-top: 30px;
    display: flex;
    align-items: center;
    textarea {
      flex: 1;
      padding-top: 12px;
      padding-bottom: 12px;
      margin: 0;
    }
  }
  .comment-input-wrap {
    display: flex;
    border: 1px solid #BFC5C7;
    border-radius: 4px;
    margin-left: 12px;
    flex: 1;
    input {
      border: none;
      border-right: 1px solid #BFC5C7;
      margin-bottom: 0;
    }
    button {
      width: 100px;
      font-size: 14px;
      padding-left: 10px;
      padding-right: 10px
    }
  }
  .img-wrap {
    width: 44px;
    height: 44px;
  }
  .comment-time {
    float: right;
    font-size: 12px;
    color: #8e9394;
  }
  .comment-item:first-of-type {
    margin-top: 20px;j
  }
  .comment-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    .comment-msg {
      flex: 1;
      margin-left: 12px;
      padding: 15px;
      background: #f7f9fa;
      border-radius: 4px;
      > strong {
        margin-right: 5px;
        font-weight: 500;
      }
    }
  }

  .load-more-solution {
    margin-top: 20px;
    text-align: center;
  }
`;

const RewardDiv = styled.div`
  background: #4a9e81;
  text-align: center;
  display: block;
  padding-bottom: 6px;
  color: #fff;
  border-radius: 2px;
  margin-top: 20px;
  font-weight: 600;

  .line1 {
    padding-top: 10px;
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 8px;
  }
  .line2 {
    font-size: 16px;
    .fcBig {
      font-size: 24px;
      line-height: 24px;
      margin-right: 3px;
    }
  }
`;

// eslint-disable-next-line react/prefer-stateless-function
class ViewBounty extends Component {
  constructor(...args) {
    super(...args);
    const query = getQuery();
    this.query = query;
  }

  componentDidMount() {
    const { viewBounty, getBountyView, getLike, getCommentList, resetView, getSolutionList, history } = this.props;
    const getdata = () => {
      getBountyView();
      getLike();
      getCommentList(1);
      getSolutionList(1);
    };
    if (history.action === 'PUSH') {
      resetView();
      getdata();
    } else if (!viewBounty.description) {
      getdata();
    }
  }

  render() {
    const { props } = this;
    const { viewBounty, sendLike, updateView, sendComment, getCommentList, getSolutionList, user, history } = this.props;

    return (
      <React.Fragment>
        <BackHeadDiv onClick={() => history.push('/')}>
          <Link to="/">{i18nTxt('Bounties')}</Link>
        </BackHeadDiv>

        {renderAny(() => {
          if (viewBounty.status === BOUNTY_STATUS_ENUM.FINISHED) {
            const { rewardSubmissionList } = viewBounty;
            if (rewardSubmissionList && rewardSubmissionList.length > 0) {
              let maxFcSubmission = rewardSubmissionList[0];
              rewardSubmissionList.forEach(v => {
                if (v.reward) {
                  if (v.reward.fansCoin > maxFcSubmission.reward.fansCoin) {
                    maxFcSubmission = v;
                  }
                }
              });
              if (maxFcSubmission.reward) {
                const renderReward = () => {
                  return (
                    <RewardDiv>
                      <div className="line1">{i18nTxt('Total Bounty Reward')}</div>
                      <div className="line2">
                        <span className="fcBig">{viewBounty.totalRewardFansCoin}</span>
                        <span>FC</span>
                      </div>
                    </RewardDiv>
                  );
                };

                return (
                  <ViewSolution
                    renderReward={renderReward}
                    headDiv={<Fragment></Fragment>}
                    history={history}
                    submissionId={maxFcSubmission.id}
                  />
                );
              }
            }
          }
          return null;
        })}

        <Wrapper>
          <h1>{viewBounty.title}</h1>
          <div className="bounty-status">
            <span>{fmtToDay(viewBounty.updatedAt || viewBounty.createdAt)}</span>
            <span style={{ marginLeft: 20, color: '#595F61' }}>
              {i18nTxt('Status')}:<strong style={{ marginLeft: 2, fontWeight: 'bold' }}>{getStatus(viewBounty.status)}</strong>
            </span>
            <span style={{ marginLeft: 20 }}>
              {i18nTxt('by <%=nickname%>', {
                nickname: viewBounty.user && viewBounty.user.nickname,
              })}
            </span>
          </div>
          <div className="bounty-category">
            <span>{i18nTxt(viewBounty.cat1Name)}</span>
            <span>{i18nTxt(viewBounty.cat2Name)}</span>
          </div>
          <s.H2>{i18nTxt('Bounty')}:</s.H2>
          <div className="reward">
            {' '}
            {i18nTxt('Up to')} {viewBounty.fansCoin} FC
          </div>

          <div
            className="reward-rule"
            dangerouslySetInnerHTML={{
              __html: htmlsafe(viewBounty.rewardMessage),
            }}
          ></div>
          <s.H2>{i18nTxt('Description')}:</s.H2>
          <pre className="desc" dangerouslySetInnerHTML={{ __html: htmlsafe(viewBounty.description) }}></pre>
          <s.H2>{i18nTxt('Attachments')}:</s.H2>

          <div style={{ marginTop: 12 }}>
            <s.AttachmentDiv>
              {viewBounty.attachmentList.map(v => {
                return <div className="attachment-line">{downLink(v.url, v.title)}</div>;
              })}
            </s.AttachmentDiv>
          </div>

          <s.H2>
            {i18nTxt('Submissions')} ({viewBounty.solutionTotal}):
          </s.H2>

          <div className="solution-list">
            <div className="submission-sort-wrap">
              <button
                onClick={() => {
                  updateView({
                    sortType: '',
                  });
                  getSolutionList(1);
                }}
                type="button"
                className="submission-sort-item"
              >
                <span>{i18nTxt('Sort by Time')}</span>
                <img src={sortImg} className="sorticon" alt="sorticon" />
              </button>
              <button
                onClick={() => {
                  updateView({
                    sortType: 'like_desc',
                  });
                  getSolutionList(1);
                }}
                type="button"
                className="submission-sort-item"
              >
                <span>{i18nTxt('Sort by Likes')}</span>
                <img src={sortImg} className="sorticon" alt="sorticon" />
              </button>
            </div>

            {viewBounty.solutionList.map(solution => {
              return (
                <div className="solution-item">
                  <div className="solution-item-left">
                    <PhotoImg imgSrc={solution.user.photoUrl || UserBack} />
                    <span style={{ marginLeft: 10 }}>{solution.user.nickname}</span>
                  </div>

                  <div className="solution-item-star">
                    <i className={cx('material-icons dp48')}>grade</i>
                    <span>{solution.likeNumber}</span>
                  </div>

                  <div className="solution-item-descwrap">
                    <Tooltip direction="downWithSpan" tipSpan={<div className="solution-item-desc">{solution.description}</div>}>
                      <div>{solution.description}</div>
                    </Tooltip>
                  </div>

                  <Link to={`/view-submission?submissionId=${solution.id}`}>
                    <span>{i18nTxt('VIEW MORE')}</span>
                    <i className="material-icons dp48">chevron_right</i>
                  </Link>
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: viewBounty.solutionTotal > viewBounty.solutionList.length ? 'block' : 'none',
            }}
            className="load-more-solution"
          >
            <button
              onClick={() => {
                getSolutionList(viewBounty.solutionPage + 1);
              }}
              className="btn waves-effect waves-light default"
              type="button"
            >
              {i18nTxt('SHOW MORE')}
            </button>
          </div>

          <div className="solution-bottom">
            <s.LikeAndShare>
              <button
                type="button"
                onClick={() => {
                  sendLike(viewBounty.isLike ? 'del' : 'add');
                }}
              >
                <i className={cx('material-icons dp48', { like: viewBounty.isLike })}>grade</i>
                {viewBounty.likeNumber > 0 ? <span>{viewBounty.likeNumber}</span> : null}
                <span>{viewBounty.likeNumber > 1 ? i18nTxt('Likes') : i18nTxt('Like')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  props.updateShare({
                    show: true,
                    qrTxt: window.location.href,
                  });
                }}
              >
                <i className="share" />
                <span>{i18nTxt('Share')}</span>
              </button>
            </s.LikeAndShare>
            <Link
              style={{
                display: viewBounty.status === BOUNTY_STATUS_ENUM.OPEN ? 'block' : 'none',
              }}
              onClick={e => {
                if (auth.loggedIn() === false) {
                  notice.show({
                    type: 'message-notice',
                    content: i18nTxt('please login first'),
                    timeout: 3 * 1000,
                  });
                  e.preventDefault();
                }
              }}
              to={`/create-submission?bountyId=${this.query.bountyId}`}
              className="btn waves-effect waves-light primary"
              type="button"
            >
              {i18nTxt('Send my Submission')}
            </Link>
          </div>
        </Wrapper>

        <Wrapper className="comment">
          <h1>{i18nTxt('Comments')}</h1>
          <div className="comment-list">
            <div
              className="comment-send"
              // style={{
              //   display: user.id ? 'flex' : 'none',
              // }}
            >
              <PhotoImg imgSrc={user.photoUrl || UserBack} />
              <div className="comment-input-wrap">
                <input
                  placeholder={i18nTxt('Leave comments …')}
                  value={viewBounty.commentText}
                  onChange={e => {
                    updateView({
                      commentText: e.target.value,
                    });
                  }}
                  style={{ marginLeft: 12 }}
                />
                <button
                  type="button"
                  className="btn btnTextPrimary"
                  onClick={() => {
                    if (!user.id) {
                      notice.show({
                        type: 'message-notice',
                        content: i18nTxt('please login first'),
                        timeout: 3 * 1000,
                      });
                      return;
                    }
                    sendComment();
                  }}
                >
                  {i18nTxt('viewbounty.COMMENT')}
                </button>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              {viewBounty.commentList.map(comment => {
                const now = moment();
                const nowDiffTime = now.diff(comment.createdAt);
                let diffTime;
                if (nowDiffTime < 60 * 1000) {
                  diffTime = `${now.diff(comment.createdAt, 'second')} ${i18nTxt('seconds')}`;
                } else if (nowDiffTime < 60 * 60 * 1000) {
                  diffTime = `${now.diff(comment.createdAt, 'minutes')} ${i18nTxt('minutes')}`;
                } else if (nowDiffTime < 24 * 60 * 60 * 1000) {
                  diffTime = `${now.diff(comment.createdAt, 'hours')} ${i18nTxt('hours')}`;
                } else {
                  diffTime = `${now.diff(comment.createdAt, 'days')} ${i18nTxt('days')}`;
                }

                return (
                  <div className="comment-item">
                    <PhotoImg imgSrc={comment.user.photoUrl || UserBack} />
                    <div className="comment-msg">
                      <strong>{comment.user.nickname}:</strong>
                      <span>{comment.description} </span>
                      <span className="comment-time">{diffTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            style={{
              visibility: viewBounty.commentTotal > viewBounty.commentList.length ? 'visible' : 'hidden',
            }}
            onClick={() => {
              getCommentList('nextPage');
            }}
            className="btn waves-effect waves-light default"
            type="button"
          >
            {i18nTxt('SHOW MORE')}
          </button>
        </Wrapper>
      </React.Fragment>
    );
  }
}

const { func } = PropTypes;
ViewBounty.propTypes = {
  updateView: func.isRequired,
  getBountyView: func.isRequired,
  viewBounty: PropTypes.objectOf({
    title: PropTypes.string,
  }).isRequired,
  getLike: func.isRequired,
  sendLike: func.isRequired,
  resetView: func.isRequired,
  getSolutionList: func.isRequired,
  sendComment: func.isRequired,
  getCommentList: func.isRequired,
  user: PropTypes.objectOf({
    id: PropTypes.string,
  }).isRequired,
  history: commonPropTypes.history.isRequired,
};

function mapStateToProps(state) {
  const { viewBounty } = state.bounty;
  return {
    viewBounty,
    user: state.head.user,
  };
}

export default connect(
  mapStateToProps,
  {
    ...actions,
    getCategory,
    updateShare,
  }
)(ViewBounty);
