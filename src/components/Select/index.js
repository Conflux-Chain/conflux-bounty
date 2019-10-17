import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import onClickOutside from 'react-onclickoutside';
import { compose } from 'redux';
import Input from '../Input/index';
import Picker from '../Picker';
import unitParser, { isMobile } from '../../utils/device';
import media from '../../globalStyles/media';

const selectdIcon = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M1 5.26923L3.52632 8.5L9 1.5" stroke="#3B3D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Caret = styled.svg`
  position: absolute;
  top: 28px;
  transform: translateY(-12px);
  right: 10px;
  ${media.mobile`
    top: ${unitParser(44 / 2)}
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
      currentSelect: {},
      confirmSelect: {},
    };
    this.id = `${Date.now()}-${Math.random()}`;
  }

  toggleOptions = () => {
    const { showOptions } = this.state;
    this.setState({
      showOptions: !showOptions,
    });
  };

  showModal = () => {
    const { selected, options } = this.props;
    if (options.length) {
      const currentSelect = selected.value ? options.find(option => option.value === selected.value) : options[0];
      this.setState({
        currentSelect,
      });
    }
    this.setState({
      showOptions: true,
    });
  };

  closeModal = () => {
    this.setState({
      showOptions: false,
    });
  };

  handleClickOutside = () => {
    this.setState({
      showOptions: false,
    });
  };

  cancelSelection = () => {
    this.closeModal();
    this.clearSelect();
  };

  confirmSelection = () => {
    const { currentSelect } = this.state;
    const { onSelect } = this.props;
    this.setState({
      confirmSelect: currentSelect,
    });
    onSelect(currentSelect);
    this.closeModal();
  };

  clearSelect = () => {
    this.setState({
      currentSelect: { value: '' },
    });
  };

  changeValue = value => {
    const { options } = this.props;
    const currentSelect = options.find(option => option.value === value.value);
    this.setState({
      currentSelect,
    });
  };

  render() {
    const { options, onSelect, selected = {}, errMsg, label, theme, showSelectedIcon, ulLabel, labelType } = this.props;
    const { showOptions, currentSelect, confirmSelect } = this.state;
    let selectedLabel = '';
    let domList;
    if (labelType === 'input' && isMobile()) {
      selectedLabel = confirmSelect.label;
    } else {
      domList = options.map(v => {
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
    }

    let disabled = false;
    if (options.length === 0) {
      disabled = true;
    }

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
              onClick: isMobile() ? this.showModal : this.toggleOptions,
              label,
              placeHolder: '',
              errMsg,
              type: 'button',
              disabled,
            }}
          />
        )}
        {labelType === 'input' && isMobile() ? (
          <Picker
            optionGroups={{ options }}
            valueGroups={{
              options: currentSelect.value ? currentSelect : options[0],
            }}
            onChange={(name, val) => {
              this.changeValue(val);
            }}
            height={160}
            onCancel={() => {
              this.cancelSelection();
            }}
            onConfirm={() => {
              this.confirmSelection();
            }}
            show={showOptions}
          ></Picker>
        ) : (
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
        )}

        <Caret style={{ pointerEvents: 'none' }} className="caret" height="24" viewbox="0 0 24 24" width="24">
          <path d="M7 10l5 5 5-5z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </Caret>
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
