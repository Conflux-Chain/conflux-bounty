import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

import unitParser from '../../utils/device';

import Clickoutside from '../Clickoutside';

const Modal = styled.div`
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
`;
const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const slideOutDown = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(100%);
  }
`;

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: ${unitParser(12)} ${unitParser(12)} 0 0;
  box-shadow: 0px -4px 20px rgba(0, 0, 0, 0.12);
  background-color: #fff;
  padding: ${unitParser(20)};

  &.show {
    animation: ${slideInUp} 0.2s ease-in;
  }
  &.hide {
    animation: ${slideOutDown} 0.2s ease-out;
  }
`;

class MobileModal extends Component {
  static preventDefault(e) {
    e.preventDefault();
  }

  close = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  render() {
    const { show, children } = this.props;
    if (show) {
      document.addEventListener('touchmove', MobileModal.preventDefault, { passive: false });
      return (
        <Modal>
          <Clickoutside onClickOutside={this.close}>
            <Container
              className="show"
              ref={ref => {
                this.containerRef = ref;
              }}
            >
              {children}
            </Container>
          </Clickoutside>
        </Modal>
      );
    }
    document.removeEventListener('touchmove', MobileModal.preventDefault, { passive: false });
    return <></>;
  }
}
MobileModal.propTypes = {
  show: PropTypes.bool,
  closeModal: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

MobileModal.defaultProps = {
  show: false,
  closeModal: () => {},
  children: '',
};

export default MobileModal;
