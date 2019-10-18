/**
 * @fileOverview user messages
 * @name messages.js
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAsync } from 'react-use';
import LinesEllipsis from 'react-lines-ellipsis';
import { StyledWrapper } from '../../globalStyles/common';
import BackHeadDiv from '../../components/BackHeadDiv';
import { timeSince, commonPropTypes, i18nTxt, notice } from '../../utils';
import { reqMessageList, reqMessageCount, reqMessageReadAll } from '../../utils/api';
import { UPDATE_UNREAD_MESSAGE_COUNT } from '../../constants';
import media from '../../globalStyles/media';
import unitParser, { useMobile } from '../../utils/device';
import NoResult from '../../components/NoResult';

const PAGE_SIZE = 5;
export const MESSAGE_TEMPLATE = {
  $BOUNTY_CREATE: {
    en: 'Your bounty - {{bountyTitle}} has been submitted',
    'zh-CN': '您的{{bountyTitle}}赏金任务已经提交成功！',
  },
  $BOUNTY_OPEN: {
    en: 'Your bounty - {{bountyTitle}} has been approved！',
    'zh-CN': '您的{{bountyTitle}}赏金任务状态变为已公开！',
  },
  $BOUNTY_REDO: {
    en: 'Your bounty - {{bountyTitle}} has been rejected！',
    'zh-CN': '您的{{bountyTitle}}赏金任务被拒绝通过！',
  },
  $BOUNTY_GOING: {
    en: 'Your bounty - {{bountyTitle}} has been changed to ongoing status！',
    'zh-CN': '您的{{bountyTitle}}赏金任务状态变为进行中！',
  },
  $BOUNTY_HAND_IN: {
    en: 'Your bounty - {{bountyTitle}} has been changed to auditing status！',
    'zh-CN': '您的{{bountyTitle}}赏金任务状态变为验收中！',
  },
  $BOUNTY_AUDIT: {
    en: 'Your bounty - {{bountyTitle}} has been changed to final auditing status！',
    'zh-CN': '您的{{bountyTitle}}赏金任务状态变为审批中！',
  },
  $BOUNTY_FINISH: {
    en: 'Your bounty - {{bountyTitle}} has been finished！',
    'zh-CN': '您的{{bountyTitle}}赏金任务状态变为已完成！',
  },
  $BOUNTY_EXPIRE: {
    en: 'Your bounty - {{bountyTitle}} has been expired！',
    'zh-CN': '您的{{bountyTitle}}赏金任务状态变为已过期！',
  },
  $SUBMISSION_STATUS_CHANGE: {
    en: 'Submission status has been changed',
    'zh-CN': '方案状态变更',
  },
  $SUBMISSION_CREATE: {
    en: 'Your submission to {{bountyTitle}} has been submitted',
    'zh-CN': '您针对{{bountyTitle}}的方案已经提交成功！',
  },
  $SUBMISSION_OPEN: {
    en: 'Your submission to {{bountyTitle}} has been approved!',
    'zh-CN': '您针对{{bountyTitle}}的方案状态变为已公开！',
  },
  $SUBMISSION_REDO: {
    en: 'Your submission to {{bountyTitle}} has been rejected!',
    'zh-CN': '您针对{{bountyTitle}}的方案被拒绝通过！',
  },
  $SUBMISSION_GOING: {
    en: 'Your submission to {{bountyTitle}} is ongoing now!',
    'zh-CN': '您针对{{bountyTitle}}的方案状态变为进行中！',
  },
  $SUBMISSION_AUDIT: {
    en: 'Your submission to {{bountyTitle}} is under auditing!',
    'zh-CN': '您针对{{bountyTitle}}的方案状态变为验收中！',
  },
  $SUBMISSION_FINISH: {
    en: 'Your submission to {{bountyTitle}} is finished!',
    'zh-CN': '您针对{{bountyTitle}}的方案状态变为已完成！',
  },
  $SUBMISSION_EXPIRE: {
    en: 'Your submission to {{bountyTitle}} has been expired！',
    'zh-CN': '您针对{{bountyTitle}}的方案状态变为已过期！',
  },
  $MILESTONE_FINISH: {
    en: 'Your submission milestone to the bounty - {{bountyTitle}} has been approved!',
    'zh-CN': '您针对{{bountyTitle}}的方案的里程碑状态变为已公开！',
  },
  $MILESTONE_DENY: {
    en: 'Your submission milestone to {{bountyTitle}} has been rejected!',
    'zh-CN': '您针对{{bountyTitle}}的方案的里程碑被拒绝通过！',
  },
  $WITHDRAWAL_REJECT: {
    en: 'Your withdrawals has been executed！',
    'zh-CN': '您的提现申请被驳回！',
  },
  $WITHDRAWAL_FINISH: {
    en: 'Your withdrawals has been approved！',
    'zh-CN': '您的提现申请已提币！',
  },
  $MILESTONE_STATUS_CHANGE: {
    en: 'Submission milestone status has been changed',
    'zh-CN': '方案里程碑状态变更',
  },
  $WITHDRAWAL_STATUS_CHANGE: {
    en: 'Withdrawals status has been changed',
    'zh-CN': '提现申请状态变更',
  },
  $BOUNTY_STATUS_CHANGE: {
    en: 'Bounty status has been changed',
    'zh-CN': '赏金任务状态变更',
  },
};

export function getMessageTemplate(message, lang) {
  const title = MESSAGE_TEMPLATE[message.description][lang];
  return title;
}

function Messages({ dispatch, lang, history }) {
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [nextPage, setNextPage] = useState(1);

  useAsync(async () => {
    if (!lang) return;
    const query = {
      limit: PAGE_SIZE,
      language: lang === 'en' ? 'english' : 'chinese',
    };

    query.page = nextPage;

    const {
      result: { list, total: newTotal },
    } = await reqMessageList(query);
    setMessages(messages.concat(list));
    setTotal(newTotal);
  }, [nextPage]);

  const isMobile = useMobile();

  return (
    <React.Fragment>
      <BackHeadDiv onClick={() => history.push('/user-info')}>{i18nTxt('My Account')}</BackHeadDiv>
      <Wrapper>
        <h1>
          <Head>
            <span>{i18nTxt('Messages')}</span>
            <button
              onClick={() => {
                reqMessageReadAll().then(() => {
                  notice.show({
                    type: 'message-success',
                    content: i18nTxt('update success'),
                    timeout: 3 * 1000,
                  });
                  reqMessageCount({ isRead: false }).then(body => {
                    setMessages(
                      messages.map(message => {
                        return { ...message, isRead: true };
                      })
                    );
                    dispatch({
                      type: UPDATE_UNREAD_MESSAGE_COUNT,
                      payload: {
                        messageCount: body.result.total,
                      },
                    });
                  });
                });
              }}
              className="btn waves-effect waves-light default"
              type="button"
              disabled={!messages.length}
            >
              {i18nTxt('MARK ALL AS READ')}
            </button>
          </Head>
        </h1>
        <div className="table-wrap">
          <table>
            <tbody>
              {messages.map(message => {
                const { id, createdAt, isRead } = message;
                const { bountyTitle } = message.info;
                const template = getMessageTemplate(message, lang);
                let firstPartStr;
                let lastPartStr = '';
                if (message.info.withdrawalId) {
                  firstPartStr = template;
                } else {
                  firstPartStr = template.substring(0, template.indexOf('{{')) + bountyTitle || template;
                  lastPartStr = template.substring(template.indexOf('}}') + 2, template.length - 1) || '';
                }

                return (
                  <tr>
                    <td className="title">
                      <Link className={isRead ? '' : 'unread'} to={`/message/${id}`}>
                        <LinesEllipsis
                          className="message-title"
                          style={{ whiteSpace: 'pre-wrap' }} // https://github.com/xiaody/react-lines-ellipsis/issues/59
                          text={`${firstPartStr}${lastPartStr}`}
                          maxLine={isMobile ? '2' : '1'}
                          trimRight
                          ellipsis={`... ${lastPartStr}`}
                        />
                      </Link>
                    </td>
                    <td className="time">
                      <span className="time align-right">{timeSince(createdAt)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {total === 0 && <NoResult />}
          <div className="show-more" style={{ display: total > messages.length ? 'block' : 'none' }}>
            <button
              onClick={() => {
                setNextPage(page => page + 1);
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

Messages.propTypes = {
  /* eslint react/forbid-prop-types: 0 */
  history: commonPropTypes.history.isRequired,
  lang: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return { lang: state.head.user.language };
}

export default connect(mapStateToProps)(Messages);

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  color: #171d1f;
  h1 {
    font-size: 32px;
    line-height: 32px;
    margin: 0;
    margin-bottom: 40px;
    font-weight: 500;
    ${media.mobile`
font-size: ${unitParser(24)};
line-height: ${unitParser(24)};
margin-bottom: ${unitParser(20)};
`}
  }
  .table-wrap {
    > table {
      table-layout: fixed;
    }
    .show-more {
      text-align: center;
      margin-top: 40px;
    }
    margin-top: 40px;
    .title {
      position: relative;
      min-width: 400px;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 16px;
      color: #8e9394;
      white-space: no-wrap;
    }
    .time {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 14px;
      text-align: right;
      color: #8e9394;
      width: 100px;
      ${media.mobile`
font-size: ${unitParser(12)};
line-height: ${unitParser(12)};
`}
    }
    td {
      padding: 19px 0 18px 0;
      overflow: unset;
      .message-title {
        line-height: 16px;
        font-size: 16px;
        ${media.mobile`
font-size: ${unitParser(14)};
`}
      }
      a {
        color: #8e9394;
        cursor: pointer;
      }
      ${media.mobile`
padding: ${unitParser(20)} 0;
`}
    }
    th {
      font-weight: normal;
      color: #8e9394;
    }
    tr:first-child {
      border-top: 1px solid #ebeded;
    }
    .unread {
      color: #171d1f;
    }
    .unread:before {
      content: '•';
      position: absolute;
      left: -10px;
      font-weight: bold;
      color: #f0453a;
    }
  }
`;
