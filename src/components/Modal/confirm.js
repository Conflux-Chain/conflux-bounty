import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Modal from './index';
import unitParser from '../../utils/device';
import media from '../../globalStyles/media';

const Confirm = styled.div`
  padding: 20px;

  > div {
    min-width: 240px;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: rgba(0, 0, 0, 0.12) 2px 4px 20px;
  }
  .h2 {
    font-size: 20px;
    line-height: 20px;
    color: #171d1f;
    margin: 0;
    font-weight: 500;
    margin-bottom: 20px;
  }
  .p {
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 20px;
  }
  .confirm-actions {
    text-align: right;
  }
  .confirm-actions > button {
    outline: none;
    border: none;
    cursor: pointer;
    color: #595f61;
    padding-left: 5px;
    padding-right: 5px;
    font-size: 16px;
    &:focus {
      background: none;
    }
  }
  .confirm-actions .agree {
    margin-left: 20px;
    color: #22b2d6;
  }
  ${media.mobile`
    padding: ${unitParser('12dp')};
    > div {
      padding: ${unitParser('20dp')};
    }
    .h2 {
      font-size: ${unitParser('20dp')};
      margin-bottom: ${unitParser('20dp')};
    }
    .p,
    .confirm-actions > button {
      color: #3b3d3d;
      font-size: ${unitParser('14dp')};
    }
  `}
`;

class ConfirmComp extends PureComponent {
  render() {
    const { content, title, confirmBtns, show, wrapStyle } = this.props;

    return (
      <Modal show={show} showOverlay={false}>
        <Confirm>
          <div style={wrapStyle}>
            <div className="h2">{title}</div>
            <div className="p">{content}</div>
            <div className="confirm-actions">
              {confirmBtns}
              {/* <button className="agree" type="button">
                YES
              </button> */}
            </div>
          </div>
        </Confirm>
      </Modal>
    );
  }
}

const elemType = PropTypes.oneOfType([PropTypes.string, PropTypes.element]);

ConfirmComp.propTypes = {
  show: PropTypes.bool.isRequired,
  content: elemType,
  title: elemType,
  confirmBtns: elemType.isRequired,
  wrapStyle: PropTypes.objectOf({
    width: PropTypes.string,
  }),
};

ConfirmComp.defaultProps = {
  content: '',
  title: '',
  wrapStyle: {},
};

export default ConfirmComp;
