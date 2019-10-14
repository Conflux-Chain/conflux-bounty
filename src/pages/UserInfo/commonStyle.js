import styled from 'styled-components';
import media from '../../globalStyles/media';
import unitParser from '../../utils/device';

/* eslint import/prefer-default-export: 0 */
export const TabDiv = styled.div`
  .tab-s {
    margin-left: -40px;
    margin-right: -40px;
    padding-left: 40px;
    padding-right: 40px;

    display: flex;
    border-bottom: 1px solid #ebeded;
    align-items: center;
    ${media.mobile`
margin-left: ${unitParser(-12)}
margin-right: ${unitParser(-12)}
padding: 0;
`}
    button {
      padding: 0;
      text-align: center;
    }
  }
  .tab-item {
    flex: 1;
    font-size: 16px;
    text-align: center;
    font-weight: 500;
    line-height: 54px;
    ${media.mobile`
font-size: ${unitParser(16)};
line-height: ${unitParser(54)};
`}
    color: #333333;
    &.tab-item-active {
      border-bottom: 2px solid #22b2d6;
    }
  }
`;
