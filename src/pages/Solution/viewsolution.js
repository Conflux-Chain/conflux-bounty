import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import get from 'lodash/get';
import * as actions from './action';
import { commonPropTypes, renderAny, getStatusMileStone, htmlsafe, i18nTxt, downLink } from '../../utils';
import { StyledWrapper } from '../../globalStyles/common';
// import Input from '../../components/Input';
import Message from '../../components/Message';
import PhotoImg from '../../components/PhotoImg';
import * as s from '../Bounty/commonStyle';
import * as s1 from './commonStyle';
import BackHeadDiv from '../../components/BackHeadDiv';
import imgGoLeft from '../../assets/iconfont/go-left.svg';
import imgGoRight from '../../assets/iconfont/go-right.svg';
import UserBack from '../../assets/iconfont/user-back.svg';
import { updateShare } from '../../components/Share/action';

import { SOLUTION_STATUS_ENUM, MILESTONE_STATUS_ENUM, BOUNTY_STATUS_ENUM } from '../../constants';
import dashedback from '../../assets/iconfont/background-dashed.svg';
import ModalComp from '../../components/Modal';

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  padding: 40px;
  .head {
    display: flex;
    align-items: center;
    h1 {
      flex: 1;
      font-size: 32px;
      color: #171d1f;
      margin: 0;
      padding: 0;
    }
  }
  .solution-head-list {
    display: flex;
    margin-top: 60px;
  }
  .solution-head-content {
    flex: 1;
    display: inline-block;
    text-align: center;
    .img-wrap {
      width: 80px;
      height: 80px;
      margin-right: 0;
    }
    > .solution-user {
      margin-left: 17px;
      display: inline-block;
      vertical-align: middle;
      .message-success {
        padding: 8px 12px;
        margin-top: 4px;
        > .material-icons {
          font-size: 28px;
        }
        > span {
          font-size: 14px;
          width: 90px;
        }
      }
    }
  }
  .solution-dots {
    margin-top: 40px;
    margin-bottom: 40px;
    text-align: center;
    .solution-dot {
      margin-left: 6px;
      margin-right: 6px;
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #d8dddf;
      cursor: pointer;
    }
    .solution-dot-active {
      background: #595f61;
      cursor: default;
    }
  }
  .more-icon {
    vertical-align: middle;
    font-size: 14px;
    color: rgb(216, 221, 223);
  }
  .subject {
    font-weight: 500;
    margin-bottom: 20px;
  }
  .solution-detail {
    margin-bottom: 40px;
    overflow: auto;
    > pre {
      white-space: pre-wrap;
    }
  }
  .attachment-line {
    font-size: 14px;
  }
  .solution-user-cfx {
    background: #4a9e81;
    color: #fff;
    font-size: 24px;
    line-height: 44px;
    padding-left: 12px;
    padding-right: 12px;
    font-weight: bold;
    align-item: center;
  }

  .trans-line {
    position: relative;
  }
  .trans-line::before {
    content: '';
    height: 1px;
    width: 100%;
    background: #d7dddf;
    position: absolute;
    top: 50%;
  }
  .translate-btn {
    position: relative;
    cursor: pointer;
    width: 150px;
    background: #fff;
    z-index: 2;
    border: 1px solid #d7dddf;
    box-sizing: border-box;
    border-radius: 18px;
    height: 36px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    > span {
      font-size: 16px;
      margin-left: 8px;
      color: #22b2d6;
    }
    > i {
      color: #22b2d6;
      font-size: 16px;
    }
  }
  .translate-sep {
    display: flex;
    align-items: center;
    > span {
      color: #a770ee;
      margin-right: 10px;
    }
    > i {
      flex: 1;
      height: 2px;
      background: url(${dashedback});
      background-size: cover;
      background-repeat: repeat-x;
    }
  }
`;

const AddNoticeDiv = styled.div`
  width: 100%;
  height: 60px;
  background: #3b3d3d;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -40px;
  margin-bottom: 40px;
  > span {
    color: #fff;
    margin-right: 20px;
  }
`;

const EditNotePanel = styled.div`
  background: #fff;
  box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  padding: 20px;
  width: 400px;
  position: relative;
  h5 {
    padding-top: 6px;
    margin: 0;
    font-size: 20px;
    line-height: 20px;
    color: #171d1f;
    padding-bottom: 20px;
  }
  textarea {
    height: 200px;
    margin-bottom: 20px;
  }
  > .btn {
    width: 100%;
  }
  > .close {
    position: absolute;
    color: #8e9394;
    font-weight: 500;
    top: 23px;
    right: 10px;
    font-style: normal;
    font-weight: bold;
    cursor: pointer;
    outline: none;
  }
`;

// eslint-disable-next-line react/prefer-stateless-function
class ViewSolution extends Component {
  constructor(...args) {
    super(...args);
    const { history, resetView } = this.props;

    if (history.action === 'PUSH') {
      resetView();
    }
    this.getInitData();
  }

  getInitData = () => {
    const { getSolutionView, submissionId, getLike, updateView } = this.props;
    updateView({
      addTranslate: false,
      descriptionTranslated: '',
      milestoneListTraqnslated: [],
    });
    getSolutionView(submissionId);
    getLike(submissionId);
  };

  transSubmission = () => {
    const { freshSubmissionDesc, submissionId, common } = this.props;
    freshSubmissionDesc({
      submissionId,
      language: common.lang,
    });
  };

  renderAddNote() {
    const { updateView, viewSolution, submitNote, user } = this.props;
    const { showEditNoteMsg } = viewSolution;

    let AddSDiv;
    if (user.id === viewSolution.user.id) {
      AddSDiv = (
        <AddNoticeDiv>
          <span>{i18nTxt('You can add additional contents to your submission.')}</span>
          <button
            className="btn waves-effect waves-light primary"
            type="button"
            onClick={() => {
              updateView({
                showEditNoteMsg: true,
              });
            }}
          >
            {i18nTxt('ADD')}
          </button>
        </AddNoticeDiv>
      );
    }
    const closeNotePanel = () => {
      updateView({
        showEditNoteMsg: false,
      });
    };

    const editNoteMsgDiv = (
      <ModalComp show onEsc={closeNotePanel}>
        <EditNotePanel>
          <button className="material-icons close" onClick={closeNotePanel} type="button">
            close
          </button>
          <h5>{i18nTxt('Add additional contents')}</h5>
          <div>
            <textarea
              className={cx('materialize-textarea')}
              onChange={e => {
                updateView({
                  addNoteTxt: e.target.value,
                });
              }}
              placeholder={i18nTxt('Tell us what to be added to your submission...')}
            ></textarea>
          </div>
          <button
            className="btn waves-effect waves-light primary"
            type="button"
            onClick={() => {
              submitNote();
            }}
          >
            {i18nTxt('SUBMIT')}
          </button>
        </EditNotePanel>
      </ModalComp>
    );

    return (
      <Fragment>
        {AddSDiv}
        {showEditNoteMsg && editNoteMsgDiv}
      </Fragment>
    );
  }

  render() {
    const { props } = this;
    const { history, renderReward } = this.props;
    const { sendLike, viewSolution, submissionId, from, headDiv } = props;

    let curIndex = -1;
    let listDiv;
    if (viewSolution.solutionList.length > 1) {
      listDiv = [];
      viewSolution.solutionList.forEach((solution, index) => {
        if (solution.id === submissionId) {
          curIndex = index;
          listDiv.push(<i className="solution-dot solution-dot-active" data-solutionId={solution.id}></i>);
          return;
        }

        const gotoCurSolution = () => {
          history.push(`/view-submission?submissionId=${solution.id}`);
          setTimeout(this.getInitData);
        };
        /* eslint jsx-a11y/no-static-element-interactions: 0 */
        /* eslint jsx-a11y/click-events-have-key-events: 0 */
        listDiv.push(<i onClick={gotoCurSolution} className="solution-dot" data-solutionId={solution.id}></i>);
      });
    }

    const maxShow = 22;
    if (viewSolution.solutionList.length > maxShow && curIndex !== -1) {
      const listNew = [<i className="solution-dot solution-dot-active"></i>];
      let looping = true;
      let beforeIndex = curIndex - 1;
      let afterIndex = curIndex + 1;
      while (looping) {
        if (beforeIndex > 0) {
          listNew.unshift(listDiv[beforeIndex]);
          beforeIndex -= 1;
        }

        if (afterIndex < viewSolution.solutionList.length - 1) {
          listNew.push(listDiv[afterIndex]);
          afterIndex += 1;
        }

        if (listNew.length >= maxShow) {
          looping = false;
        }
      }

      if (beforeIndex > 0) {
        listNew.unshift(<i className="more-icon material-icons dp48">more_horiz</i>);
      }
      if (afterIndex < viewSolution.solutionList.length - 1) {
        listNew.push(<i className="more-icon material-icons dp48">more_horiz</i>);
      }
      listDiv = listNew;
    }

    const hDiv = headDiv || (
      <BackHeadDiv onClick={() => history.push(`/view-bounty?bountyId=${viewSolution.bountyId}`)}>
        <span>{viewSolution.bounty && viewSolution.bounty.title}</span>
      </BackHeadDiv>
    );

    return (
      <React.Fragment>
        {this.renderAddNote()}
        {hDiv}
        <Wrapper>
          <div className="head">
            <h1>{i18nTxt('Submissions')}</h1>

            <div className="head-right">
              <s.LikeAndShare>
                <button
                  type="button"
                  onClick={() => {
                    sendLike(submissionId, viewSolution.isLike ? 'del' : 'add');
                  }}
                >
                  <i className={cx('material-icons dp48', { like: viewSolution.isLike })}>grade</i>
                  {viewSolution.likeNumber > 0 ? <span>{viewSolution.likeNumber}</span> : null}
                  <span>{viewSolution.likeNumber > 1 ? i18nTxt('Likes') : i18nTxt('Like')}</span>
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
            </div>
          </div>

          {renderReward()}

          <div className="solution-head-list">
            {renderAny(() => {
              if (from === 'mysubmission') {
                return null;
              }
              if (viewSolution.status === SOLUTION_STATUS_ENUM.PENDING) {
                return null;
              }
              if (curIndex === 0 || curIndex === -1) {
                return (
                  <img
                    style={{
                      opacity: 0.6,
                    }}
                    src={imgGoLeft}
                    alt="imggoleft"
                  />
                );
              }
              return (
                <Link
                  onClick={() => {
                    setTimeout(this.getInitData);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  to={`/view-submission?submissionId=${get(viewSolution, ['solutionList', curIndex - 1, 'id'])}`}
                >
                  <img
                    style={{
                      opacity: curIndex === 0 ? 0.6 : 1,
                    }}
                    src={imgGoLeft}
                    alt="imggoleft"
                  />
                </Link>
              );
            })}
            <div className="solution-head-content">
              <PhotoImg className="img-wrap" imgSrc={viewSolution.user.photoUrl || UserBack} />
              {renderAny(() => {
                if (viewSolution.status === SOLUTION_STATUS_ENUM.PENDING) {
                  return null;
                }
                if (viewSolution.status === SOLUTION_STATUS_ENUM.FINISHED && viewSolution.bounty.status === BOUNTY_STATUS_ENUM.FINISHED) {
                  return (
                    <span className="solution-user">
                      <div
                        style={{
                          fontWeight: 500,
                          textAlign: 'left',
                          color: '#171D1F',
                          marginBottom: 5,
                        }}
                      >
                        {' '}
                        {viewSolution.user.nickname}
                      </div>
                      <div className="solution-user-cfx">
                        <span>+{get(viewSolution, ['reward', 'fansCoin'], 0)}</span>
                        <span style={{ fontSize: 16, marginLeft: 3 }}>FC</span>
                      </div>
                    </span>
                  );
                }
                if (viewSolution.status === SOLUTION_STATUS_ENUM.AUDITING) {
                  return (
                    <span className="solution-user">
                      <div> {viewSolution.user.nickname}</div>
                      <Message type="message-success"> {i18nTxt('Submission Auditing!')} </Message>
                    </span>
                  );
                }
                return null;
              })}
            </div>

            {renderAny(() => {
              if (from === 'mysubmission') {
                return null;
              }
              if (curIndex === viewSolution.solutionList.length - 1 || curIndex === -1) {
                return (
                  <img
                    style={{
                      opacity: 0.6,
                    }}
                    src={imgGoRight}
                    alt="imggoright"
                  />
                );
              }

              return (
                <Link
                  onClick={() => {
                    setTimeout(this.getInitData);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  to={`/view-submission?submissionId=${get(viewSolution, ['solutionList', curIndex + 1, 'id'])}`}
                >
                  <img
                    style={{
                      opacity: 1,
                    }}
                    src={imgGoRight}
                    alt="imgGoRight"
                  />
                </Link>
              );
            })}
          </div>

          {renderAny(() => {
            return <div className="solution-dots">{listDiv}</div>;
          })}

          <div className="trans-line">
            <button onClick={this.transSubmission} type="button" className="translate-btn">
              <i className="trans-language"></i>
              <span>{i18nTxt('TRANSLATE')}</span>
            </button>
          </div>

          <div className="subject">{i18nTxt('Details of submission')}:</div>

          <div className="solution-detail">
            <pre dangerouslySetInnerHTML={{ __html: htmlsafe(viewSolution.description) }}></pre>
            {renderAny(() => {
              if (viewSolution.addTranslate) {
                return (
                  <Fragment>
                    <div className="translate-sep">
                      <span>{i18nTxt('Translate')}: </span>
                      <i></i>
                    </div>
                    <pre dangerouslySetInnerHTML={{ __html: htmlsafe(viewSolution.descriptionTranslated) }}></pre>
                  </Fragment>
                );
              }
              return null;
            })}
          </div>

          {renderAny(() => {
            if (viewSolution.note && viewSolution.note.status === 'APPROVED') {
              return (
                <div>
                  <div className="subject">{i18nTxt('Added Contents')}:</div>
                  <div className="solution-detail">{viewSolution.note.description}</div>
                </div>
              );
            }
            return null;
          })}

          {renderAny(() => {
            let msgDiv;
            if (viewSolution.bounty.status === BOUNTY_STATUS_ENUM.AUDITING) {
              msgDiv = (
                <div style={{ marginBottom: 40 }}>
                  <Message type="message-notice">{i18nTxt('We will assign the rewards after having finished the Bounty.')}</Message>
                </div>
              );
            }
            return msgDiv;
          })}

          {renderAny(() => {
            if (viewSolution.attachmentList.length) {
              return (
                <div>
                  <div className="subject" style={{ marginBottom: 0 }}>
                    {i18nTxt('Attachments')}:
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <s.AttachmentDiv>
                      {viewSolution.attachmentList.map(v => {
                        return <div className="attachment-line">{downLink(v.url, v.title)}</div>;
                      })}
                    </s.AttachmentDiv>
                  </div>
                </div>
              );
            }
            return null;
          })}

          <div className="subject">{i18nTxt('Milestone')}:</div>

          <div className="miltstone-wrap">
            {renderAny(() => {
              return viewSolution.milestoneList.map((milest, index) => {
                let approveDiv;
                if (
                  milest.status === MILESTONE_STATUS_ENUM.ONGOING ||
                  milest.status === MILESTONE_STATUS_ENUM.AUDITING ||
                  milest.status === MILESTONE_STATUS_ENUM.FINISHED
                ) {
                  approveDiv = (
                    <s1.StatusTagDiv className={milest.status} style={{ marginTop: 20 }}>
                      {getStatusMileStone(milest.status)}
                    </s1.StatusTagDiv>
                  );
                }
                const attachList = milest.attachmentList || [];

                return (
                  <s1.MileStoneProgress>
                    <div className="milestone-step">{s1.stepBoxLine(milest.status, index, viewSolution.milestoneList.length)}</div>

                    <div className="milestone-right">
                      <div className="duration">
                        {milest.duration} {milest.duration > 1 ? i18nTxt('days') : i18nTxt('day')}
                      </div>
                      <h5>{milest.title}</h5>
                      <p dangerouslySetInnerHTML={{ __html: htmlsafe(milest.description) }}></p>
                      <p>{milest.proof}</p>
                      <s.AttachmentDiv>
                        {attachList.map(v => {
                          return <div className="attachment-line">{downLink(v.url, v.title)}</div>;
                        })}
                      </s.AttachmentDiv>
                      {renderAny(() => {
                        if (viewSolution.addTranslate) {
                          const milestTrans = viewSolution.milestoneListTraqnslated[index];
                          return (
                            <Fragment>
                              <div className="translate-sep">
                                <span>{i18nTxt('Translate')}: </span>
                                <i></i>
                              </div>
                              <h5>{milestTrans.title}</h5>
                              <p dangerouslySetInnerHTML={{ __html: htmlsafe(milestTrans.description) }}></p>
                              <p>{milestTrans.proof}</p>
                            </Fragment>
                          );
                        }
                        return null;
                      })}
                      {approveDiv}
                    </div>
                  </s1.MileStoneProgress>
                );
              });
            })}
          </div>
        </Wrapper>
      </React.Fragment>
    );
  }
}

ViewSolution.propTypes = {
  history: commonPropTypes.history.isRequired,
  getSolutionView: PropTypes.func.isRequired,
  submissionId: PropTypes.string.isRequired,
  getLike: PropTypes.func.isRequired,
  resetView: PropTypes.func.isRequired,
  freshSubmissionDesc: PropTypes.func.isRequired,
  updateView: PropTypes.func.isRequired,
  common: PropTypes.objectOf({
    lang: PropTypes.string,
  }).isRequired,
  renderReward: PropTypes.func,
  viewSolution: PropTypes.objectOf({
    user: PropTypes.objectOf({
      id: PropTypes.string,
    }),
  }).isRequired,
  submitNote: PropTypes.string.isRequired,
  user: PropTypes.objectOf({
    id: PropTypes.string,
  }).isRequired,
};

ViewSolution.defaultProps = {
  renderReward: () => {},
};

function mapStateToProps(state) {
  return {
    common: state.common,
    user: state.head.user,
    viewSolution: state.solution.viewSolution,
  };
}

export default connect(
  mapStateToProps,
  {
    ...actions,
    updateShare,
  }
)(ViewSolution);
