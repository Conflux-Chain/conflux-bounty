import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import media from '../../globalStyles/media';

const Overlay = styled.div`
  z-index: 199;
  background: rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  margin: auto;
  overflow: auto;
  z-index: 299;
  top: 50%;
  left: 50%;
  max-height: 90vh;
  max-width: 90vw;
  transform: translate(-50%, -50%) !important;

  ${media.mobile`
    min-width: 100%;
    padding: 12px;
  `}
`;

class ModalComp extends PureComponent {
  constructor(...args) {
    super(...args);
    this.escListener = e => {
      if (e.key === 'Escape') {
        const { onEsc } = this.props;
        onEsc();
      }
    };
    document.addEventListener('keyup', this.escListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.escListener);
  }

  render() {
    const { children, show, showOverlay } = this.props;
    if (show) {
      return (
        <React.Fragment>
          <ModalWrapper>
            <React.Fragment>{children}</React.Fragment>
          </ModalWrapper>
          {showOverlay && <Overlay />}
        </React.Fragment>
      );
    }

    return <React.Fragment></React.Fragment>;
  }
}

ModalComp.propTypes = {
  children: PropTypes.element.isRequired,
  show: PropTypes.bool.isRequired,
  showOverlay: PropTypes.bool,
  onEsc: PropTypes.func,
};

ModalComp.defaultProps = {
  showOverlay: true,
  onEsc: () => {},
};

export default ModalComp;
