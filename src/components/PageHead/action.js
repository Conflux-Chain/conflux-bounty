import { reqAccountQuery, reqMessageCount, reqUserUpdate } from '../../utils/api';
import { UPDATE_HEAD, UPDATE_UNREAD_MESSAGE_COUNT, UPDATE_COMMON } from '../../constants';

export { reqUserUpdate };

export const updateHead = d => ({
  type: UPDATE_HEAD,
  payload: d,
});

export const getAccount = () => dispatch => {
  const accountQueryPromise = reqAccountQuery();
  const accountPromise = accountQueryPromise.then(v => {
    return v.result;
  });
  dispatch({
    type: UPDATE_HEAD,
    payload: {
      accountPromise,
    },
  });

  return accountQueryPromise.then(body => {
    dispatch({
      type: UPDATE_HEAD,
      payload: {
        user: body.result.user,
        fansCoin: body.result.fansCoin,
        fansCoinLocked: body.result.fansCoinLocked,
        role: body.result.role,
        status: body.result.status,
      },
    });
  });
};

export const getUnreadMessageCount = () => dispatch => {
  return reqMessageCount({ isRead: false }).then(body => {
    dispatch({
      type: UPDATE_UNREAD_MESSAGE_COUNT,
      payload: {
        messageCount: body.result.total,
      },
    });
  });
};

export const updateCommon = payload => {
  if (payload && payload.lang) {
    localStorage.setItem('SITE_LANG', payload.lang);
  }
  return {
    type: UPDATE_COMMON,
    payload,
  };
};
