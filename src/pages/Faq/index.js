import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { StyledWrapper } from '../../globalStyles/common';
import { i18nTxt, i18nTxtAsync } from '../../utils';

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  h1 {
    font-size: 32px;
    margin: 0;
    margin-bottom: 35px;
  }
  h3 {
    font-size: 24px;
    font-weight: bold;
  }
`;

// eslint-disable-next-line react/prefer-stateless-function
class Faq extends Component {
  constructor(...args) {
    super(...args);
    document.title = i18nTxt('History');

    setTimeout(() => {
      const elem = document.querySelector(window.location.hash);
      if (elem) {
        document.querySelector('#page-wrapper').scrollTop = elem.offsetTop - 150;
      }
    }, 1000);
  }

  render() {
    return (
      <Wrapper>
        <h1>{i18nTxt('Bounty FAQS')} </h1>

        <div className="faq-wrap">{i18nTxtAsync('faq.index')}</div>
      </Wrapper>
    );
  }
}

export default connect()(Faq);
