import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import RawPicker from './rawPicker';
import unitParser from '../../utils/device';
import MobileModal from '../MobileModal';
import Input from '../Input';
import { i18nTxt } from '../../utils';

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
const Operator = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${unitParser(14)};
  margin-bottom: ${unitParser(40)};
  > button {
    padding: unset;
    &:nth-child(1) {
      color: #8e9394;
    }
    &:nth-last-child(1) {
      color: #22b2d6;
    }
  }
`;

const Empty = styled.div`
  height: ${unitParser(132)};
  line-height: ${unitParser(132)};
  font-size: ${unitParser(20)};
  text-align: center;
`;
class Picker extends Component {
  state = {
    modalShow: false,
    currentSelect: {},
    confirmSelect: {},
  };

  id = `${Date.now()}-${Math.random()}`;

  showModal = () => {
    const { selected } = this.props;
    this.setState({
      modalShow: true,
      currentSelect: selected,
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
    const { onSelect } = this.props;
    this.setState({
      confirmSelect: this.currentSelect,
    });
    onSelect(this.currentSelect);
    this.closeModal();
    this.clearSelect();
  };

  clearSelect = () => {
    this.setState({
      currentSelect: { value: '' },
    });
  };

  changeValue = value => {
    const { data } = this.props;
    this.currentSelect = data.find(option => option.value === value.value);
    this.setState({
      currentSelect: this.currentSelect,
    });
  };

  render() {
    const { modalShow, currentSelect, confirmSelect } = this.state;
    const { data, label, errMsg } = this.props;
    console.log(data, currentSelect, 'value');
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
        <MobileModal show={modalShow} closeModal={this.closeModal}>
          <Operator>
            <button type="button" onClick={this.cancelSelection}>
              {i18nTxt('CANCEL')}
            </button>
            {!!data.length && (
              <button type="button" onClick={this.confirmSelection}>
                {i18nTxt('CONFIRM')}
              </button>
            )}
          </Operator>
          {data.length ? (
            <RawPicker
              optionGroups={{ data }}
              valueGroups={{
                data: currentSelect.value ? currentSelect : data[0],
              }}
              onChange={this.changeValue}
            ></RawPicker>
          ) : (
            <Empty>{i18nTxt('No Data')}</Empty>
          )}
        </MobileModal>
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
