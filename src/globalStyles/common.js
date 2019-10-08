import styled, { css } from 'styled-components';
import media from './media';

export const lightBorder = `
border: 0;
background: rgba(255, 255, 255, 1);
box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px 1px;
`;

export const show = 'display: block!important;';
export const hide = 'display: none!important;';

export const paginatorMixin = css`
  .page-h5 {
    ${hide}
  }
  .page-pc {
    display: block;
  }
  ${media.pad`
  justify-content: center;
  .page-pc { ${hide} }
  .page-h5 {
    display: flex!important;
    align-items: center;
    justify-content: center;
  }
`}
`;

export const StyledWrapper = styled.div`
  display: block;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  background: #ffffff;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  margin-bottom: 40px;

  ${media.mobile`
    position: relative;
  `}
`;

export const flexCenterMiddle = `
  display: flex;
  align-items: center;
  justify-content: center;
`;
