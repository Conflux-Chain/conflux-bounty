import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import media from '../../globalStyles/media';

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
    padding: 12px 20px;
    font-size: 16px;
    line-height: 16px;
    position: relative;
    
    > a {
      position: relative;
      z-index: 1;
      font-size: 16px;
      line-height: 16px;
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
      top: 40px;
      left: 0;
      height: 30px;
      width: 100%;
      z-index: 0;
    }
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
