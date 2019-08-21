import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { StyledWrapper } from '../../globalStyles/common';
import { i18nTxt } from '../../utils';

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
    this.state = {
      faqHtml: '',
    };
    i18nTxt('faq.index').then(txt => {
      this.setState({
        faqHtml: txt.default,
      });

      setTimeout(() => {
        const elem = document.querySelector(window.location.hash);
        if (elem) {
          // elem.scrollIntoView();
          document.querySelector('#page-wrapper').scrollTop = elem.offsetTop - 150;
        }
      });
    });
  }

  componentDidUpdate(prevProps) {
    const { lang } = this.props;
    if (prevProps.lang !== lang) {
      i18nTxt('faq.index').then(txt => {
        this.setState({
          faqHtml: txt.default,
        });
      });
    }
  }

  render() {
    const { faqHtml } = this.state;
    return (
      <Wrapper>
        <h1>{i18nTxt('Bounty FAQS')} </h1>

        <div
          className="faq-wrap"
          dangerouslySetInnerHTML={{
            __html: faqHtml,
          }}
        ></div>
      </Wrapper>
    );
  }
}

Faq.propTypes = {
  lang: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    lang: state.common.lang,
  };
}

export default connect(mapStateToProps)(Faq);
