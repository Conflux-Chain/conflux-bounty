/**
 * @fileOverview nickname input
 * @name index.js
 */
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Input from '../Input';
import { reqValidateNickname } from '../../utils/api';
import { i18nTxt } from '../../utils';

export default class Nickname extends Component {
  state = {
    nickname: '',
    nicknameErrMsg: '',
    changed: false,
  };

  onNicknameChangeDebounced = async e => {
    if (e.target.value === '') return;
    if (e.target.value.length > 30) {
      this.setState({
        nicknameErrMsg: i18nTxt('Nickname should only contain no more than 30 characters'),
      });
      return;
    }
    if (/\W/.test(e.target.value)) {
      this.setState({
        nicknameErrMsg: i18nTxt('Nickname should only contain letters, digits and underscores'),
      });
      return;
    }

    const {
      result: { isDuplicate, isInvalid },
    } = await reqValidateNickname({ nickname: e.target.value.replace(/ /g, '_') });

    if (isDuplicate) {
      this.setState({
        nicknameErrMsg: i18nTxt('Seems this nickname is occupied. Try another one'),
      });
    } else if (isInvalid) {
      this.setState({
        nicknameErrMsg: i18nTxt('Nickname contains sensitive words, please re-enter'),
      });
    } else {
      this.setState({ nicknameErrMsg: '' });
    }
  };

  onNicknameChange = async e => {
    this.setState({ nickname: e.target.value.replace(/ /g, '_'), changed: true });
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
          value={changed ? nickname : defaultNickname.replace(/ /g, '_')}
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
    margin: 0 0 12px 0;
  }
`;
