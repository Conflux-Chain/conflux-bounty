import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { compose } from 'redux';
import styled from 'styled-components';
import Input from '../Input/index';
import Picker from '../Picker';
import media from '../../globalStyles/media';

const selectdIcon = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M1 5.26923L3.52632 8.5L9 1.5" stroke="#3B3D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Dropdown = styled.ul`
  display: none;
  max-height: 400px;

  ${props =>
    props.showOptions &&
    `
    &.select-dropdown.dropdown-content {
      display: block;
    }
  `}

  ${media.mobile`
    &.select-dropdown.dropdown-content {
      display: none !important;
    }
  `}
`;

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

        <Picker
          show={showOptions}
          options={options}
          onSelect={onSelect}
          toggleOptions={this.toggleOptions}
          selected={selected.value}
        ></Picker>

        <Dropdown className="dropdown-content select-dropdown" showOptions={showOptions}>
          <div className="select-ul-label">{ulLabel}</div>
          {domList}
        </Dropdown>
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
  errMsg: '',
  theme: '',
  showSelectedIcon: true,
  ulLabel: null,
  labelType: 'input',
};

const enhance = compose(onClickOutside);

export default enhance(Select);
