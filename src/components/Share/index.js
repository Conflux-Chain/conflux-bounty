import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Modal from '../Modal';
import * as actions from './action';
import { i18nTxt } from '../../utils';

const Canvas = styled.canvas`
  display: block;
  margin: 0 auto;
  width: 200px;
  height: 200px;
`;
const Wrap = styled.div`
  background: rgb(51, 51, 51, 0.9);
  border-radius: 12px;
  width: 300px;
  padding-bottom: 40px;
  .close {
    position: absolute;
    color: #fff;
    font-weight: 500;
    top: 0px;
    right: 10px;
    font-size: 24px;
    width: 16px;
    height: 16px;
    font-style: normal;
    font-family: Tahoma;
    cursor: pointer;
    outline: none;
  }
  .scantips {
    color: #fff;
    text-align: center;
    font-size: 20px;
    padding-top: 20px;
    margin-bottom: 20px;
  }
`;

class Share extends Component {
  constructor(...args) {
    super(...args);
    this.setRef = c => {
      this.canvasRef = c;
    };
    this.onClose = () => {
      const { update } = this.props;
      update({
        show: false,
      });
    };
  }

  componentDidUpdate() {
    const { show, qrTxt } = this.props;
    if (show) {
      import('qrcode').then(QRCode => {
        QRCode.toCanvas(
          this.canvasRef,
          qrTxt,
          {
            width: actions.canvasW,
            height: actions.canvasH,
          },
          error => {
            if (error) console.error(error);
          }
        );
      });
    }
  }

  render() {
    const { show } = this.props;

    return (
      <Modal show={show} showOverlay={false}>
        <Wrap>
          <i className="close" tabIndex="-1" onClick={this.onClose} onKeyDown={() => {}} role="button">
            &times;
          </i>
          <div className="scantips">{i18nTxt('Scan to Share')}</div>
          <Canvas width="200" height="200" ref={this.setRef} />
        </Wrap>
      </Modal>
    );
  }
}

Share.propTypes = {
  show: PropTypes.bool.isRequired,
  update: PropTypes.func.isRequired,
  qrTxt: PropTypes.string,
};
Share.defaultProps = {
  qrTxt: '',
};

function mapStateToProps(state) {
  return state.frameworks.share;
}

export default connect(
  mapStateToProps,
  actions
)(Share);
