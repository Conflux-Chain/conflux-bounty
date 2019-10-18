/**
 * @fileOverview page where user can check invitation code
 * @name inviteFriends.js
 */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { StyledWrapper } from '../../globalStyles/common';
import { notice } from '../../components/Message/notice';
import BackHeadDiv from '../../components/BackHeadDiv';
import { i18nTxt, copyToClipboard, commonPropTypes } from '../../utils';
import { reqInvitationCode, reqInvitationLimit, reqGoodsList } from '../../utils/api';
import Tooltip from '../../components/Tooltip';
import media from '../../globalStyles/media';
import unitParser from '../../utils/device';

// eslint-disable-next-line react/prefer-stateless-function
/* eslint jsx-a11y/label-has-for: 0 */
class InviteFriends extends PureComponent {
  state = {
    invitationCode: '',
    invitationLimit: 0,
    goodsList: [],
    purchaseDisabled: true,
    buyCodeToolTipVisible: false,
  };

  async componentDidMount() {
    await Promise.all([this.getInvitationLimit(), this.getGoodsList()]);
  }

  async getInvitationLimit() {
    const {
      code,
      result: { invitationLimit },
    } = await reqInvitationLimit();

    if (code !== 0) return;
    this.setState({ invitationLimit });
  }

  async getGoodsList() {
    const {
      result: { total, list: goodsList },
    } = await reqGoodsList({ type: 'INVITATION_CODE' });

    if (total) {
      this.setState({ goodsList, purchaseDisabled: false });
    } else {
      this.setState({ purchaseDisabled: true });
    }
  }

  getInvitationCode = async () => {
    const {
      code,
      result: { invitationCode },
    } = await reqInvitationCode();
    if (code !== 0) return;
    if (invitationCode === '') {
      notice.show({ content: i18nTxt('You run out of invites'), type: 'message-error', timeout: 3000 });
    }
    this.setState({ invitationCode });
  };

  render() {
    const {
      history,
      headAccount: { user },
    } = this.props;
    const { buyCodeToolTipVisible, invitationCode, invitationLimit, purchaseDisabled, goodsList } = this.state;
    const faqs = [
      { title: i18nTxt('what is bounty?'), link: '/faq#what-is-bounty' },
      { title: i18nTxt('how to create a bounty?'), link: '/faq#how-to-create-a-bounty' },
      { title: i18nTxt('How to participate a bounty?'), link: '/faq#How-to-participate-in-a-bounty' },
      { title: i18nTxt('How to complete bounty task?'), link: '/faq#How-to-complete-bounty-task' },
      { title: i18nTxt('How to get bounty reward?'), link: '/faq#How-to-get-bounty-reward' },
    ].map(faq => (
      <Link to={faq.link} target="_blank">
        {faq.title}
      </Link>
    ));

    const infos = [
      { label: `${i18nTxt('Invitation code')}:`, text: invitationCode },
      { label: `${i18nTxt('Invitation URL')}:`, text: `${window.location.origin}/invitation/${invitationCode}` },
    ].map(info => (
      <div className="info">
        <label>{info.label}</label>
        <div className="content">
          <span className="text">{info.text}</span>
          <a
            href="/"
            onClick={e => {
              e.preventDefault();
              copyToClipboard(info.text);
              notice.show({ content: i18nTxt('Copied'), type: 'message-success', timeout: 3000 });
            }}
            style={{
              whiteSpace: 'nowrap',
            }}
          >
            {i18nTxt('COPY')}
          </a>
        </div>
      </div>
    ));

    const permanentInfos = [
      { label: `${i18nTxt('Invitation code')}:`, text: user.invitationCode },
      { label: `${i18nTxt('Invitation URL')}:`, text: `${window.location.origin}/invitation/${user.invitationCode}` },
    ].map(info => (
      <div className="info">
        <label>{info.label}</label>
        <div className="content">
          <span className="text">{info.text}</span>
          <a
            href="/"
            onClick={e => {
              e.preventDefault();
              copyToClipboard(info.text);
              notice.show({ content: i18nTxt('Copied'), type: 'message-success', timeout: 3000 });
            }}
            style={{
              whiteSpace: 'nowrap',
            }}
          >
            {i18nTxt('COPY')}
          </a>
        </div>
      </div>
    ));

    return (
      <React.Fragment>
        <BackHeadDiv onClick={() => history.push('/user-info')}>
          <Link to="/user-info">{i18nTxt('My Account')}</Link>
        </BackHeadDiv>
        <Wrapper>
          <div className="title">
            <h1>{i18nTxt('Invite Friends')}</h1>
            <div
              className="purchase-wrap"
              onMouseEnter={() => {
                if (purchaseDisabled) this.setState({ buyCodeToolTipVisible: true });
              }}
              onMouseLeave={() => {
                this.setState({ buyCodeToolTipVisible: false });
              }}
            >
              <button
                className="btn default"
                disabled={purchaseDisabled}
                type="button"
                onClick={() => {
                  history.push('/shop', { goodsList, user });
                }}
              >
                <Tooltip direction="down" show={buyCodeToolTipVisible} style={{ left: '-28px', top: '-40px' }}>
                  <div className="tooltip-content">
                    {i18nTxt('Invitation codes are not available for sale. We’ll announce the date of code sale to the community.')}
                  </div>
                </Tooltip>
                {i18nTxt('BUY MORE CODES')}
              </button>
            </div>
          </div>
          <div style={{ display: user.noInvitationLimit ? 'block' : 'none', marginBottom: '20px' }}>
            <span className="level2-title">{i18nTxt('Permanent invitation code')}:</span>
            <section className="infos">{permanentInfos}</section>
          </div>
          <div className="generate">
            <button className="btn primary" type="button" onClick={this.getInvitationCode}>
              {i18nTxt('GENERATE ONE TIME INVITATION CODE')}
            </button>
            <div>
              <span>{i18nTxt('You can invite')} </span>
              <span className="primary">{invitationLimit}</span>
              <span> {i18nTxt('people')}</span>
            </div>
          </div>
          <section className="infos" style={{ display: invitationCode === '' ? 'none' : 'block' }}>
            {infos}
          </section>
          <section className="faq-wrap">
            <span>{i18nTxt('FAQs')}:</span>
            <div className="faq-list">{faqs}</div>
            <Link to="/faq" className="arrow-link" target="_blank">
              <span>{i18nTxt('VIEW MORE')}</span>
              <i className="material-icons dp48">chevron_right</i>
            </Link>
          </section>
        </Wrapper>
      </React.Fragment>
    );
  }
}

InviteFriends.propTypes = {
  history: commonPropTypes.history.isRequired,
  headAccount: PropTypes.objectOf({
    user: PropTypes.objectOf({
      email: PropTypes.string.isRequired,
      // invitationCode: PropTypes.string,
      // invitationCountV1: PropTypes.integer,
    }),
  }).isRequired,
};

function mapStateToProps(state) {
  const { head: headAccount } = state;
  return { headAccount };
}

export default connect(mapStateToProps)(InviteFriends);

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  color: #171d1f;
  ${media.mobile`
    padding: ${unitParser(20)} ${unitParser(12)};
  `}
  .level2-title {
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 16px;
    color: #171d1f;
  }
  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 34px;
    align-items: center;
    ${media.mobile`
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: ${unitParser(12)};
    `}
    h1 {
      margin: 0;
      font-size: 32px;
      line-height: 32px;
      font-weight: 500;
      ${media.mobile`
        margin-bottom: ${unitParser(40)};
        font-size: ${unitParser(24)};
        line-height: ${unitParser(24)};
      `}
    }
  }
  .purchase-wrap {
    ${media.mobile`
      width: 100%;
      > button {
        width: 100%;
      }
    `}
  }
  .tooltip-content {
    text-transform: none;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
  }
  .faq-wrap {
    margin-top: 28px;
    > span {
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: 16px;
      color: #171d1f;
    }
    .faq-list {
      margin: 18px 0 15px 8px;
      display: flex;
      flex-direction: column;
      font-size: 14px;
      a {
        color: #595f61;
        cursor: pointer;
      }
    }
    .arrow-link {
      > span,
      > i {
        vertical-align: middle;
      }
    }
  }
  .generate {
    display: flex;
    flex-direction: column;
    text-align: center;
    > div {
      margin-top: 20px;
      font-size: 16px;
      .primary {
        color: #22b2d6;
      }
    }
  }
  .infos {
    display: flex;
    flex-direction: column;
    margin-top: 40px;
    .info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      ${media.mobile`
        flex-direction: column;
      `}
      label {
        min-width: 105px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        flex-grow: 0;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 14px;
        margin-right: 15px;
        ${media.mobile`
          font-weight: bold;
          margin-bottom: ${unitParser(8)};
          color: #171d1f;
        `}
      }
      div {
        flex-grow: 1;
      }
      .content {
        display: flex;
        border: 1px solid #d8dddf;
        border-radius: 4px;
        padding: 21px 16px;
        box-sizing: border-box;
        span {
          flex-grow: 1;
        }
        a {
          flex-grow: 0;
          align-self: flex-end;
        }
      }
    }
  }
  .faq-wrap {
    margin-top: 28px;
    > span {
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: 16px;
      color: #171d1f;
    }
    .faq-list {
      margin: 18px 0 15px 8px;
      display: flex;
      flex-direction: column;
      font-size: 14px;
      ${media.mobile`
        margin-left: 0;
      `}
      a {
        color: #595f61;
        cursor: pointer;
      }
    }
    .arrow-link {
      > span,
      > i {
        vertical-align: middle;
      }
    }
  }
  .generate {
    display: flex;
    flex-direction: column;
    text-align: center;
    > div {
      margin-top: 20px;
      font-size: 16px;
      .primary {
        color: #22b2d6;
      }
    }
  }
`;
