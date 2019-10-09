import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// import * as actions from './action';
import { StyledWrapper } from '../../globalStyles/common';
// import * as s from './commonStyle';
import { i18nTxt, getQuery } from '../../utils';
import unitParser from '../../utils/device';
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
    padding: ${unitParser(40)} ${unitParser(30)};
    .success-icon{
      font-size: ${unitParser(60)};
      height: ${unitParser(60)};
      line-height: ${unitParser(60)};
      margin-bottom: ${unitParser(20)};
    }
    h1 {
      width: 100%;
      font-size: ${unitParser(24)};
      line-height: ${unitParser(28)}; 
      font-weight: bold;       
    }
    >p{
      font-size: ${unitParser(14)};
      line-height: ${unitParser(18)}; 
    }
    .btns{
      padding: 0 4px;
      .btn{
        height: ${unitParser(32)};
        line-height: ${unitParser(32)};
        font-size: ${unitParser(14)};
        font-weight: 600;
      }
      .btn:nth-child(1) {
        margin-right: ${unitParser(12)};

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
    this.query = getQuery();
  }

  render() {
    const { pageType } = this.props;
    return (
      <Wrapper>
        <div className="success-icon"></div>
        <h1>
          {i18nTxt('Congrats')}!
          <br />
          {pageType === 'create'
            ? i18nTxt('You’ve successfully sent a submission!')
            : i18nTxt('You’ve successfully sent a submission edit!')}
        </h1>

        <p>{i18nTxt('We are reviewing your submission. Approved bounty will be displayed on the home page.')}</p>

        <div className="btns">
          <Link to={`/view-bounty?bountyId=${this.query.bountyId}`} className="btn waves-effect waves-light primary" type="button">
            {i18nTxt('BACK TO CURRENT BOUNTY')}
          </Link>
          <Link to="/" className="btn default waves-effect waves-light" type="button">
            {i18nTxt('BACK HOME')}
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
