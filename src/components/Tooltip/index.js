import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Basic = styled.span`
  vertical-align: middle;
  position: relative;
  display: inline-block;
  &:after {
    content: '';
    position: absolute;
    top: -50%;
    left: 0px;
    width: 100%;
    height: 200%;
  }

  .arrow {
    width: 8px;
    height: 16px;
    position: absolute;
    margin: 0;
    padding: 0;
  }
  .tooltip-panel {
    box-shadow: rgba(0, 0, 0, 0.12) 2px 4px 8px;
    padding: 16px;
    display: block;
    position: absolute;
    min-width: 200px;
    background: #fff;
    font-weight: normal;
    font-size: 14px;
    border-radius: 10px;
    color: #595f61;
  }
`;

const ToolTips = {
  right: styled(Basic)`
    .arrow {
      top: 50%;
      left: -8px;
      transform: translateY(-50%);
    }
    .tooltip-panel {
      transform: translateY(-50%);
      left: 30px;
      top: 50%;
    }
  `,
  down: styled(Basic)`
    .arrow {
      left: 25px;
      top: 100%;
      transform: translateY(-30%) rotate(-90deg);
    }
    .tooltip-panel {
      transform: translateY(-100%);
    }
  `,
  downWithSpan: styled(Basic)`
    .arrow {
      bottom: 8px;
      transform: translateY(100%) rotate(-90deg);
    }
    .tooltip-panel {
      top: -10px;
      transform: translateY(-100%);
    }
  `,
};

class Tooltip extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      show: false,
    };
  }

  onMouseEnter = () => {
    this.setState({
      show: true,
    });
  };

  onMouseLeave = () => {
    this.setState({
      show: false,
    });
  };

  render() {
    const { children, tipSpan, direction = 'right', style = {}, onMouseEnter, onMouseLeave, show: controledShow } = this.props;
    const { show } = this.state;
    const ToolTip = ToolTips[direction];

    return (
      <ToolTip
        style={style}
        onMouseEnter={onMouseEnter || this.onMouseEnter}
        onMouseLeave={onMouseLeave || this.onMouseLeave}
        className={`direction-${direction}`}
      >
        {tipSpan}

        <div
          className="tooltip-panel"
          style={{
            display: (() => {
              if (controledShow === undefined) return show ? 'block' : 'none';
              return controledShow ? 'block' : 'none';
            })(),
          }}
        >
          <svg className="arrow" viewBox="0 0 8 16">
            <path d="M8 0 L0 8 L8 16 Z" fill="#fff" />
          </svg>
          {children}
        </div>
      </ToolTip>
    );
  }
}

Tooltip.defaultProps = { direction: 'right', style: {}, onMouseEnter: undefined, onMouseLeave: undefined, show: undefined };

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  tipSpan: PropTypes.element.isRequired,
  direction: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
  onMouseLeave: PropTypes.func,
  onMouseEnter: PropTypes.func,
  show: PropTypes.bool,
};

export default Tooltip;
