import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as actions from './action';
import { StyledWrapper } from '../../globalStyles/common';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Message from '../../components/Message';
import Picker from '../../components/Picker';
import * as s from './commonStyle';
import ConfirmComp from '../../components/Modal/confirm';
import { getCategory } from '../../utils/api';
import unitParser, { isMobile } from '../../utils/device';
import media from '../../globalStyles/media';
import { i18nTxt, auth, commonPropTypes, getStatus, downLink, i18nTxtAsync } from '../../utils/index';
import { BOUNTY_STATUS_ENUM } from '../../constants';

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  h1 {
    font-size: 32px;
    margin: 0;
    margin-bottom: 35px;
  }
  .subject {
    font-weight: 500;
  }
  .bounty-title {
    margin-top: 12px;
  }
  .category-wrap {
    display: flex;
    > * {
      flex: 1;
      &:nth-child(1) {
        margin-right: 12px;
      }
    }
  }

  .input-field {
    margin-bottom: 0px;
  }
  .materialize-textarea {
    height: 100px;
    margin-top: 12px;
    margin-bottom: 0;
    display: block;
  }
  .attachment {
    line-height: unset;
    display: grid;
    grid-template-columns: 1fr max-content;
    margin-top: 8px;
  }
  .status-tips {
    margin-bottom: 40px;
  }
  ${media.mobile`
    padding: ${unitParser('20dp')} ${unitParser('12dp')};
    h1 {
      font-size: ${unitParser('24dp')};
      font-weight: bold;
      margin-bottom: 40px;

    }
    .subject {
      font-size: ${unitParser('16dp')};
      text-indent: ${unitParser('4dp')};
    }
    textarea {
      padding: ${unitParser('15dp')} ${unitParser('8dp')};
      font-size: ${unitParser('14dp')};
    }
    .attachment{
      margin-top: ${unitParser(6)};
    }
  `}
`;

function fmtLabel(item) {
  return {
    ...item,
    label: i18nTxt(item.name),
    value: item.id,
  };
}

class EditBounty extends Component {
  constructor(...args) {
    super(...args);
    const { history, clearEdit, pageType, getBounty, getCategory: getc } = this.props;
    if (!auth.loggedIn()) {
      history.push('/signin');
      return;
    }

    getc();

    if (history.action === 'PUSH') {
      clearEdit();
    }
    if (pageType === 'edit') {
      getBounty();
    }
  }

  componentDidMount() {
    const { head, pageType } = this.props;
    const updateHead = () => {
      if (pageType === 'edit') {
        document.title = i18nTxt('Edit Bounty');
      } else {
        document.title = i18nTxt('Create A New Bounty');
      }
    };
    if (head.accountPromise) {
      head.accountPromise.then(() => {
        updateHead();
      });
    } else {
      updateHead();
    }
  }

  render() {
    const { categoryL1List, editState, updateEdit, categoryMap, pageType, doSubmit, uploadFile, history } = this.props;

    let statusDiv;
    if (editState.status === BOUNTY_STATUS_ENUM.REVIEWING) {
      statusDiv = (
        <div className="status-tips">
          <Message type="message-notice-light">
            {i18nTxt('bounty is')} {getStatus(editState.status)}
          </Message>
        </div>
      );
    } else if (editState.status === BOUNTY_STATUS_ENUM.PENDING) {
      statusDiv = editState.redoMessage && (
        <div className="status-tips">
          <Message type="message-important">{editState.redoMessage}</Message>
        </div>
      );
    } else if (editState.status === BOUNTY_STATUS_ENUM.FINISHED) {
      statusDiv = (
        <div className="status-tips">
          <Message type="message-success">
            {i18nTxt('bounty has')} {getStatus(editState.status)}
          </Message>
        </div>
      );
    } else if (editState.status === BOUNTY_STATUS_ENUM.EXPIRED) {
      statusDiv = (
        <div className="status-tips">
          <Message type="message-important">
            {i18nTxt('bounty has')} {getStatus(editState.status)}
          </Message>
        </div>
      );
    } else if (editState.status) {
      statusDiv = (
        <div className="status-tips">
          <Message type="message-notice">
            {i18nTxt('bounty is')} {getStatus(editState.status)}
          </Message>
        </div>
      );
    }

    return (
      <Wrapper
        ref={ref => {
          this.editBountyRef = ref;
        }}
      >
        <h1>{pageType === 'create' ? i18nTxt('Create New Bounty') : i18nTxt('Edit Bounty')} </h1>
        {statusDiv}
        <div className="subject">{i18nTxt('Subject')}:</div>
        <div>
          <Input
            {...{
              className: 'bounty-title',
              errMsg: i18nTxt(editState.titleErrMsg),
              id: 'bounty-title',
              value: editState.title,
              label: i18nTxt('* Title'),
              placeHolder: '',
              onChange: e => {
                updateEdit({
                  title: e.target.value,
                  titleErrMsg: '',
                });
              },
            }}
          />
        </div>
        {!isMobile() ? (
          <div className="category-wrap">
            <div className="category-wrap-select">
              <Select
                {...{
                  label: i18nTxt('* Category'),
                  onSelect: v => {
                    updateEdit({
                      categoryL1Id: v.value,
                      l1ErrMsg: '',
                    });
                  },
                  options: categoryL1List.map(fmtLabel),
                  selected: {
                    value: editState.categoryL1Id,
                  },
                  errMsg: i18nTxt(editState.l1ErrMsg),
                }}
              />
            </div>
            <div className="category-wrap-select">
              <Select
                {...{
                  label: i18nTxt('* Subcategory'),
                  onSelect: v => {
                    updateEdit({
                      categoryL2Id: v.value,
                      l2ErrMsg: '',
                    });
                  },
                  options: (categoryMap[editState.categoryL1Id] || []).map(fmtLabel),
                  selected: {
                    value: editState.categoryL2Id,
                  },
                  errMsg: i18nTxt(editState.l2ErrMsg),
                }}
              />
            </div>
          </div>
        ) : (
          <div className="category-wrap">
            <Picker
              label={i18nTxt('* Category')}
              selected={{
                value: editState.categoryL1Id,
              }}
              data={categoryL1List.map(fmtLabel)}
              errMsg={i18nTxt(editState.l1ErrMsg)}
              onSelect={v => {
                updateEdit({
                  categoryL1Id: v.value,
                  l1ErrMsg: '',
                });
              }}
            ></Picker>
            <Picker
              label={i18nTxt('* Subcategory')}
              selected={{
                value: editState.categoryL2Id,
              }}
              data={(categoryMap[editState.categoryL1Id] || []).map(fmtLabel)}
              errMsg={i18nTxt(editState.l2ErrMsg)}
              onSelect={v => {
                updateEdit({
                  categoryL2Id: v.value,
                  l2ErrMsg: '',
                });
              }}
            ></Picker>
          </div>
        )}

        <textarea
          value={editState.description}
          className={`materialize-textarea ${editState.descriptionErrMsg ? 'invalid' : ''}`}
          placeholder={i18nTxt(
            '* Please describe the item you would like to create/improve, expected results, timeline, acceptance criterias, etc. To make the approval process easier, please clearly describe your Bounty'
          )}
          onChange={e => {
            updateEdit({
              description: e.target.value,
              descriptionErrMsg: '',
            });
          }}
        />
        {editState.descriptionErrMsg && <span className="helper-text" data-error={i18nTxt(editState.descriptionErrMsg)}></span>}
        <div className="attachment">
          <s.AttachmentDiv>
            {editState.attachmentList.map(v => {
              const removeFile = () => {
                const attachmentListCopy = editState.attachmentList.slice();
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
              {isMobile() ? (
                <input id="bounty-add-attachment" type="file" accept="image/*" onChange={uploadFile} />
              ) : (
                <input id="bounty-add-attachment" type="file" onChange={uploadFile} />
              )}
            </label>
          </s.AttachmentDiv>

          <s.ExampleDiv
            role="button"
            onClick={() => {
              updateEdit({
                descExampleShow: true,
              });
            }}
          >
            <i className="example" />
            <span>{i18nTxt('Bounty Example')}</span>
          </s.ExampleDiv>
        </div>
        <div className="subject">{i18nTxt('Private message')}:</div>
        <textarea
          className={`materialize-textarea ${editState.privateMessageErr ? 'invalid' : ''}`}
          placeholder={i18nTxt(
            '* Describe bounty rewards, distribution solely to conflux team. And Your preferred social network account we can contact (Optional)…'
          )}
          value={editState.privateMessage}
          onChange={e => {
            updateEdit({
              privateMessage: e.target.value,
              privateMessageErr: '',
            });
          }}
        />
        {editState.privateMessageErr && <span className="helper-text" data-error={i18nTxt(editState.privateMessageErr)}></span>}
        <div className="attachment">
          <span></span>
          <div style={{ cssFloat: 'right' }}>
            <s.ExampleDiv
              onClick={() => {
                updateEdit({
                  privateMsgExampleShow: true,
                });
              }}
            >
              <i className="example" />
              <span>{i18nTxt('Private Message Example')}</span>
            </s.ExampleDiv>
          </div>
        </div>
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
        <ConfirmComp
          confirmBtns={
            <button
              className="agree"
              type="button"
              onClick={() => {
                updateEdit({
                  descExampleShow: false,
                });
              }}
            >
              {i18nTxt('GOTCHA')}
            </button>
          }
          show={editState.descExampleShow}
          content={i18nTxtAsync('bounty.faq')}
          title={i18nTxt('Bounty Example')}
          wrapStyle={{
            width: window.screen.width >= 600 ? '400px' : '100%',
          }}
        />
        <ConfirmComp
          confirmBtns={
            <button
              className="agree"
              type="button"
              onClick={() => {
                updateEdit({
                  privateMsgExampleShow: false,
                });
              }}
            >
              {i18nTxt('GOTCHA')}
            </button>
          }
          show={editState.privateMsgExampleShow}
          content={
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {i18nTxt('bounty.faq.private')}
            </pre>
          }
          title={i18nTxt('Private Message Example')}
          wrapStyle={{
            width: window.screen.width >= 600 ? '400px' : '100%',
          }}
        />
      </Wrapper>
    );
  }
}

const categoryType = {
  id: PropTypes.string,
  name: PropTypes.string,
};

EditBounty.propTypes = {
  getCategory: PropTypes.func.isRequired,
  updateEdit: PropTypes.func.isRequired,
  pageType: PropTypes.string.isRequired,
  categoryL1List: PropTypes.arrayOf(categoryType).isRequired,
  categoryMap: PropTypes.objectOf({
    id: PropTypes.arrayOf(categoryType),
  }).isRequired,
  editState: PropTypes.objectOf({
    title: PropTypes.string,
  }).isRequired,
  doSubmit: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  clearEdit: PropTypes.func.isRequired,
  getBounty: PropTypes.func.isRequired,
  history: commonPropTypes.history.isRequired,
  head: PropTypes.objectOf({
    accountPromise: PropTypes.objectOf({
      then: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    categoryL1List: state.common.categoryL1List,
    categoryMap: state.common.categoryMap,
    editState: state.bounty.editBounty,
    head: state.head,
  };
}

export default connect(
  mapStateToProps,
  {
    ...actions,
    getCategory,
  }
)(EditBounty);
