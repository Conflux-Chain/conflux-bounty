import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import onClickOutside from 'react-onclickoutside';
import { compose } from 'redux';
import Input from '../Input/index';

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
    const { options, onSelect, selected = {}, errMsg, label } = this.props;
    const { showOptions } = this.state;
    let selectedLabel = '';

    const domList = options.map(v => {
      const onClick = () => {
        onSelect(v);
        this.setState({
          showOptions: false,
        });
      };
      const selectdIcon = (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 5.26923L3.52632 8.5L9 1.5" stroke="#3B3D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
      const isSelected = v.value === selected.value;
      if (isSelected) {
        selectedLabel = v.label;
      }
      return (
        /* eslint jsx-a11y/click-events-have-key-events: 0 */
        /* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */
        <li key={v.value} onClick={onClick} tabIndex="-1" type="button" className={isSelected ? 'active' : ''}>
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
        </li>
      );
    });

    return (
      <div className="select">
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
        <ul
          className="dropdown-content select-dropdown"
          style={{
            display: showOptions ? 'block' : 'none',
            maxHeight: 400,
          }}
        >
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
};

const enhance = compose(
  injectIntl,
  onClickOutside
);

export default enhance(Select);
