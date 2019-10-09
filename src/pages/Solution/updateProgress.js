import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as actions from './action';
import { StyledWrapper } from '../../globalStyles/common';
import * as s from '../Bounty/commonStyle';
import * as s1 from './commonStyle';
import BackHeadDiv from '../../components/BackHeadDiv';
import Message from '../../components/Message';
import { MILESTONE_STATUS_ENUM } from '../../constants';
import { getStatusMileStone, auth, commonPropTypes, renderAny, i18nTxt, downLink } from '../../utils';

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  .subject {
    font-weight: 500;
    margin-bottom: 20px;
  }
  h1 {
    font-size: 32px;
    line-height: 32px;
    margin: 0;
    padding: 0;
    margin-bottom: 40px;
  }
  .materialize-textarea {
    height: 80px;
    margin-top: 12px;
    padding: 20px 16px;
    font-size: 14px;
  }
  .success-icon {
    display: inline-block;
    margin-right: 12px;
    color: #59bf9c;
    vertical-align: middle;
  }
  .message-notice {
    margin-top: 40px;
    margin-bottom: 40px;
  }
  .review-result {
    line-height: 20px;
    font-size: 20px;
    color: #e76a25;
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

class UpdateProgress extends Component {
  constructor(...args) {
    super(...args);
    const { getMileStone, history, resetMileStone } = this.props;
    if (!auth.loggedIn()) {
      history.push('/signin');
      return;
    }
    if (history.action === 'PUSH') {
      resetMileStone();
    }

    getMileStone();
    document.title = i18nTxt('Update Progress');
  }

  render() {
    const { history, editMileStone, updateMileStoneStep, uploadFileMileStone, submitMileStone } = this.props;

    let editIndex = 0;
    editMileStone.list.some((milest, i) => {
      if (milest.status === MILESTONE_STATUS_ENUM.ONGOING) {
        editIndex = i;
        return true;
      }
      return false;
    });

    let isAllComplete = false;
    if (
      editMileStone.list.length > 0 &&
      editMileStone.list.length === editMileStone.list.filter(milest => milest.status === MILESTONE_STATUS_ENUM.FINISHED).length
    ) {
      isAllComplete = true;
    }

    return (
      <React.Fragment>
        <BackHeadDiv onClick={() => history.push('/my-submission')}>
          <Link to="/my-submission">{i18nTxt('My Submissions')} </Link>
        </BackHeadDiv>
        <Wrapper>
          {/* <h1>Update Progress</h1> */}
          <h1>
            {isAllComplete ? (
              <Fragment>
                <span className="success-icon"></span>
                <span>{i18nTxt('Submission Auditing!')}!</span>
              </Fragment>
            ) : (
              <h1>{i18nTxt('Update Progress')}</h1>
            )}
          </h1>

          <div
            style={{
              display: isAllComplete ? 'block' : 'none',
            }}
          >
            <Message type="message-notice">{i18nTxt('We will assign the rewards after having finished the Bounty.')}</Message>
          </div>

          <div className="subject">{i18nTxt('Milestone')}:</div>
          <div className="miltstone-wrap">
            {editMileStone.list.map((milest, index) => {
              const attachList = milest.attachmentList || [];

              let detailDiv;
              if (milest.status === MILESTONE_STATUS_ENUM.PENDING || milest.status === MILESTONE_STATUS_ENUM.ONGOING) {
                if (index === editIndex) {
                  detailDiv = (
                    <Fragment>
                      <textarea
                        onChange={e => {
                          updateMileStoneStep(
                            {
                              proof: e.target.value,
                              proofErr: '',
                            },
                            index
                          );
                        }}
                        value={milest.proof}
                        className={`materialize-textarea ${milest.proofErr ? 'invalid' : ''}`}
                        placeholder={i18nTxt('Proof of progress…')}
                      />

                      {milest.proofErr && <span className="helper-text" data-error={i18nTxt(milest.proofErr)}></span>}

                      {renderAny(() => {
                        if (milest.redoMessage) {
                          return (
                            <Fragment>
                              <s1.StatusTagDiv className="EXPIRED" style={{ marginTop: 20 }}>
                                {getStatusMileStone('PENDING')}
                              </s1.StatusTagDiv>
                              <div className="review-result">{i18nTxt('Admin comments')}</div>
                              <div className="message message-important-light" style={{ marginBottom: 20 }}>
                                <span>{milest.redoMessage}</span>
                              </div>
                            </Fragment>
                          );
                        }
                        return null;
                      })}

                      <div className="clearfix">
                        <div style={{ cssFloat: 'left' }}>
                          <s.AttachmentDiv>
                            {attachList.map(v => {
                              const removeFile = () => {
                                const attachmentListCopy = attachList.slice();
                                const curIndex = attachmentListCopy.indexOf(v);
                                attachmentListCopy.splice(curIndex, 1);
                                updateMileStoneStep(
                                  {
                                    attachmentList: attachmentListCopy,
                                  },
                                  index
                                );
                              };
                              return (
                                <div className="attachment-line">
                                  {downLink(v.url, v.title)}
                                  <button className="material-icons dp48" onClick={removeFile} type="button">
                                    cancel
                                  </button>
                                </div>
                              );
                            })}

                            <label className="add-attachment" htmlFor="bounty-add-attachment">
                              <i className="material-icons">add</i>
                              <span>{i18nTxt('Attachments')}</span>
                              <input
                                id="bounty-add-attachment"
                                type="file"
                                onChange={e => {
                                  uploadFileMileStone(e, index);
                                }}
                              />
                            </label>
                          </s.AttachmentDiv>
                        </div>

                        <div style={{ cssFloat: 'right' }}>
                          <button
                            onClick={() => {
                              submitMileStone({ milestoneId: milest.id });
                            }}
                            className="btn waves-effect waves-light primary"
                            type="button"
                          >
                            {i18nTxt('SUBMIT FOR REVIEW')}
                          </button>
                        </div>
                      </div>
                    </Fragment>
                  );
                }
              } else {
                detailDiv = (
                  <Fragment>
                    <p>{milest.proof}</p>
                    <s.AttachmentDiv>
                      {attachList.map(v => {
                        return <div className="attachment-line">{downLink(v.url, v.title)}</div>;
                      })}
                    </s.AttachmentDiv>
                    <s1.StatusTagDiv className={milest.status} style={{ marginTop: 20 }}>
                      {getStatusMileStone(milest.status)}
                    </s1.StatusTagDiv>
                  </Fragment>
                );
              }

              return (
                <s1.MileStoneProgress>
                  <div className="milestone-step">{s1.stepBoxLine(milest.status, index, editMileStone.list.length)}</div>

                  <div className="milestone-right">
                    <div className="duration">
                      {milest.duration} {milest.duration > 1 ? i18nTxt('days') : i18nTxt('day')}
                    </div>
                    <h5>{milest.title}</h5>
                    <p>{milest.description}</p>
                    {detailDiv}
                  </div>
                </s1.MileStoneProgress>
              );
            })}
          </div>
        </Wrapper>
      </React.Fragment>
    );
  }
}

UpdateProgress.propTypes = {
  history: commonPropTypes.history.isRequired,
  getMileStone: PropTypes.func.isRequired,
  editMileStone: PropTypes.func.isRequired,
  updateMileStoneStep: PropTypes.func.isRequired,
  uploadFileMileStone: PropTypes.func.isRequired,
  submitMileStone: PropTypes.func.isRequired,
  resetMileStone: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    editMileStone: state.solution.editMileStone,
  };
}

export default connect(
  mapStateToProps,
  actions
)(UpdateProgress);
