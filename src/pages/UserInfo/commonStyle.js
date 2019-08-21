import styled from 'styled-components';

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
  }
  .tab-item {
    flex: 1;
    font-size: 16px;
    text-align: center;
    font-weight: 500;
    line-height: 54px;
    color: #333333;
    &.tab-item-active {
      border-bottom: 2px solid #22b2d6;
    }
  }
`;
