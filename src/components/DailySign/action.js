import { reqGetCheckInInfo, reqSubmitCheckIn } from '../../utils/api';
import { UPDATE_COMMON } from '../../constants';
import * as utils from '../../utils';

export function update(a) {
  return {
    type: UPDATE_COMMON,
    payload: a,
  };
}

export const checkinEnum = {
  pass: 0,
  disabled: 1,
  overMaxNum: 2,
  alreadyChecked: 3,
};

export const getCheckInInfo = () => dispatch => {
  reqGetCheckInInfo().then(body => {
    dispatch(
      update({
        checkinStatus: body.result.status,
        checkinRemainingTime: body.result.checkinRemainingTime,
      })
    );
  });
};

export const submitCheckIn = () => dispatch => {
  reqSubmitCheckIn().then(body => {
    // dispatch(update({
    //   checkinStatus: body.result.status,
    //   checkinRemainingTime: body.result.remainingTime,
    //   checkinFansCoin: body.result.fansCoin,
    // }))
    // body.result.status = checkinEnum.pass;

    const param = {
      checkinStatus: body.result.status,
      checkinRemainingTime: body.result.remainingTime,
      checkinFansCoin: body.result.fansCoin,
    };

    if (body.result.status === checkinEnum.pass) {
      param.checkinStatus = checkinEnum.alreadyChecked;
      param.showCheckSuccess = true;
      setTimeout(() => {
        dispatch(
          update({
            showCheckSuccess: false,
          })
        );
      }, 3000);
    } else if (body.result.status === checkinEnum.disabled) {
      utils.notice.show({
        type: 'message-important-light',
        content: utils.i18nTxt('Check in is already disabled by admin'),
        timeout: 5000,
      });
    } else if (body.result.status === checkinEnum.overMaxNum) {
      utils.notice.show({
        type: 'message-important-light',
        content: utils.i18nTxt('Check in is fulled'),
        timeout: 5000,
      });
    } else if (body.result.status === checkinEnum.alreadyChecked) {
      utils.notice.show({
        type: 'message-important-light',
        content: utils.i18nTxt('You have already checked in today'),
        timeout: 5000,
      });
    }

    dispatch(update(param));
  });
};
