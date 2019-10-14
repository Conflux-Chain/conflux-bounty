import ReCAPTCHARaw from 'react-google-recaptcha';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ReCAPTCHA = props => {
  const { hl, language } = props;
  return (
    <ReCAPTCHARaw
      {...{
        ...props,
        hl: hl || language,
        key: hl || language,
      }}
    ></ReCAPTCHARaw>
  );
};

ReCAPTCHA.propTypes = {
  hl: PropTypes.string,
  language: PropTypes.string.isRequired,
};
ReCAPTCHA.defaultProps = {
  hl: '',
};

function mapStateToProps(state) {
  return {
    language: state.head.user.language,
  };
}

export default connect(mapStateToProps)(ReCAPTCHA);
