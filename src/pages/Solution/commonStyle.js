import styled from 'styled-components';
import React, { Fragment } from 'react';
import { flexCenterMiddle } from '../../globalStyles/common';
import { MILESTONE_STATUS_ENUM } from '../../constants';
import { i18nTxt } from '../../utils';
import unitParser from '../../utils/device';
import media from '../../globalStyles/media';

export const MileStoneDiv = styled.div`
  display: flex;
  .input-field {
    margin-top: 0;
    margin-bottom: 5px;
    .helper-text {
      margin-bottom: 10px;
      margin-top: -5px;
    }
  }
  .milestone-step {
    flex-shrink: 0;
    margin-right: 8px;
    position: relative;
  }
  .step-box {
    width: 69px;
    height: 44px;
    background: #f7f9fa;
    border: 1px solid #d7dddf;
    box-sizing: border-box;
    border-radius: 4px;
    color: #595f61;
    position: relative;
    z-index: 10;
    ${flexCenterMiddle}
    &.approved {
      border-color: #22b2d6;
      background: #22b2d6;
      color: #fff;
    }
    ${media.mobile`
      font-size: ${unitParser(14)};
      line-height: ${unitParser(14)};
    `}
  }
  .milestone-right {
    flex: 1;
  }
  .step-box-line {
    width: 2px;
    transform: scaleX(0.6);
    height: 100%;
    background: #ccc;
    margin-left: 50%;
    &.approved {
      background: #22b2d6;
      width: 2px;
    }
  }
  .step-box-line-half {
    background: #22b2d6;
    width: 2px;
    position: absolute;
    top: 0;
    left: 50%;
    height: calc(50% + 22px);
  }
`;

export const MileStoneProgress = styled(MileStoneDiv)`
  .duration {
    font-size: 12px;
    line-height: 12px;
    color: #8e9394;
  }
  .milestone-step {
    margin-right: 20px;
    overflow: hidden;
    min-height: 140px;
  }
  .milestone-right > h5 {
    margin: 0;
    margin-top: 8px;
    margin-bottom: 5px;
    color: #171d1f;
    font-size: 16px;
    font-weight: 500;
  }
  .milestone-right {
    margin-top: 3px;
    padding-bottom: 30px;
  }
  .milestone-right > p {
    font-size: 12px;
    line-height: 16px;
    color: #595f61;
    margin: 0;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  &:last-child .milestone-right {
    padding-bottom: 0;
  }

  ${media.mobile`
  .duration {
    font-size: ${unitParser(12)};
    line-height: ${unitParser(12)};
  }
  .milestone-right > h5 {
    font-size: ${unitParser(16)};
    line-height: ${unitParser(16)};
  }
  .milestone-right > p {
    font-size: ${unitParser(12)};
    line-height: ${unitParser(16)};
  }
`}
`;

export const StatusTagDiv = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  display: inline-block;
  &.FINISHED {
    color: #4a9e81;
    border: 1px solid #4a9e81;
  }
  &.ONGOING {
    color: #1f1f1f;
    border: 1px solid #1f1f1f;
  }
  &.HAND_IN {
    color: #d43429;
    border: 1px solid #d43429;
  }

  &.REVIEWING,
  &.OPEN,
  &.AUDITING {
    color: #2f69a5;
    border: 1px solid #2f69a5;
  }
  &.PENDING {
    color: #e76a25;
    border: 1px solid #e76a25;
  }
  &.EXPIRED {
    color: #d43429;
    border: 1px solid #d43429;
  }
`;

export function stepBoxLine(status, index, total) {
  const hideLast = {
    visibility: total - 1 === index ? 'hidden' : 'visible',
    display: total - 1 === index ? 'none' : 'inherit',
  };

  let boxLine = null;
  if (status === MILESTONE_STATUS_ENUM.PENDING || status === MILESTONE_STATUS_ENUM.EXPIRED) {
    boxLine = (
      <Fragment>
        <div className="step-box">
          {i18nTxt('Step')} {index + 1}
        </div>
        <div className="step-box-line" style={hideLast}></div>
      </Fragment>
    );
  } else if (status === MILESTONE_STATUS_ENUM.ONGOING || status === MILESTONE_STATUS_ENUM.AUDITING) {
    boxLine = (
      <Fragment>
        <div className="step-box approved">
          {i18nTxt('Step')} {index + 1}
        </div>
        <div className="step-box-line"></div>
        <div className="step-box-line-half"></div>
      </Fragment>
    );
  } else if (status === MILESTONE_STATUS_ENUM.FINISHED) {
    boxLine = (
      <Fragment>
        <div className="step-box approved">
          {i18nTxt('Step')} {index + 1}
        </div>
        <div className="step-box-line approved" style={hideLast}></div>
      </Fragment>
    );
  }

  return boxLine;
}
