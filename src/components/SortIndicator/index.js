import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SortItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  &:nth-child(n + 1) {
    margin-left: 20px;
  }
`;
const SortTitle = styled.span`
  color: #8e9394;
  font-size: 14px;
`;
const SortIndicatorContainer = styled.div`
  margin-left: 8px;
  height: 16px;
  line-height: 16px;
  > i {
    font-size: 16px;
    &:nth-child(2) {
      margin-left: -15px;
    }
  }
`;
class SortIndicator extends PureComponent {
  onClick = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    const { children, order, highlight } = this.props;
    return (
      <SortItem onClick={this.onClick}>
        <SortTitle style={{ color: highlight ? '#22b2d6' : '#8e9394' }}>{children}</SortTitle>
        <SortIndicatorContainer>
          <i className="bounty-sort-asc" style={{ color: highlight && order === 'asc' ? '#22b2d6' : '#8e9394' }}></i>
          <i className="bounty-sort-desc" style={{ color: highlight && order === 'desc' ? '#22b2d6' : '#8e9394' }}></i>
        </SortIndicatorContainer>
      </SortItem>
    );
  }
}
SortIndicator.propTypes = {
  onClick: PropTypes.func,
  highlight: PropTypes.bool,
  order: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

SortIndicator.defaultProps = {
  order: '',
  children: '',
  highlight: false,
  onClick: () => {},
};
export default SortIndicator;
