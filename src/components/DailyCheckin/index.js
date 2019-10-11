import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReCAPTCHA from '../ReCAPTCHA';
import * as actions from './action';
import { compose, commonPropTypes, i18nTxt, auth } from '../../utils';
import CheckIn from '../../assets/iconfont/checkIn.svg';
import media from '../../globalStyles/media';
import Modal from '../Modal';
import { recaptchaKey } from '../../constants';

const DailyCheckinWrap = styled.div`
  .pos-rightbottom {
    right: 40px;
    bottom: 170px;
    z-index: 100;
    position: fixed;
    ${media.tablet`bottom: 20px; right: 20px;`}
  }

  .btn-checkin {
    background: linear-gradient(100.98deg, #69c4db -4.77%, #5499dd 101.18%);
    box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.2);
    border-radius: 60px;
    width: 120px;
    height: 120px;
    text-align: center;
    cursor: pointer;
    > div {
      font-size: 16px;
      line-height: 16px;
      color: #fff;
      font-weight: 500;
    }
    > img {
      margin-top: 17px;
    }
  }

  .btn-checkedin {
    width: 100px;
    height: 116px;
    background: linear-gradient(98.42deg, #69c4db -4.86%, #5499dd 103.1%);
    box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.2);
    border-bottom-left-radius: 12px;
    border-top-left-radius: 12px;
    right: 0px;

    .checked-line1 {
      width: 32px;
      margin: 0 auto;
      display: block;
      margin-top: 13px;
    }
    .checked-line2 {
      left: 59px;
      top: 30px;
      position: absolute;
    }
    .checked-line3 {
      margin-top: 9px;
      margin-bottom: 5px;
      text-align: center;
      font-size: 14px;
      line-height: 14px;
      color: #fff;
      font-weight: 500;
    }
    .checked-line4,
    .checked-line5 {
      color: #ffffff;
      text-align: center;
      font-size: 14px;
      line-height: 1.3;
    }
  }

  .checkin-success {
    position: fixed;
    ${media.tablet`top: 20%;`}
    margin-left: -174px;
    top: 40px;
    left: 50%;
    width: 348px;
    z-index: 100;
    background: #ffffff;
    box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.12);
    border-radius: 12px;
    text-align: center;
    transition: all 0.4s ease;
    opacity: 0;
    pointer-events: none;
    z-index: -1;

    > .checkin-success-line1 {
      width: 75px;
      margin-top: 22px;
    }

    > .checkin-success-line2 {
      font-size: 40px;
      line-height: 40px;
      color: #ec6057;
      margin-top: 14px;
      margin-bottom: 8px;
    }
    > .checkin-success-line3 {
      font-size: 16px;
      line-height: 16px;
      color: #171d1f;
      margin-bottom: 22px;
    }
  }
`;
const svgOrange = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="9" height="6" fill="#fff"></rect>
    <path
      d="M6 0C2.6922 0 0 2.6919 0 6C0 9.3081 2.6922 12 6 12C9.3087 12 12 9.3081 12 6C12 2.6919 9.3087 0 6 0ZM8.6454 5.3625L6.0768 7.9317C5.898 8.1102 5.6637 8.1996 5.4294 8.1996C5.1957 8.1996 4.9611 8.1102 4.7826 7.9317L3.3552 6.5043C2.9979 6.147 2.9979 5.5671 3.3552 5.2104C3.7125 4.8528 4.2915 4.8528 4.6494 5.2104L5.4294 5.9904L7.3518 4.0683C7.7082 3.7116 8.2887 3.7116 8.6454 4.0683C9.003 4.4256 9.003 5.0052 8.6454 5.3625Z"
      fill="#F09C3A"
    />
  </svg>
);

/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/alt-text: 0 */

class DailyCheckin extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      showRecaptcha: false,
    };
  }

  componentDidMount() {
    const { history, common, getCheckInInfo } = this.props;

    const getData = () => {
      if (auth.loggedIn()) {
        getCheckInInfo();
      }
    };
    if (history.action === 'PUSH') {
      getData();
    } else if (common.checkinStatus === null) {
      getData();
    }
  }

  render() {
    const { common, submitCheckIn, showAlreadyTips } = this.props;
    const { checkinStatus, checkinFansCoin } = common;
    const { showRecaptcha } = this.state;

    let checkInButton;
    if (checkinStatus === actions.checkinEnum.pass) {
      checkInButton = (
        <div
          onClick={() => {
            this.setState({
              showRecaptcha: true,
            });
          }}
          className="btn-checkin pos-rightbottom"
        >
          <img src={CheckIn} />
          <div>{i18nTxt('CHECK IN')}</div>
        </div>
      );
    } else if (checkinStatus === actions.checkinEnum.alreadyChecked) {
      const duration = moment.duration({
        seconds: common.checkinRemainingTime,
      });

      checkInButton = (
        <div className="btn-checkedin pos-rightbottom" onClick={showAlreadyTips}>
          <img src={CheckIn} className="checked-line1" />
          <div className="checked-line2">{svgOrange}</div>
          <div className="checked-line3">{i18nTxt('Checked in')}</div>
          <div className="checked-line4">{i18nTxt('Updates in')}</div>
          <div className="checked-line5">
            {i18nTxt('<%= hour %>h:<%= minute %>m', {
              hour: parseInt(duration.asHours(), 10),
              minute: duration.minutes(),
            })}
          </div>
        </div>
      );
    } else {
      checkInButton = null;
    }

    let succesStyle = {};
    if (common.showCheckSuccess) {
      succesStyle = {
        opacity: 1,
        zIndex: 100,
      };
    }

    const successPanel = (
      <div className="checkin-success" style={succesStyle}>
        <img src={CheckIn} className="checkin-success-line1" />
        <div className="checkin-success-line2">+ {checkinFansCoin} FC</div>
        <div className="checkin-success-line3">{i18nTxt('You have checked in successfully.')}</div>
      </div>
    );

    const recaptchaModal = (
      <Modal showOverlay show={showRecaptcha}>
        <div>
          <ReCAPTCHA
            sitekey={recaptchaKey}
            onChange={val => {
              submitCheckIn(val);
              this.setState({
                showRecaptcha: false,
              });
            }}
          />
        </div>
      </Modal>
    );

    return (
      <DailyCheckinWrap>
        {checkInButton}
        {successPanel}
        {recaptchaModal}
      </DailyCheckinWrap>
    );
  }
}

DailyCheckin.propTypes = {
  history: commonPropTypes.history.isRequired,
  /* eslint react/forbid-prop-types: 0 */
  common: PropTypes.objectOf({
    checkinStatus: PropTypes.number,
  }).isRequired,
  getCheckInInfo: PropTypes.func.isRequired,
  submitCheckIn: PropTypes.func.isRequired,
  showAlreadyTips: PropTypes.func.isRequired,
};
DailyCheckin.defaultProps = {};

function mapStateToProps(state) {
  return {
    common: state.common,
  };
}
const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    actions
  )
);
export default enhance(DailyCheckin);
