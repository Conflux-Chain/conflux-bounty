import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { i18nTxt } from '../../utils';

const Container = styled.div`
  border: 1px solid #d7dddf;
  box-sizing: border-box;
  border-radius: 16px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 14px;
  color: #595f61;
  margin-right: 8px;
  cursor: pointer;
  &.selected {
    color: #22b2d6;
    border: 1px solid #22b2d6;
    &:hover {
      background-color: #eff8fb;
    }
  }
  &:hover {
    background-color: #ebeded;
  }
`;

function HomeCategory(props) {
  const { selected, text, value, onClick } = props;

  return (
    <Container
      className={selected ? 'selected' : ''}
      onClick={() => {
        onClick(value);
      }}
    >
      {i18nTxt(text)}
    </Container>
  );
}

HomeCategory.propTypes = {
  selected: PropTypes.bool,
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

HomeCategory.defaultProps = {
  selected: false,
};

export default HomeCategory;
