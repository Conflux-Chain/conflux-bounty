import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import media from '../../globalStyles/media';
import { i18nTxt } from '../../utils';

const PickerWrapper = styled.div`
  display: none;
  font-family: SF Pro Display;

  .button-wrapper button {
    padding: 9px 8px;
    font-size: 14px;
    line-height: 14px;
  }
  .button-wrapper button.left {
    color: #8e9394;
  }
  .button-wrapper button.right {
    color: #22b2d6;
  }

  ${media.mobile`
    bottom: 0;
    top: auto;
    left: 0;
    position: fixed;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    box-shadow: 0px -4px 20px rgba(0, 0, 0, 0.12);
    padding: 12px;
    z-index: 999999;
    height: 236px;
    width: 100%;
    background: #FFFFFF;

    ${props =>
      props.show &&
      `
      display: block;
      `}
  `}
`;

const List = styled.ul`
  margin: 56px 8px 28px 8px;
  text-align: center;
  font-size: 20px;
  line-height: 20px;
  position: relative;
  max-height: 132px;
  overflow-y: auto;
  color: #8e9394;
  overscroll-behavior: none;
  scroll-snap-type: y mandatory;
  // old compatilibity
  scroll-snap-points-y: repeat(44px);

  // hide scrollbar
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow: -moz-scrollbars-none;
  &::-webkit-scrollbar {
    display: none;
  }

  hr {
    margin: 0 auto;
    width: 200px;
    background: #22b2d6;
    height: 2px;
    border: 0;
    position: sticky;
  }
  hr.top {
    top: 45px;
  }
  hr.bottom {
    top: 88px;
  }
  li {
    padding: 12px 60px;
    min-height: 20px;
    scroll-snap-align: center;
  }
  li:focus {
    outline: none;
  }
  li.empty {
    padding: 22px 60px;
  }
  > li > span {
    padding: 0 !important;
  }
  li.selected {
    color: #22b2d6;
  }
`;

const Backdrop = styled.div`
  display: none;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 999;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.2);

  ${media.mobile`
    ${props => props.show && `display: block;`}
    `}
`;

class Picker extends Component {
  constructor(...args) {
    super(...args);

    this.listRef = React.createRef();
    this.domList = [];
  }

  toggleOptions = () => {
    const { showOptions } = this.state;
    this.setState({
      showOptions: !showOptions,
    });
  };

  onClick = () => {
    const { options, onSelect, toggleOptions } = this.props;
    const { top: topBound, bottom: bottomBound } = this.listRef && this.listRef.current.getBoundingClientRect();

    const childOptions = Array.from(this.listRef.current.childNodes).filter(c => {
      return c.tagName === 'LI';
    });

    const visibleOptions = childOptions.filter(o => {
      if (!o) {
        return false;
      }
      const { top, bottom } = o.getBoundingClientRect();
      return bottom > topBound && top < bottomBound;
    });

    const index = visibleOptions[1].getAttribute('index');
    onSelect(options[index]);
    toggleOptions();
  };

  render() {
    const { options, show, toggleOptions } = this.props;

    const domList = options.map((o, i) => {
      return (
        <li key={o.value} tabIndex="-1" index={i}>
          <span>{o.label}</span>
        </li>
      );
    });

    return (
      <React.Fragment>
        <Backdrop onClick={toggleOptions} show={show} />

        <PickerWrapper show={show}>
          <div className="button-wrapper">
            <button className="btn-flat left" type="button" onClick={toggleOptions}>
              {i18nTxt('CANCEL')}
            </button>
            <button className="btn-flat right" type="button" onClick={this.onClick}>
              {i18nTxt('CONFIRM')}
            </button>
          </div>

          <List ref={this.listRef}>
            <hr className="top"></hr>
            <hr className="bottom"></hr>

            <li className="empty" filler></li>
            {domList}
            <li className="empty" filler></li>
          </List>
        </PickerWrapper>
      </React.Fragment>
    );
  }
}

const typeOpt = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};
Picker.propTypes = {
  show: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(typeOpt).isRequired,
  onSelect: PropTypes.func.isRequired,
  toggleOptions: PropTypes.func.isRequired,
};

export default Picker;
