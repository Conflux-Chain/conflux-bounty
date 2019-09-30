import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { i18nTxt } from '../../utils/i18n';

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
    const { id, type = 'text', value, label, onClick, className = '', errMsg, autoComplete, onKeyPress } = this.props;
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
    };

    return (
      <div className={`input-field no-autoinit ${className}`}>
        <input {...inputOptions} />
        <label htmlFor={id} className={activeCss} onClick={this.onLabelClick}>
          {label}
        </label>
        {msgDiv}
      </div>
    );
  }
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeDebounced: PropTypes.func,
  onClick: PropTypes.func,
  type: PropTypes.string,
  autoComplete: PropTypes.string,
  placeHolder: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  errMsg: PropTypes.string,
  onKeyPress: PropTypes.func,
};
Input.defaultProps = {
  // this won't work for chrome
  autoComplete: 'new-password',
  onChangeDebounced: undefined,
  type: 'text',
  placeHolder: '',
  className: '',
  onClick: () => {},
  onKeyPress: () => {},
  errMsg: '',
};

export default Input;
