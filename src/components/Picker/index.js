import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import RawPicker from './picker';
import unitParser from '../../utils/device';
import Input from '../Input';

const PickerWapper = styled.div`
  position: relative;
  width: 100%;
  color: #8e9394;

  .input-field {
    margin-top: 0;
  }
  svg {
    pointer-events: none;
    position: absolute;
    top: ${unitParser(44 / 2)};
    transform: translateY(-12px);
    right: 10px;
  }
`;
class Picker extends Component {
  state = {
    modalShow: false,
    currentSelect: {},
    confirmSelect: {},
  };

  id = `${Date.now()}-${Math.random()}`;

  showModal = () => {
    const { selected, data } = this.props;
    const currentSelect = selected.value ? data.find(option => option.value === selected.value) : data[0];
    this.setState({
      modalShow: true,
      currentSelect,
    });
  };

  closeModal = () => {
    this.setState({
      modalShow: false,
    });
    this.inputRef.input.blur();
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
    const { data } = this.props;
    const currentSelect = data.find(option => option.value === value.value);
    this.setState({
      currentSelect,
    });
  };

  render() {
    const { modalShow, currentSelect, confirmSelect } = this.state;
    const { data, label, errMsg } = this.props;
    return (
      <PickerWapper>
        <Input
          onRef={ref => {
            this.inputRef = ref;
          }}
          {...{
            id: this.id,
            value: confirmSelect.label,
            onChange: () => {},
            onClick: this.showModal,
            label,
            placeHolder: '',
            errMsg,
            type: 'button',
          }}
        />
        <svg height="24" viewbox="0 0 24 24" width="24">
          <path d="M7 10l5 5 5-5z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
        <RawPicker
          optionGroups={{ data }}
          valueGroups={{
            data: currentSelect.value ? currentSelect : data[0],
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
          show={modalShow}
        ></RawPicker>
      </PickerWapper>
    );
  }
}
const typeOpt = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};
Picker.propTypes = {
  label: PropTypes.string.isRequired,
  selected: PropTypes.objectOf(typeOpt),
  data: PropTypes.arrayOf(typeOpt),
  errMsg: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  itemHeight: PropTypes.number,
};

Picker.defaultProps = {
  selected: { value: '', label: '' },
  data: [],
  errMsg: '',
  itemHeight: 44,
};

export default Picker;
