import React from 'react';
import styled from 'styled-components';
import { useToggle } from 'react-use';
import Tooltip from '../Tooltip';
import { i18nTxt } from '../../utils';
import media from '../../globalStyles/media';
import unitParser, { useMobile } from '../../utils/device';
import ConfirmComp from '../Modal/confirm';

const ItemWarning = styled.span`
  margin-left: 10px;
  i {
    font-size: 18px;
    color: rgb(240, 69, 58);
  }
  ${media.mobile`
margin-left: 0;
font-size: ${unitParser(12)};
  .info-icon {
    font-size: ${unitParser(12)};
  }
`}
`;
const warningText = i18nTxt('The Bounty has been offline from its corresponding national station and no longer supports viewing');

export default function BountyDeletedWarning() {
  const isMobile = useMobile();
  const [visible, toggleVisibility] = useToggle(false);

  return (
    <ItemWarning>
      {isMobile && [
        <button type="button" onClick={() => toggleVisibility()}>
          <i className="material-icons dp48 info-icon">info</i>
        </button>,
        <ConfirmComp
          show={visible}
          confirmBtns={
            <button className="agree" type="button" onClick={() => toggleVisibility()}>
              {i18nTxt('Close')}
            </button>
          }
          content={<p>{warningText}</p>}
        />,
      ]}
      {!isMobile && (
        <span className="item-warning">
          <Tooltip direction="topRight" tipSpan={<i className="material-icons dp48">info</i>}>
            {warningText}
          </Tooltip>
        </span>
      )}
    </ItemWarning>
  );
}
