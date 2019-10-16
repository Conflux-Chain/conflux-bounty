import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classnames from 'classnames';
import { i18nTxt } from '../../utils';
import unitParser from '../../utils/device';
import media from '../../globalStyles/media';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  .status-image {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    .status-item {
      display: flex;
      align-items: center;
      justify-content: center;
      .status-point {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #fff;
        &.open {
          background-color: #171d1f;
        }
        &.bold {
          width: 8px;
          height: 8px;
        }
      }
      .status-line {
        width: 70px;
        ${media.mobile`
           width: ${unitParser(70)};
  `}
        height: 0px;
        &.open {
          border: 1px solid #171d1f;
        }
        border: 1px solid #fff;
      }
    }
  }
  .status-text {
    display: flex;
    width: 335px;
    height: 20px;
    position: relative;
    align-items: center;
    justify-content: space-between;

    ${media.mobile`
      width: ${unitParser(335)};
      height: ${unitParser(20)};
    `}

    .text-item {
      font-size: 12px;
      line-height: 12px;
      white-space: nowrap;
      ${media.mobile`
        font-size: ${unitParser(12)};
        line-height: ${unitParser(12)};
      `}
      &.bold {
        font-weight: 700;
      }
    }
  }
`;

function BountyStatus(props) {
  const { statusItems, status } = props;

  return (
    <Container>
      <div className="status-image">
        {statusItems.map((item, index) => {
          if (index !== statusItems.length - 1) {
            return (
              <div className="status-item">
                <div className={classnames('status-point', { bold: status === item, open: status === 'Open' })}></div>
                <div className={classnames('status-line', { open: status === 'Open' })}></div>
              </div>
            );
          }
          return (
            <div className="status-item">
              <div className={classnames('status-point', { bold: status === item, open: status === 'Open' })}></div>
            </div>
          );
        })}
      </div>
      <div className="status-text">
        {statusItems.map(item => {
          return <div className={classnames('text-item', { bold: status === item })}>{i18nTxt(item)}</div>;
        })}
      </div>
    </Container>
  );
}

BountyStatus.propTypes = {
  statusItems: PropTypes.arrayOf(PropTypes.string),
  status: PropTypes.string.isRequired,
};

BountyStatus.defaultProps = {
  statusItems: ['Open', 'Ongoing', 'Auditing', 'Final Auditing', 'Finished'],
};

export default BountyStatus;
