import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useToggle } from 'react-use';
import unitParser from '../../utils/device';
import media from '../../globalStyles/media';

const typeTo = {
  backgroundColor: {
    warning: '#FFEBD4',
  },
  iconContent: {
    warning: 'info',
  },
  iconColor: {
    warning: '#E76A25',
  },
  iconClassName: {
    warning: 'material-icons info',
  },
  contentColor: {
    warning: '#E76A25;',
  },
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => typeTo.backgroundColor[props.type]};
  width: 600px;
  padding: 12px;
  margin: 40px auto;
  ${media.mobile`
padding: ${unitParser(12)};
margin: ${unitParser(8)};
`};
`;

const IconStyle = styled.i`
  color: ${props => typeTo.iconColor[props.type]};
  margin-right: 12px;
`;
const ContentStyle = styled.p`
  color: ${props => typeTo.contentColor[props.type]};
  ${media.mobile`
font-size: ${unitParser(14)};
line-height: ${unitParser(20)};
margin-right: ${unitParser(12)};
`}
`;
const CloseButton = styled.button``;

export default function StickyNotification({ content, type, visible }) {
  const [isVisible, toggleVisibility] = useToggle(visible === undefined ? true : visible);
  return (
    isVisible && (
      <Wrapper type={type}>
        <IconStyle className={typeTo.iconClassName[type]} type={type}>
          {typeTo.iconContent[type]}
        </IconStyle>
        <ContentStyle type={type}>{content}</ContentStyle>
        <CloseButton className="material-icons close" type="button" onClick={toggleVisibility}>
          close
        </CloseButton>
      </Wrapper>
    )
  );
}

StickyNotification.propTypes = {
  visible: PropTypes.bool,
  content: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
StickyNotification.defaultProps = {
  visible: undefined,
};
