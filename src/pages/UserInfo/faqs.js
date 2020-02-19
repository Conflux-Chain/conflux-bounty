import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useEffectOnce } from 'react-use';
import { StyledWrapper } from '../../globalStyles/common';
import BackHeadDiv from '../../components/BackHeadDiv';
import media from '../../globalStyles/media';
import unitParser from '../../utils/device';
import { i18nTxt, commonPropTypes } from '../../utils';

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

  ${media.mobile`
    h1 {
      font-size: ${unitParser(24)};
      line-height: ${unitParser(24)};
      margin-bottom: ${unitParser(20)};
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
`}
`;

function Faqs({ history }) {
  useEffectOnce(() => {
    document.title = i18nTxt('FAQs');
  });
  const faqs = [
    { title: i18nTxt('what is bounty?'), link: '/faq-more#what-is-bounty' },
    { title: i18nTxt('how to create a bounty?'), link: '/faq-more#how-to-create-a-bounty' },
    { title: i18nTxt('How to participate a bounty?'), link: '/faq-more#How-to-participate-in-a-bounty' },
    { title: i18nTxt('How to complete bounty task?'), link: '/faq-more#How-to-complete-bounty-task' },
    { title: i18nTxt('How to get bounty reward?'), link: '/faq-more#How-to-get-bounty-reward' },
  ].map(faq => (
    <Link to={faq.link} target="_blank">
      {faq.title}
    </Link>
  ));

  return (
    <React.Fragment>
      <BackHeadDiv onClick={() => history.push('/user-info')}>
        {' '}
        <Link to="/user-info">{i18nTxt('My Account')}</Link>
      </BackHeadDiv>
      <Wrapper>
        <h1>{i18nTxt('FAQs')}</h1>

        <section className="faq-wrap">
          <div className="faq-list">{faqs}</div>
          <Link to="/faq-more" className="arrow-link" target="_blank">
            <span>{i18nTxt('VIEW MORE')}</span>
            <i className="material-icons dp48">chevron_right</i>
          </Link>
        </section>
      </Wrapper>
    </React.Fragment>
  );
}

Faqs.propTypes = {
  history: commonPropTypes.history.isRequired,
};

export default connect()(Faqs);
