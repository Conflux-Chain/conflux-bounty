import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { i18nTxt } from '../../utils/i18n';

const Wrap = styled.div`
  /* stylelint-disable font-family-no-missing-generic-family-keyword */
  width: 300px;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 5px;
  position: relative;
  .toast-title {
    font-size: 16px;
    font-weight: 500;
  }
  .toast-icon {
    float: left;
    font-size: 50px;
    height: 50px;
    width: 50px;
  }
  .close {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 16px;
    height: 16px;
    font-size: 16px;
    font-style: normal;
    font-family: Tahoma;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }

  /* colors */
  &.toast-error {
    color: #fff;
    border-color: #dc3545;
    background-color: #dc3545;
  }

  &.toast-success {
    color: #fff;
    border-color: #28a745;
    background-color: #28a745;
  }
  &.toast-info {
    color: #fff;
    border-color: #28a745;
    background-color: rgba(153, 153, 153, 0.9);
    > .toast-icon {
      font-size: 46px;
    }
  }
  .toggle-details {
    text-align: right;
    cursor: pointer;
  }
`;

/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */

class ToastMessage extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      showToggle: false,
    };
  }

  render() {
    const { title, content, level, onClose, detail } = this.props;
    const { showToggle } = this.state;

    let iconClassName;
    if (level === 'error') {
      iconClassName = 'times circle';
    } else if (level === 'success') {
      iconClassName = 'check circle';
    } else {
      iconClassName = 'info circle';
    }

    return (
      <Wrap className={`toast-${level}`}>
        <i className={`material-icons dp48 toast-icon ${iconClassName}`}>error</i>
        <div className="toast-content">
          {title ? <div className="toast-title">{i18nTxt(title)}</div> : null}
          <div className="toast-body">{i18nTxt(content)}</div>
        </div>
        <div
          className="toggle-details"
          onClick={() => {
            this.setState({
              showToggle: !showToggle,
            });
          }}
        >
          {showToggle ? i18nTxt('hide details') : i18nTxt('show details')}
          {showToggle ? <span>&#8607;</span> : <span>&#8609;</span>}
        </div>
        <div className="toast-detail" style={{ display: showToggle ? 'block' : 'none' }}>
          {detail && i18nTxt(detail)}
        </div>
        <i role="button" type="button" className="close" onClick={onClose} onKeyDown={() => {}} tabIndex="-1">
          &times;
        </i>
      </Wrap>
    );
  }
}

ToastMessage.propTypes = {
  level: PropTypes.string.isRequired,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
};

ToastMessage.defaultProps = {
  title: '',
};

export default ToastMessage;
