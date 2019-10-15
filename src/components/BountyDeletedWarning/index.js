import React from 'react';
import styled from 'styled-components';
import Tooltip from '../Tooltip';
import { i18nTxt } from '../../utils';
import media from '../../globalStyles/media';

const ItemWarning = styled.span`
  margin-left: 10px;
  i {
    font-size: 18px;
    color: rgb(240, 69, 58);
  }
  ${media.mobile`
margin-left: 0;
`}
`;

export default function BountyDeletedWarning() {
  return (
    <ItemWarning>
      <span className="item-warning">
        <Tooltip direction="topRight" tipSpan={<i className="material-icons dp48">info</i>}>
          {i18nTxt('The Bounty has been offline from its corresponding national station and no longer supports viewing')}
        </Tooltip>
      </span>
    </ItemWarning>
  );
}
