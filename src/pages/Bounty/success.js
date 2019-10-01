import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// import * as actions from './action';
import { StyledWrapper } from '../../globalStyles/common';
// import * as s from './commonStyle';
import { i18nTxt } from '../../utils';
import media from '../../globalStyles/media';

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  color: #171d1f;
  text-align: center;

  .success-icon {
    display: inline-block;
    font-size: 80px;
    color: #59bf9c;
  }
  h1 {
    margin: 0;
    font-size: 32px;
    line-height: 36px;
    color: #171d1f;
    font-weight: 500;
  }
  > p {
    font-size: 16px;
    margin: 0;
    margin-top: 20px;
    color: #595f61;
  }
  .btns {
    display: flex;
    margin-top: 20px;
    align-items: center;
    .btn {
      flex: 1;
      :hover {
        text-decoration: none;
      }
    }
    .btn:first-of-type {
      margin-right: 20px;
    }
  }

  ${media.mobile`
    padding: 12px;
    box-shadow: none;
    .success-icon {
      font-size: 60px;
    }
    h1 {
      font-size: 24px;
      line-height: 28px;
    }
    > p {
      font-size: 14px;
      line-height: 18px;
    }
    .btns {
      padding: 0 25px;
      margin-bottom: 28px;
      justify-content: center;
      .btn {
        font-size: 14px;
        line-height: 14px;
        height: 32px;
        flex: none;
        padding: 9px 8px;
        white-space: nowrap;
      }
      .btn:first-of-type {
        margin-right: 12px;
      }
    }
  `}
`;

// eslint-disable-next-line react/prefer-stateless-function
class BountySuccess extends Component {
  constructor(...args) {
    super(...args);
    const { update } = this.props;
    this.update = update;
    const { pageType } = this.props;

    if (pageType === 'create') {
      document.title = i18nTxt('Create bounty success');
    } else {
      document.title = i18nTxt('Edit bounty success');
    }
  }

  render() {
    const { pageType } = this.props;
    return (
      <Wrapper>
        <div className="success-icon"></div>
        <h1>
          {i18nTxt('Good job!')}
          <br />
          {pageType === 'create' ? i18nTxt('You’ve created a new bounty!') : i18nTxt('Bounty edit submited!')}
        </h1>

        <p>
          {i18nTxt('We are reviewing your submission.')}.
          <br />
          {i18nTxt('Approved bounty will be displayed on the home page.')}
        </p>

        <div className="btns">
          <Link to="/create-bounty" className="btn waves-effect waves-light primary" type="button">
            {i18nTxt('Create Another Bounty')}
          </Link>
          <Link to="/" className="btn default waves-effect waves-light" type="button">
            {i18nTxt('Back Home')}
          </Link>
        </div>
      </Wrapper>
    );
  }
}

BountySuccess.propTypes = {
  update: PropTypes.func.isRequired,
  pageType: PropTypes.string.isRequired,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(BountySuccess);
