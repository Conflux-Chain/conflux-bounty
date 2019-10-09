import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import unitParser from '../../utils/device';
import media from '../../globalStyles/media';

export const Wrapper = styled.div`
  font-size: 20px;
  line-height: 20px;
  width: 590px;
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
    width: 100vw;
    font-size: ${unitParser(16)};
    font-weight: bold;
    padding: ${unitParser(12)} ${unitParser(20)};
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
