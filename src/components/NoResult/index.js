import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import noResult from '../../assets/images/icon-no-results.png';
import { i18nTxt } from '../../utils';

const NoResultWrapper = styled.div`
  display: block;
  text-align: center;
  margin-top: ${props => {
    // debugger;
    return props.marginTop;
  }};
  > img {
    width: 80px;
    margin: 0 auto;
    display: block;
  }
  img + div {
    margin-top: 20px;
    color: rgb(142, 147, 148);
    margin-bottom: 20px;
  }
`;

export default function NoResult({ marginTop = 20 }) {
  return (
    <NoResultWrapper marginTop={`${marginTop}px`}>
      <img src={noResult} alt="noresult" />
      <div>{i18nTxt('No data available')}</div>
    </NoResultWrapper>
  );
}

NoResult.defaultProps = { marginTop: 20 };
NoResult.propTypes = { marginTop: PropTypes.number };
