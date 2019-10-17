// modified from https://github.com/adcentury/react-mobile-picker

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Modal from '../Modal';
import { i18nTxt } from '../../utils/i18n';
import media from '../../globalStyles/media';
import unitParser from '../../utils/device';
/* eslint no-restricted-syntax: 0 */
/* eslint prefer-template: 0 */
/* eslint react/no-multi-comp: 0 */
/* eslint no-restricted-syntax: 0 */
/* eslint guard-for-in: 0 */
/* eslint react/destructuring-assignment: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */

const typeOption = PropTypes.shape({
  value: PropTypes.string,
  label: PropTypes.string,
});

const PickContainerDiv = styled.div`
  z-index: 10001;
  width: 100%;
  background: #fff;
  &,
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  .picker-inner {
    position: relative;
    display: flex;
    justify-content: center;
    height: 100%;
    padding: 0 20px;
    font-size: 1.2em;
    -webkit-mask-box-image: linear-gradient(to top, transparent, transparent 5%, white 20%, white 80%, transparent 95%, transparent);
  }
  .picker-column {
    flex: 1 1;
    position: relative;
    max-height: 100%;
    overflow: hidden;
    text-align: center;
    .picker-scroller {
      transition: 300ms;
      transition-timing-function: ease-out;
      touch-action: none;
    }
    .picker-item {
      position: relative;
      font-size: 20px;
      padding: 0 10px;
      white-space: nowrap;
      color: #8e9394;
      overflow: hidden;
      text-overflow: ellipsis;
      &.picker-item-selected {
        color: #22b2d6;
      }
    }
  }
  .picker-highlight {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    margin-top: -20px;
    width: 200px;
    left: 50%;
    margin-left: -100px;
    pointer-events: none;
    &:before,
    &:after {
      content: ' ';
      position: absolute;
      left: 0;
      right: auto;
      display: block;
      width: 100%;
      height: 2px;
      background-color: #22b2d6;
    }
    &:before {
      top: 0;
      bottom: auto;
    }
    &:after {
      bottom: 0;
      top: auto;
    }
  }
`;
const PickerWrap = styled.div`
  background: #fff;
  box-shadow: 0px -4px 20px rgba(0, 0, 0, 0.12);

  ${media.mobile`
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    width: 100%;
  `}
`;
const PickerHead = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  button {
    width: 74px;
    line-height: 32px;
    font-size: 14px;
    font-weight: 500;
    &:nth-child(1) {
      color: #8e9394;
    }
    &:nth-child(2) {
      color: #22b2d6;
    }
  }
`;
const Empty = styled.div`
  height: ${unitParser(120)};
  line-height: ${unitParser(120)};
  font-size: ${unitParser(16)};
  text-align: center;
`;
class PickerColumn extends Component {
  static propTypes = {
    // value: PropTypes.any.isRequired,
    itemHeight: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(typeOption).isRequired,
    value: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0,
      ...this.computeTranslate(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isMoving) {
      return;
    }
    this.setState(this.computeTranslate(nextProps));
  }

  computeTranslate = props => {
    const { options, value, itemHeight, columnHeight } = props;
    // let selectedIndex = options.indexOf(value);

    let selectedIndex = -1;
    for (let i = 0; i < options.length; i += 1) {
      if (options[i].value === value.value) {
        selectedIndex = i;
        break;
      }
    }

    if (selectedIndex < 0) {
      // throw new ReferenceError();
      this.onValueSelected(options[0]);
      selectedIndex = 0;
    }
    return {
      scrollerTranslate: columnHeight / 2 - itemHeight / 2 - selectedIndex * itemHeight,
      minTranslate: columnHeight / 2 - itemHeight * options.length + itemHeight / 2,
      maxTranslate: columnHeight / 2 - itemHeight / 2,
    };
  };

  onValueSelected = newValue => {
    this.props.onChange(this.props.name, newValue);
  };

  handleTouchStart = event => {
    const startTouchY = event.targetTouches[0].pageY;
    this.setState(({ scrollerTranslate }) => ({
      startTouchY,
      startScrollerTranslate: scrollerTranslate,
    }));
  };

  handleTouchMove = event => {
    event.preventDefault();
    const touchY = event.targetTouches[0].pageY;
    this.setState(({ isMoving, startTouchY, startScrollerTranslate, minTranslate, maxTranslate }) => {
      if (!isMoving) {
        return {
          isMoving: true,
        };
      }

      let nextScrollerTranslate = startScrollerTranslate + touchY - startTouchY;
      if (nextScrollerTranslate < minTranslate) {
        nextScrollerTranslate = minTranslate - (minTranslate - nextScrollerTranslate) ** 0.8;
      } else if (nextScrollerTranslate > maxTranslate) {
        nextScrollerTranslate = maxTranslate + (nextScrollerTranslate - maxTranslate) ** 0.8;
      }
      return {
        scrollerTranslate: nextScrollerTranslate,
      };
    });
  };

  handleTouchEnd = () => {
    if (!this.state.isMoving) {
      return;
    }
    this.setState({
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0,
    });
    setTimeout(() => {
      const { options, itemHeight } = this.props;
      const { scrollerTranslate, minTranslate, maxTranslate } = this.state;
      let activeIndex;
      if (scrollerTranslate > maxTranslate) {
        activeIndex = 0;
      } else if (scrollerTranslate < minTranslate) {
        activeIndex = options.length - 1;
      } else {
        activeIndex = -Math.floor((scrollerTranslate - maxTranslate) / itemHeight);
      }
      this.onValueSelected(options[activeIndex]);
    }, 0);
  };

  handleTouchCancel = () => {
    if (!this.state.isMoving) {
      return;
    }
    this.setState(startScrollerTranslate => ({
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0,
      scrollerTranslate: startScrollerTranslate,
    }));
  };

  handleItemClick = option => {
    if (option !== this.props.value) {
      this.onValueSelected(option);
    }
  };

  renderItems() {
    const { options, itemHeight, value } = this.props;
    return options.map(option => {
      const style = {
        height: `${itemHeight}px`,
        lineHeight: `${itemHeight}px`,
      };

      let className;

      if (option.value === value.value) {
        className = 'picker-item picker-item-selected';
      } else {
        className = 'picker-item';
      }

      return (
        <div className={className} style={style} onClick={() => this.handleItemClick(option)}>
          {option.label}
        </div>
      );
    });
  }

  render() {
    const translateString = `translate3d(0, ${this.state.scrollerTranslate}px, 0)`;
    const style = {
      MsTransform: translateString,
      MozTransform: translateString,
      OTransform: translateString,
      WebkitTransform: translateString,
      transform: translateString,
    };
    if (this.state.isMoving) {
      style.transitionDuration = '0ms';
    }

    const { options } = this.props;
    if (options.length === 1) {
      return (
        <div className="picker-column-middle">
          <div onClick={() => this.handleItemClick(options[0])}>{options[0].label}</div>
        </div>
      );
    }

    return (
      <div className="picker-column">
        <div
          className="picker-scroller"
          style={style}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onTouchCancel={this.handleTouchCancel}
        >
          {this.renderItems()}
        </div>
      </div>
    );
  }
}

export default class Picker extends Component {
  static propTypes = {
    optionGroups: PropTypes.objectOf(PropTypes.arrayOf(typeOption)).isRequired,
    valueGroups: PropTypes.objectOf(typeOption).isRequired,
    onChange: PropTypes.func.isRequired,
    itemHeight: PropTypes.number,
    height: PropTypes.number,
    show: PropTypes.bool,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
  };

  static defaultProps = {
    itemHeight: 40,
    height: 160,
    show: false,
    onCancel: () => {},
    onConfirm: () => {},
  };

  isRenderInder() {
    const { optionGroups } = this.props;
    for (const name in optionGroups) {
      if (!optionGroups[name].length) {
        return false;
      }
    }
    return true;
  }

  renderInner() {
    const { optionGroups, valueGroups, itemHeight, height, onChange } = this.props;
    const highlightStyle = {
      height: itemHeight,
      marginTop: -(itemHeight / 2),
    };
    const columnNodes = [];
    // eslint-disable-next-line no-unused-vars
    for (const name in optionGroups) {
      columnNodes.push(
        <PickerColumn
          key={name}
          name={name}
          options={optionGroups[name]}
          value={valueGroups[name]}
          itemHeight={itemHeight}
          columnHeight={height}
          onChange={onChange}
        />
      );
    }
    return (
      <div className="picker-inner">
        {columnNodes}
        <div className="picker-highlight" style={highlightStyle}></div>
      </div>
    );
  }

  render() {
    const style = {
      height: this.props.height,
    };
    const { show, onCancel, onConfirm } = this.props;

    return (
      <Modal show={show} showOverlay onEsc={onCancel} overlayStyle={media.mobile && { position: 'fixed' }} mobilePosBottom>
        <PickerWrap>
          <PickerHead>
            <button type="button" onClick={onCancel}>
              {i18nTxt('CANCEL')}
            </button>
            {this.isRenderInder() && (
              <button type="button" onClick={onConfirm}>
                {i18nTxt('CONFIRM')}
              </button>
            )}
          </PickerHead>
          {this.isRenderInder() ? (
            <PickContainerDiv style={style}>{this.renderInner()}</PickContainerDiv>
          ) : (
            <Empty>{i18nTxt('No Data')}</Empty>
          )}
        </PickerWrap>
      </Modal>
    );
  }
}
