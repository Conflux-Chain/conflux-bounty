/**
 * @fileOverview nickname input
 * @name index.js
 */
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Input from '../Input';
import { reqCheckDupNickname } from '../../utils/api';
import { i18nTxt } from '../../utils';

export default class Nickname extends Component {
  state = {
    nickname: '',
    nicknameErrMsg: '',
    changed: false,
  };

  onNicknameChangeDebounced = async e => {
    if (e.target.value === '') return;
    const {
      result: { isDuplicate },
    } = await reqCheckDupNickname({ nickname: e.target.value });

    if (isDuplicate) {
      this.setState({
        nicknameErrMsg: i18nTxt('Seems this nickname is occupied. Try another one'),
      });
    } else {
      this.setState({ nicknameErrMsg: '' });
    }
  };

  onNicknameChange = async e => {
    this.setState({ nickname: e.target.value, changed: true });
    const { onChange } = this.props;
    onChange(e);
  };

  hasError = () => {
    const { nicknameErrMsg } = this.state;
    return !!nicknameErrMsg.length || this.isEmpty();
  };

  isEmpty = () => {
    const { nickname, changed } = this.state;
    const { nickname: defaultNickname } = this.props;
    const isEmpty = (!changed && !defaultNickname.length) || (changed && !nickname.length);
    if (isEmpty) {
      this.setState({ nicknameErrMsg: i18nTxt('Nickname is empty') });
    }
    return isEmpty;
  };

  render() {
    const { nickname, nicknameErrMsg, changed } = this.state;
    const { nickname: defaultNickname } = this.props;
    return (
      <Wrapper>
        <Input
          label={i18nTxt('Nickname')}
          value={changed ? nickname : defaultNickname}
          type="text"
          autocomplete="name"
          onChange={this.onNicknameChange}
          onChangeDebounced={this.onNicknameChangeDebounced}
          errMsg={nicknameErrMsg}
        />
      </Wrapper>
    );
  }
}

Nickname.defaultProps = {
  nickname: '',
};

Nickname.propTypes = {
  nickname: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

const Wrapper = styled.div`
  > div {
    margin: 0 0 4px 0;
  }
`;
