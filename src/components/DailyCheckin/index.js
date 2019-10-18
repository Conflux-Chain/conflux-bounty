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
import CheckedIn from '../../assets/iconfont/checked-in.svg';
import CheckedInUnavail from '../../assets/iconfont/checked-in-unavail.svg';
import CheckInRightArrow from '../../assets/iconfont/checkin-rightarrow.svg';
import media from '../../globalStyles/media';
import Modal from '../Modal';
import { recaptchaKey } from '../../constants';
import unitParser, { isMobile } from '../../utils/device';

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
    ${media.mobile`
    width: ${unitParser(84)};
    height: ${unitParser(84)};
    border-radius: ${unitParser(60)};
  `}
    text-align: center;
    cursor: pointer;
    > div {
      font-size: 16px;
      line-height: 16px;
      color: #fff;
      font-weight: 500;
      ${media.mobile`
         line-height: ${unitParser(12)};
         font-size:  ${unitParser(12)};
     `}
    }
    > img {
      margin-top: 17px;
      ${media.mobile`
        margin-top:  ${unitParser(12)};
        width: ${unitParser(40)};
     `}
    }
  }

  .btn-checkedin {
    display: flex;
    width: 100px;
    height: 116px;
    background: linear-gradient(96.93deg, #ffffff 0%, #ededed 100%);
    box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.2);
    border-bottom-left-radius: 12px;
    border-top-left-radius: 12px;
    right: 0px;

    ${media.mobile`
    width: ${unitParser(110)};
    height: ${unitParser(116)};
    border-bottom-left-radius:  ${unitParser(12)};
    border-top-left-radius:  ${unitParser(12)};
        `}

    .checked-line1 {
      width: 32px;
      margin: 0 auto;
      display: block;
      margin-top: 13px;
      ${media.mobile`
      width: ${unitParser(32)};
      margin-top: ${unitParser(13)};
      `}
    }
    .checked-line2 {
      left: 59px;
      top: 30px;
      position: absolute;

      ${media.mobile`
      left: ${unitParser(59)};
      top:${unitParser(30)};
      `}
    }
    .checked-line3 {
      margin-top: 9px;
      margin-bottom: 5px;
      text-align: center;
      font-size: 14px;
      line-height: 14px;
      color: #59bf9c;
      font-weight: 500;
      &.unavail {
        color: #595f61;
      }
      ${media.mobile`
      margin-top: ${unitParser(9)};
      margin-bottom: ${unitParser(5)};
      font-size: ${unitParser(12)};
      line-height: ${unitParser(12)};`}
    }
    .checked-line4,
    .checked-line5 {
      color: #595f61;
      text-align: center;
      font-size: 14px;
      line-height: 1.3;
      ${media.mobile`
      font-size: ${unitParser(12)};`}
    }
  }
  .btn-collapse {
    width: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-checkedin-collapse {
    background: linear-gradient(99.69deg, #ffffff 0%, #ededed 100%);
    box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.2);
    border-bottom-left-radius: 12px;
    border-top-left-radius: 12px;
    right: 0px;
    width: ${unitParser(63)};
    height: ${unitParser(52)};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .checkin-success {
    position: fixed;
    ${media.tablet`top: 20%;`}
    margin-left: -174px;
    top: 40px;
    left: 50%;
    width: 348px;

    ${media.mobile`
    width: ${unitParser(348)};
    margin-left: ${unitParser(-174)};`}
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
    const { common, submitCheckIn, showAlreadyTips, update } = this.props;
    const { checkinStatus, checkinFansCoin } = common;
    const { showRecaptcha } = this.state;
    const ismob = isMobile();

    let btnCollapse;
    if (ismob) {
      btnCollapse = (
        <button
          className="btn-collapse"
          type="button"
          onClick={e => {
            e.stopPropagation();
            update({
              showCheckInMini: true,
            });
          }}
        >
          <img src={CheckInRightArrow}></img>
        </button>
      );
    }

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
          {btnCollapse}
          <div style={{ flex: 1 }}>
            <img src={CheckedIn} className="checked-line1" />
            {/* <div className="checked-line2">{svgOrange}</div> */}
            <div className="checked-line3">{i18nTxt('Checked in')}</div>
            <div className="checked-line4">{i18nTxt('Updates in')}</div>
            <div className="checked-line5">
              {i18nTxt('<%= hour %>h:<%= minute %>m', {
                hour: parseInt(duration.asHours(), 10),
                minute: duration.minutes(),
              })}
            </div>
          </div>
        </div>
      );
      if (ismob && common.showCheckInMini) {
        checkInButton = (
          <div
            className="btn-checkedin-collapse pos-rightbottom"
            onClick={() => {
              update({
                showCheckInMini: false,
              });
            }}
          >
            <img src={CheckedIn} className="checked-line1" />
          </div>
        );
      }
    } else if (checkinStatus === actions.checkinEnum.overMaxNum) {
      const duration = moment.duration({
        seconds: common.checkinRemainingTime,
      });

      checkInButton = (
        <div className="btn-checkedin pos-rightbottom">
          {btnCollapse}
          <div style={{ flex: 1 }}>
            <img src={CheckedInUnavail} className="checked-line1" />
            <div className="checked-line3 unavail">{i18nTxt('checkin.Unavailable')}</div>
            <div className="checked-line4">{i18nTxt('Updates in')}</div>
            <div className="checked-line5">
              {i18nTxt('<%= hour %>h:<%= minute %>m', {
                hour: parseInt(duration.asHours(), 10),
                minute: duration.minutes(),
              })}
            </div>
          </div>
        </div>
      );

      if (ismob && common.showCheckInMini) {
        checkInButton = (
          <div
            className="btn-checkedin-collapse pos-rightbottom"
            onClick={() => {
              update({
                showCheckInMini: false,
              });
            }}
          >
            <img src={CheckedInUnavail} className="checked-line1" />
          </div>
        );
      }
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
  update: PropTypes.func.isRequired,
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
