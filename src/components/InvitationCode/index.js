/**
 * @fileOverview invitation code input
 * @name index.js
 */

import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Input from '../Input';
import { i18nTxt } from '../../utils';
import { reqCheckIsInvitationCodeValid } from '../../utils/api';

export default class InvitationCode extends Component {
  /* eslint react/destructuring-assignment: 0 */
  state = {
    invitationCode: '',
    changed: false,
    invitationCodeErrMsg: '',
  };

  componentDidMount() {
    const { code } = this.props;
    if (code) {
      this.setState({ invitationCode: code });
    }
  }

  onInvitationCodeChange = async e => {
    this.setState({ invitationCode: e.target.value, changed: true, invitationCodeErrMsg: '' });
    const { onChange } = this.props;
    onChange(e);
  };

  isEmpty = () => {
    const { invitationCode } = this.state;
    if (!invitationCode.length) {
      this.setState({ invitationCodeErrMsg: i18nTxt('Invitation code is empty') });
    }
    return !invitationCode.length;
  };

  hasError = () => {
    const { invitationCodeErrMsg } = this.state;
    return !!invitationCodeErrMsg.length || this.isEmpty();
  };

  onInvitationCodeDebouncedChange = async e => {
    // validate invitation code when click signup
    /* eslint no-unreachable: 0 */
    return;
    const {
      result: { isValid },
    } = await reqCheckIsInvitationCodeValid({
      invitationCode: e.target.value,
    });
    if (!isValid) {
      this.setState({ invitationCodeErrMsg: i18nTxt('Invalid invitation code') });
    } else {
      this.setState({ invitationCodeErrMsg: '' });
    }
  };

  render() {
    const { code } = this.props;
    const { invitationCode, changed, invitationCodeErrMsg } = this.state;
    return (
      <Wrapper>
        <Input
          id="signup-invitation-code"
          label={i18nTxt('Invitation Code')}
          type="text"
          autocomplete="off"
          value={changed ? invitationCode : code || invitationCode}
          onChange={this.onInvitationCodeChange}
          onChangeDebounced={this.onInvitationCodeDebouncedChange}
          errMsg={invitationCodeErrMsg}
        />
      </Wrapper>
    );
  }
}

InvitationCode.defaultProps = {
  code: '',
};

InvitationCode.propTypes = {
  onChange: PropTypes.func.isRequired,
  code: PropTypes.string,
};

const Wrapper = styled.div`
  > div {
    margin: 0 0 12px 0;
  }
`;
