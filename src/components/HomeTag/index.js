import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import media from '../../globalStyles/media';
import unitParser from '../../utils/device';

const Container = styled.div`
  width: 440px;
  height: 60px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 30px;
  z-index: 100;
  .selected {
    background: linear-gradient(116.19deg, #69c4db -4.77%, #5499dd 101.18%);
    color: #fff;
  }

  ${media.mobile`
 background-color: #fffff;
 width: 100%;
 height: initial;
 display: flex;
 align-items: initial;
 justify-content: initial;
 box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
 margin-bottom: 15px;
 border-radius: initial;
 z-index: initial;
 padding: 0;
 .selected {
  background: initial;
  color: initial;
}
`}
`;

const TagItem = styled.div`
  background: #fff;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  height: 56px;
  cursor: pointer;
  color: #8e9394;
  font-size: 16px;
  letter-spacing: 0.05em;

  ${media.mobile`
background: none;
display: block;
align-items: initial;
justify-content: initial;
border-radius: initial;
height: initial;
cursor: initial;
color: #8E9394;
line-height: 60px
font-size: ${unitParser(16)};
text-align: center;
margin-left: ${unitParser(20)};
margin-right: ${unitParser(20)};
flex: 1;
font-weight: bold;
&.selected {
  border-bottom: ${unitParser(3)} solid #22B2D6;
}
`}
`;

function HomeTag(props) {
  const { selected, items, onChangeValue } = props;

  return (
    <Container>
      {items.map(item => (
        <TagItem onClick={() => onChangeValue(item.value)} key={item.value} className={selected === item.value ? 'selected' : ''}>
          {item.text}
        </TagItem>
      ))}
    </Container>
  );
}

HomeTag.propTypes = {
  selected: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeValue: PropTypes.func.isRequired,
};

export default HomeTag;
