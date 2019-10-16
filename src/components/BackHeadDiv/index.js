import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import media from '../../globalStyles/media';
import unitParser from '../../utils/device';

export const Wrapper = styled(
  styled.div`
    font-size: 20px;
    line-height: 20px;
    max-width: 590px;
    width: 100%;
    margin: 0 auto;
    background: linear-gradient(102.15deg, #ebeded 0%, #dee0e0 100%);
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    padding: 20px 40px;
    cursor: pointer;
    > a {
      color: #595f61;
      text-decoration: none;
      &:hover {
        text-decoration: none;
      }
    }
    ${media.mobile`
    padding: ${unitParser(12)} ${unitParser(20)};
    font-size: ${unitParser(16)};
    line-height: ${unitParser(16)};
    position: relative;
    
    > a {
      position: relative;
      z-index: 1;
      font-size: ${unitParser(16)};
      line-height: ${unitParser(16)};
      font-weight: 500;
    }
  `}
  `
)`
  ${media.mobile`
    &::after {
      content: '';
      background: linear-gradient(106.15deg, #ebeded 0%, #dee0e0 100%);
      position: absolute;
      bottom: -30px;
      left: 0;
      height: 30px;
      width: 100%;
      z-index: 0;
    }

    ${media.mobile`
      width: 100vw;
      font-size: ${unitParser(16)};
      font-weight: bold;
      padding: ${unitParser(12)} ${unitParser(20)};
    `}
    `}
`;

export default function BackHeadDiv({ onClick, children }) {
  return <Wrapper onClick={onClick}>{children}</Wrapper>;
}

BackHeadDiv.propTypes = {
  /* eslint react/forbid-prop-types: 0 */
  children: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};
