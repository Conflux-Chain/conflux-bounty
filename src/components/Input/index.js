import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import styled from 'styled-components';
import { i18nTxt } from '../../utils';
import unitParser from '../../utils/device';
import media from '../../globalStyles/media';

// const Y = unitParser((44 - 14 * 1.5) / 2);
const InputWrap = styled.div`
  > label {
    z-index: 1;
    background: #fff;
    left: 10px;
    width: auto !important;
    max-width: 100%;
    display: inline-block;
    color: #8e9394;
    transform: translateY(16px);
    font-size: 16px;
    ${media.mobile`
      top: 50%;
      transform: translateY(-50%);
      font-size: ${unitParser(14)};
      left: ${unitParser(8)};
    `}
  }
  &.col > label {
    margin-left: 10px;
  }

  > input:not(.browser-default) {
    border: 1px solid #bfc5c7;
    border-radius: 4px;
    box-sizing: border-box;
    text-indent: 16px;
    box-shadow: none;
    color: #171d1f;
    height: 56px;
    font-size: 16px;
    text-align: left;
    width: 100%;
    outline: none;
    vertical-align: middle;
    margin-bottom: 0;
    ${media.mobile`
      height: ${unitParser(44)};
      font-size: ${unitParser(14)};
      text-indent: ${unitParser(10)};
      &.invalid + label{
        transform: translateY(calc(-50% - 9px));
      }
    `}

    &:disabled,
    &[readonly='readonly'] {
      border: 1px solid #d8dddf;
    }
    &:disabled + label,
    &[readonly='readonly'] + label {
      color: #d8dddf;
    }
    &.invalid {
      border: 1px solid #ec6057;
    }
    &.invalid + label {
      color: #ec6057;
    }

    &:hover:not([readonly]) {
      border: 1px solid #595f61;
    }
    &:hover:not([readonly]) + label {
      color: #595f61;
    }

    &:focus:not([readonly]) {
      border: 1px solid #22b2d6;
      box-shadow: 0 0px 0px 1px #22b2d6;
    }
    &:focus:not([readonly]) + label {
      color: #22b2d6;
    }
  }
  > label.active {
    margin-top: 5px;
    top: 0;
  }
`;

class Input extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      isActive: false,
    };
    this.onFocus = () => {
      this.setState({
        isActive: true,
      });
    };
    this.onBlur = () => {
      this.setState({
        isActive: false,
      });
    };

    const { onChangeDebounced } = this.props;
    if (typeof onChangeDebounced === 'function') this.onChangeDebounced = debounce(onChangeDebounced, 400);
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
  }

  getInputRef = ref => {
    this.input = ref;
  };

  onLabelClick = () => {
    if (!this.input) return;
    this.input.focus();
  };

  onChange = e => {
    e.persist();
    const { onChange } = this.props;
    if (typeof onChange === 'function') onChange(e);
    if (this.onChangeDebounced) this.onChangeDebounced(e);
  };

  render() {
    const { id, type = 'text', value, label, onClick, className = '', errMsg, autoComplete, onKeyPress, disabled } = this.props;
    const { isActive } = this.state;
    let { placeHolder } = this.props;
    let activeCss = '';
    if (value || isActive) {
      activeCss = 'active';
    } else {
      placeHolder = '';
    }

    let inputClassName = '';
    let msgDiv;
    if (errMsg) {
      const errMsgFmt = i18nTxt(errMsg);
      msgDiv = (
        <span className="helper-text" data-error={errMsgFmt} data-success="">
          {errMsgFmt}
        </span>
      );
      inputClassName += 'invalid';
    }

    const inputOptions = {
      id,
      placeholder: placeHolder,
      type,
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onKeyPress,
      onClick,
      autoComplete,
      value,
      ref: this.getInputRef,
      className: inputClassName,
      disabled,
    };

    return (
      <InputWrap className={`input-field no-autoinit ${className}`}>
        <input {...inputOptions} />
        <label htmlFor={id} className={activeCss} onClick={this.onLabelClick}>
          {label}
        </label>
        {msgDiv}
      </InputWrap>
    );
  }
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeDebounced: PropTypes.func,
  onClick: PropTypes.func,
  onRef: PropTypes.func,
  type: PropTypes.string,
  autoComplete: PropTypes.string,
  placeHolder: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  errMsg: PropTypes.string,
  onKeyPress: PropTypes.func,
  disabled: PropTypes.bool,
};
Input.defaultProps = {
  // this won't work for chrome
  autoComplete: 'new-password',
  onChangeDebounced: undefined,
  type: 'text',
  placeHolder: '',
  className: '',
  onRef: () => {},
  onClick: () => {},
  onKeyPress: () => {},
  errMsg: '',
  disabled: false,
};

export default Input;
