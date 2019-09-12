import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import onClickOutside from 'react-onclickoutside';
import { compose } from 'redux';
import Input from '../Input/index';

const selectdIcon = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M1 5.26923L3.52632 8.5L9 1.5" stroke="#3B3D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */
class Select extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      showOptions: false,
    };
    this.id = `${Date.now()}-${Math.random()}`;
  }

  toggleOptions = () => {
    const { showOptions } = this.state;
    this.setState({
      showOptions: !showOptions,
    });
  };

  handleClickOutside = () => {
    this.setState({
      showOptions: false,
    });
  };

  render() {
    const { options, onSelect, selected = {}, errMsg, label, theme, showSelectedIcon, ulLabel, labelType } = this.props;
    const { showOptions } = this.state;
    let selectedLabel = '';

    const domList = options.map(v => {
      const onClick = () => {
        onSelect(v);
        this.setState({
          showOptions: false,
        });
      };

      const isSelected = v.value === selected.value;
      if (isSelected) {
        selectedLabel = v.label;
      }

      let content;
      if (showSelectedIcon) {
        content = (
          <span>
            {isSelected ? selectdIcon : null}
            <span
              style={{
                paddingLeft: isSelected ? '8px' : '18px',
              }}
            >
              {v.label}
            </span>
          </span>
        );
      } else {
        content = <span>{v.label}</span>;
      }

      return (
        <li key={v.value} onClick={onClick} tabIndex="-1" className={isSelected ? 'active' : ''}>
          {content}
        </li>
      );
    });

    return (
      <div className={`select ${theme}`}>
        {labelType === 'text' ? (
          <div tabIndex="-1" className="labelInput" onClick={this.toggleOptions}>
            {selectedLabel}
          </div>
        ) : (
          <Input
            {...{
              id: this.id,
              value: selectedLabel,
              onChange: () => {},
              onClick: this.toggleOptions,
              label,
              placeHolder: '',
              errMsg,
              type: 'button',
            }}
          />
        )}

        <ul
          className="dropdown-content select-dropdown"
          style={{
            display: showOptions ? 'block' : 'none',
            maxHeight: 400,
          }}
        >
          <div className="select-ul-label">{ulLabel}</div>
          {domList}
        </ul>
        <svg style={{ pointerEvents: 'none' }} className="caret" height="24" viewbox="0 0 24 24" width="24">
          <path d="M7 10l5 5 5-5z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </div>
    );
  }
}

const typeOpt = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};
Select.propTypes = {
  selected: PropTypes.objectOf(typeOpt),
  options: PropTypes.arrayOf(typeOpt),
  label: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  errMsg: PropTypes.string,
  theme: PropTypes.string,
  showSelectedIcon: PropTypes.bool,
  ulLabel: PropTypes.element,
  labelType: PropTypes.string,
};
Select.defaultProps = {
  selected: {
    value: '',
    label: '',
  },
  options: [],
  intl: {
    formatMessage: () => {},
  },
  errMsg: '',
  theme: '',
  showSelectedIcon: true,
  ulLabel: null,
  labelType: 'input',
};

const enhance = compose(
  injectIntl,
  onClickOutside
);

export default enhance(Select);
