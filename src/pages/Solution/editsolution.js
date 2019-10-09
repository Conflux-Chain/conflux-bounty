import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import * as actions from './action';
import { StyledWrapper } from '../../globalStyles/common';
import Input from '../../components/Input';
import Message from '../../components/Message';
import ConfirmComp from '../../components/Modal/confirm';
import * as s from '../Bounty/commonStyle';
import * as s1 from './commonStyle';
import BackHeadDiv from '../../components/BackHeadDiv';
import { i18nTxt, commonPropTypes, getQuery, auth, getStatus, downLink, renderAny } from '../../utils';
import { SOLUTION_STATUS_ENUM } from '../../constants';

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  padding: 40px;
  h1 {
    font-size: 32px;
    margin: 0;
    margin-bottom: 35px;
  }
  .subject {
    margin-top: 20px;
    margin-bottom: 12px;
    font-weight: 500;
  }
  .category-wrap {
    display: flex;
  }
  .category-wrap-select {
    flex: 1;
  }
  .category-wrap-select:first-child {
    margin-right: 12px;
  }
  .materialize-textarea {
    height: 100px;
  }
  .bounty-title {
    background: #f7f9fa;
    border-radius: 4px;
    height: 44px;
    padding-left: 16px;
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }
  .add-step .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    float: left;
  }
  .remove-step {
    float: right;
    color: #595f61;
    font-size: 14px;
    cursor: pointer;
    margin-bottom: 20px;
  }
  .status-tips {
    margin-bottom: 40px;
  }
`;

// eslint-disable-next-line react/prefer-stateless-function
class EditSolution extends Component {
  constructor(...args) {
    super(...args);
    const { clearEdit, getBounty, getSolution, history, pageType } = this.props;

    if (!auth.loggedIn()) {
      history.push('/signin');
      return;
    }
    if (history.action === 'PUSH') {
      clearEdit();
    }
    if (pageType === 'edit') {
      getSolution().then(body => {
        document.title = i18nTxt(`Edit Submission`);
        getBounty(body.result.bountyId);
      });
    } else {
      getBounty(getQuery().bountyId);
      document.title = i18nTxt('Send Submission');
    }
  }

  render() {
    const { updateEdit, editSolution, updateEditMileStone, uploadFile, pageType, history, doSubmit } = this.props;

    const stxt = i18nTxt('Submission is');
    let statusDiv;
    if (editSolution.status === SOLUTION_STATUS_ENUM.REVIEWING) {
      statusDiv = (
        <div className="status-tips">
          <Message type="message-notice-light">
            {stxt} {getStatus(editSolution.status)}
          </Message>
        </div>
      );
    } else if (editSolution.status === SOLUTION_STATUS_ENUM.PENDING) {
      statusDiv = editSolution.redoMessage && (
        <div className="status-tips">
          <Message type="message-important">{editSolution.redoMessage}</Message>
        </div>
      );
    } else if (editSolution.status === SOLUTION_STATUS_ENUM.FINISHED) {
      statusDiv = (
        <div className="status-tips">
          <Message type="message-success">
            {stxt} {getStatus(editSolution.status)}
          </Message>
        </div>
      );
    } else if (editSolution.status === SOLUTION_STATUS_ENUM.EXPIRED) {
      statusDiv = (
        <div className="status-tips">
          <Message type="message-success">
            {stxt} {getStatus(editSolution.status)}
          </Message>
        </div>
      );
    } else if (editSolution.status) {
      statusDiv = (
        <div className="status-tips">
          <Message type="message-notice">
            {stxt} {getStatus(editSolution.status)}
          </Message>
        </div>
      );
    }

    return (
      <React.Fragment>
        <BackHeadDiv onClick={() => history.push(`/view-bounty?bountyId=${editSolution.bountyId}`)}>
          <Link to={`/view-bounty?bountyId=${editSolution.bountyId}`}>{editSolution.bountyTitle}</Link>
        </BackHeadDiv>
        <Wrapper>
          <h1>{i18nTxt('Send Submission')}</h1>
          {statusDiv}
          <div className="subject">{i18nTxt('Submission')}</div>
          <div>
            <span className="bounty-title">
              {i18nTxt('Bounty')}: {editSolution.bountyTitle}
            </span>
          </div>

          <textarea
            value={editSolution.description}
            onChange={e => {
              updateEdit({
                description: e.target.value,
                descriptionErrMsg: '',
              });
            }}
            className={cx('materialize-textarea', {
              invalid: editSolution.descriptionErrMsg,
            })}
            placeholder={i18nTxt('* Describe your submission…')}
          />
          {editSolution.descriptionErrMsg && <span className="helper-text" data-error={i18nTxt(editSolution.descriptionErrMsg)}></span>}

          <div className="clearfix">
            <div style={{ float: 'left' }}>
              <s.AttachmentDiv>
                {editSolution.attachmentList.map(v => {
                  const removeFile = () => {
                    const attachmentListCopy = editSolution.attachmentList.slice();
                    const curIndex = attachmentListCopy.indexOf(v);
                    attachmentListCopy.splice(curIndex, 1);
                    updateEdit({
                      attachmentList: attachmentListCopy,
                    });
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
                  <input id="bounty-add-attachment" type="file" onChange={uploadFile} />
                </label>
              </s.AttachmentDiv>
            </div>

            <div style={{ float: 'right' }}>
              <s.ExampleDiv
                onClick={() => {
                  updateEdit({
                    showExample: true,
                  });
                }}
              >
                <i className="example" />
                <span>{i18nTxt('EXAMPLE')}</span>
              </s.ExampleDiv>
            </div>
          </div>

          {renderAny(() => {
            if (editSolution.milestoneLimit === 0) {
              return null;
            }

            return (
              <Fragment>
                <div className="subject">{i18nTxt('Milestone')}:</div>

                <div>
                  {editSolution.milestoneList.map((milest, index) => {
                    return (
                      <s1.MileStoneDiv>
                        <div className="milestone-step">
                          <div className="step-box">
                            {i18nTxt('Step')} {index + 1}
                          </div>
                          <div className="step-box-line"></div>
                        </div>

                        <div className="milestone-right">
                          <Input
                            {...{
                              id: `milestone-step-title-${index}`,
                              value: milest.title,
                              errMsg: i18nTxt(milest.titleErr),
                              label: i18nTxt('* Title'),
                              onChange: e => {
                                updateEditMileStone(
                                  {
                                    title: e.target.value,
                                    titleErr: '',
                                  },
                                  index
                                );
                              },
                            }}
                          />
                          <Input
                            {...{
                              id: `milestone-step-desc${index}`,
                              value: milest.description,
                              errMsg: i18nTxt(milest.descriptionErr),
                              label: i18nTxt('* Specify details'),
                              onChange: e => {
                                updateEditMileStone(
                                  {
                                    description: e.target.value,
                                    descriptionErr: '',
                                  },
                                  index
                                );
                              },
                            }}
                          />
                          <Input
                            {...{
                              id: `milestone-step-duration${index}`,
                              value: milest.duration,
                              errMsg: i18nTxt(milest.durationErr),
                              label: i18nTxt('* Expected days'),
                              placeHolder: i18nTxt('days'),
                              onChange: e => {
                                updateEditMileStone(
                                  {
                                    duration: e.target.value,
                                    durationErr: '',
                                  },
                                  index
                                );
                              },
                            }}
                          />
                          <button
                            style={
                              {
                                // visibility: index === 0 ? 'hidden' : 'visible',
                              }
                            }
                            type="button"
                            className="remove-step"
                            onClick={() => {
                              const mileStoneCopy = editSolution.milestoneList.slice();
                              mileStoneCopy.splice(index, 1);
                              updateEdit({
                                milestoneList: mileStoneCopy,
                              });
                            }}
                          >
                            {i18nTxt('Remove this step')}
                          </button>
                        </div>
                      </s1.MileStoneDiv>
                    );
                  })}
                </div>

                <div className="add-step clearfix">
                  <button
                    onClick={() => {
                      const len = editSolution.milestoneList.length;
                      updateEditMileStone(
                        {
                          title: '',
                          titleErr: '',

                          description: '',
                          descriptionErr: '',

                          duration: '',
                          durationErr: '',
                        },
                        len
                      );
                    }}
                    className="btn waves-effect waves-light default"
                    type="button"
                  >
                    <span>{i18nTxt('ADD STEP')}</span>
                    <i className="material-icons">add</i>
                  </button>
                </div>

                <div className="subject">{i18nTxt('Private message')}:</div>
              </Fragment>
            );
          })}

          <textarea
            onChange={e => {
              updateEdit({
                privateMessage: e.target.value,
                privateMessageErr: '',
              });
            }}
            className={cx('materialize-textarea', {
              invalid: editSolution.privateMessageErr,
            })}
            value={editSolution.privateMessage}
            placeholder={i18nTxt(
              'Send your advice on the Bounty. And Your preferred social network account we can contact (For Admin only, Optional)…'
            )}
          />

          {editSolution.privateMessageErr && <span className="helper-text" data-error={i18nTxt(editSolution.privateMessageErr)}></span>}
          <s.SubmitDiv>
            <button
              onClick={() => {
                doSubmit({ pageType, history });
              }}
              className="btn waves-effect waves-light primary"
              type="button"
            >
              {i18nTxt('SUBMIT')}
            </button>
          </s.SubmitDiv>
        </Wrapper>

        <ConfirmComp
          confirmBtns={
            <button
              className="agree"
              type="button"
              onClick={() => {
                updateEdit({
                  showExample: false,
                });
              }}
            >
              {i18nTxt('GOTCHA')}
            </button>
          }
          show={editSolution.showExample}
          content={i18nTxt('submission.example')}
          title={i18nTxt('Submission Example')}
          wrapStyle={{
            width: '400px',
          }}
        />
      </React.Fragment>
    );
  }
}

EditSolution.propTypes = {
  editSolution: PropTypes.objectOf({
    bounty: PropTypes.objectOf({
      title: PropTypes.string,
    }),
  }).isRequired,
  getBounty: PropTypes.func.isRequired,
  updateEdit: PropTypes.func.isRequired,
  updateEditMileStone: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  pageType: PropTypes.string.isRequired,
  history: commonPropTypes.history.isRequired,
  doSubmit: PropTypes.func.isRequired,
  clearEdit: PropTypes.func.isRequired,
  getSolution: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    editSolution: state.solution.editSolution,
  };
}

export default connect(
  mapStateToProps,
  actions
)(EditSolution);
