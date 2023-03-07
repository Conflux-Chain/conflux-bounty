import {
  reqMyBounty,
  reqSendLike,
  reqMySolution,
  reqDoWithdraw,
  reqWithdrawList,
  reqSendVerificationEmail,
  reqRewardList,
  reqOrderList,
} from '../../utils/api';
import * as utils from '../../utils';
import { getAccount } from '../../components/PageHead/action';
import { ERR_MSG, REGEX } from '../../constants';

export const UPDATE_USER_ACCOUNT = 'userinfo/UPDATE';
export const RESET_USER_ACCOUNT = 'userinfo/RESET';

export function updateUserAccount(d) {
  return {
    type: UPDATE_USER_ACCOUNT,
    payload: d,
  };
}
export function resetUserAccount(d) {
  return {
    type: RESET_USER_ACCOUNT,
    payload: d,
  };
}

export { getAccount };

export const getCode = () => async (dispatch, getState) => {
  const {
    common: { lang },
  } = getState();
  const {
    // code,
    result: { waitSecondsTillNextSend },
  } = await reqSendVerificationEmail({ type: 'withdraw', language: lang });

  const wait1s = () => {
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  };

  dispatch(
    updateUserAccount({
      codeCount: waitSecondsTillNextSend,
    })
  );

  let looping = true;
  while (looping) {
    // eslint-disable-next-line no-await-in-loop
    await wait1s();
    const curTotal = getState().userInfo.userAccount.codeCount;

    if (curTotal <= 0) {
      looping = false;
    } else {
      dispatch(
        updateUserAccount({
          codeCount: curTotal - 1,
        })
      );
    }
  }
};
const isEmpty = val => {
  if (!val) {
    return true;
  }
  if (REGEX.CHECK_BLANK.test(val)) {
    return true;
  }
  return false;
};

export const doWithdraw = () => (dispatch, getState) => {
  const { userAccount } = getState().userInfo;
  const errs = {
    withDrawAmountErr: '',
    walletAddressErr: '',
    walletPassWordErr: '',
    emailCodeErr: '',
  };

  const pairs = {
    withDrawAmount: 'withDrawAmountErr',
    // walletAddress: 'walletAddressErr',
    walletPassWord: 'walletPassWordErr',
    emailCode: 'emailCodeErr',
  };

  let valid = true;
  Object.keys(pairs).forEach(key => {
    if (isEmpty(userAccount[key])) {
      valid = false;
      errs[pairs[key]] = ERR_MSG.NOT_BLANK;
    }
  });
  const { fansCoin } = getState().head;
  const minimalWithdrawVal = fansCoin < 50 ? fansCoin : 50;
  if (!REGEX.CHECK_FLOAT.test(userAccount.withDrawAmount)) {
    valid = false;
    errs.withDrawAmountErr = ERR_MSG.POSITIVE_NUMBER;
  } else if (userAccount.withDrawAmount > fansCoin) {
    valid = false;
    errs.withDrawAmountErr = utils.i18nTxt('You have insufficient balance in your account');
  } else if (userAccount.withDrawAmount < minimalWithdrawVal) {
    valid = false;
    errs.withDrawAmountErr = `${utils.i18nTxt('Minimum withdraw amount')} ${minimalWithdrawVal} FC`;
  }

  // wallet check ox...
  if (isEmpty(userAccount.walletAddress)) {
    valid = false;
    errs.walletAddressErr = ERR_MSG.NOT_BLANK;
  } else if (REGEX.WALLET_ADDRESS.test(userAccount.walletAddress) === false) {
    valid = false;
    errs.walletAddressErr = utils.i18nTxt('Invalid address format');
  }

  if (valid === false) {
    dispatch(
      updateUserAccount({
        ...errs,
      })
    );
  } else {
    reqDoWithdraw({
      fansCoin: Number(userAccount.withDrawAmount),
      walletAddress: userAccount.walletAddress,
      password: userAccount.walletPassWord,
      emailCode: userAccount.emailCode,
    }).then(({ code }) => {
      if (code !== 0) return;
      utils.notice.show({
        type: 'message-success',
        content: utils.i18nTxt('Withdrawal Submitted'),
        timeout: 3 * 1000,
      });
      dispatch(getAccount());
      dispatch(
        updateUserAccount({
          showWithdrawDialog: false,
        })
      );
    });
  }
};

// my likes
export const UPDATE_MYLIKE_BOUNTY = 'userinfo/mylike/bounty';
export const UPDATE_MYLIKE_SOLUTION = 'userinfo/mylike/solution';
export const UPDATE_MYLIKE = 'userinfo/mylike';
export const RESET_MYLIKE = 'userinfo/mylike/reset';

export function updateMyLike(d) {
  return {
    type: UPDATE_MYLIKE,
    payload: d,
  };
}
export function resetMyLike(d) {
  return {
    type: RESET_MYLIKE,
    payload: d,
  };
}
export function updateMyLikeBounty(d) {
  return {
    type: UPDATE_MYLIKE_BOUNTY,
    payload: d,
  };
}
export function updateMyLikeSolution(d) {
  return {
    type: UPDATE_MYLIKE_SOLUTION,
    payload: d,
  };
}

export const getMyBounty = reqPage => (dispatch, getState) => {
  const { myLike } = getState().userInfo;
  return reqMyBounty({
    page: reqPage,
    limit: myLike.bounty.limit,
    filterBy: 'user_like',
  }).then(body => {
    dispatch(
      updateMyLikeBounty({
        list: body.result.list,
        total: body.result.total,
        page: reqPage,
      })
    );
  });
};

export const delLikeBounty = bountyId => () => {
  return reqSendLike({
    bountyId,
    type: 'del',
  });
};

export const delLikeSolution = submissionId => () => {
  return reqSendLike({
    submissionId,
    type: 'del',
  });
};

export const getMySolution = reqPage => (dispatch, getState) => {
  const { myLike } = getState().userInfo;
  return reqMySolution({
    page: reqPage,
    limit: myLike.solution.limit,
    filterBy: 'user_like',
  }).then(body => {
    dispatch(
      updateMyLikeSolution({
        list: body.result.list,
        total: body.result.total,
        page: reqPage,
      })
    );
  });
};

export const UPDATE_HISTORY_REWARDS = 'userinfo/history/rewards';
export const UPDATE_HISTORY_WITHDRAWS = 'userinfo/history/withdraws';
export const UPDATE_ORDER_LIST = 'userinfo/history/orders';
export const UPDATE_HISTORY = 'userinfo/history';
export const RESET_HISTORY = 'userinfo/reset';

export function updateHistoryRewards(d) {
  return {
    type: UPDATE_HISTORY_REWARDS,
    payload: d,
  };
}
export function updateOrderList(d) {
  return {
    type: UPDATE_ORDER_LIST,
    payload: d,
  };
}
export function updateHistoryWithdraws(d) {
  return {
    type: UPDATE_HISTORY_WITHDRAWS,
    payload: d,
  };
}
export function updateHistory(d) {
  return {
    type: UPDATE_HISTORY,
    payload: d,
  };
}
export function resetHistory(d) {
  return {
    type: RESET_HISTORY,
    payload: d,
  };
}

export const getWithdrawList = reqPage => (dispatch, getState) => {
  const { accountHistory } = getState().userInfo;
  return reqWithdrawList({
    page: reqPage,
    limit: accountHistory.withdraws.limit,
  }).then(body => {
    dispatch(
      updateHistoryWithdraws({
        list: accountHistory.withdraws.list.concat(body.result.list),
        total: body.result.total,
        page: reqPage,
      })
    );
  });
};

export const getRewardList = reqPage => (dispatch, getState) => {
  const { accountHistory } = getState().userInfo;
  return reqRewardList({
    page: reqPage,
    limit: accountHistory.rewards.limit,
  }).then(body => {
    dispatch(
      updateHistoryRewards({
        list: accountHistory.rewards.list.concat(body.result.list),
        total: body.result.total,
        page: reqPage,
      })
    );
  });
};

export const getOrderList = reqPage => (dispatch, getState) => {
  const { accountHistory } = getState().userInfo;
  return reqOrderList({ page: reqPage, limit: accountHistory.orders.limit }).then(body => {
    dispatch(
      updateOrderList({
        list: accountHistory.orders.list.concat(body.result.list),
        total: body.result.total,
        page: reqPage,
      })
    );
  });
};
