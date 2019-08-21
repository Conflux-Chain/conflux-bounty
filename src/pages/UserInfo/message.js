/**
 * @fileOverview single message page
 * @name message.js
 */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { StyledWrapper } from '../../globalStyles/common';
import BackHeadDiv from '../../components/BackHeadDiv';
import * as pageHeadActions from '../../components/PageHead/action';
import { i18nTxt, timeSince, commonPropTypes } from '../../utils';
import { reqMessageQuery, reqMessageUpdate } from '../../utils/api';
import { MESSAGE_TEMPLATE } from './messages';

class Message extends PureComponent {
  state = {
    title: '',
    description: '',
    createdAt: '',
    author: '',
  };

  componentDidMount() {
    const { lang } = this.props;
    this.getMessage(lang);
  }

  async getMessage(lang) {
    const { match, getUnreadMessageCount } = this.props;
    const { messageId } = match.params;
    const [
      {
        result: {
          title,
          description,
          createdAt,
          info: { bountyTitle },
        },
      },
    ] = await Promise.all([
      reqMessageQuery({ messageId, language: lang === 'en' ? 'english' : 'chinese' }),
      reqMessageUpdate({ isRead: true, messageId }),
    ]);
    getUnreadMessageCount();
    this.setState({
      title: MESSAGE_TEMPLATE[title][lang],
      description: `${MESSAGE_TEMPLATE[description][lang].replace('{{bountyTitle}}', bountyTitle)}

${i18nTxt('You can check the details at below link')}.`,
      createdAt,
      author: i18nTxt('Conflux Team'),
    });
  }

  /* eslint camelcase: 0 */
  UNSAFE_componentWillReceiveProps({ lang }) {
    this.getMessage(lang);
  }

  render() {
    const { title, description, author, createdAt } = this.state;
    const { history, nickname } = this.props;
    const paragraphs = description.split('\n');
    const isSubmission = title.includes('Submission');

    return (
      <React.Fragment>
        <BackHeadDiv onClick={() => history.push('/messages')}>{i18nTxt('Messages')}</BackHeadDiv>
        <Wrapper>
          {title ? (
            <div>
              <h1>{title}</h1>
              <div className="subhead">
                <span className="author"> {`${i18nTxt('From')} ${author}`}</span>
                <span className="timestamp">{timeSince(createdAt)}</span>
              </div>
              <p>
                {i18nTxt('Hi,')} {nickname}
              </p>
              {paragraphs.map(paragraph => (
                <p>{paragraph}</p>
              ))}
              <Link to={`${isSubmission ? '/my-submission' : '/my-bounty'}`}>
                {i18nTxt(`${isSubmission ? 'My Submissions' : 'My Bounties'}`)}
              </Link>
              <br />
              <p>{i18nTxt('Conflux Team')}</p>
            </div>
          ) : (
            ''
          )}
        </Wrapper>
      </React.Fragment>
    );
  }
}

Message.propTypes = {
  history: commonPropTypes.history.isRequired,
  getUnreadMessageCount: PropTypes.func.isRequired,
  match: PropTypes.objectOf({
    params: PropTypes.objectOf({
      messageId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  lang: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  const {
    getUnreadMessageCount,
    head: {
      user: { language, nickname },
    },
  } = state;
  return { getUnreadMessageCount, lang: language, nickname };
}

export default connect(
  mapStateToProps,
  pageHeadActions
)(Message);

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  color: #171d1f;
  p {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    color: #171d1f;
  }
  .subhead {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 14px;
    color: #8e9394;
    display: flex;
    margin-bottom: 40px;
    .author {
      margin-right: 20px;
    }
  }
  h1 {
    font-size: 32px;
    line-height: 32px;
    margin: 0;
    margin-bottom: 20px;
    font-weight: 500;
  }
`;
