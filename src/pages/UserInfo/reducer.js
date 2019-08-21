import { combineReducers } from 'redux';
import {
  UPDATE_USER_ACCOUNT,
  RESET_USER_ACCOUNT,
  UPDATE_MYLIKE_BOUNTY,
  UPDATE_MYLIKE_SOLUTION,
  UPDATE_MYLIKE,
  RESET_MYLIKE,
  UPDATE_HISTORY_REWARDS,
  UPDATE_HISTORY_WITHDRAWS,
  UPDATE_ORDER_LIST,
  UPDATE_HISTORY,
  RESET_HISTORY,
} from './action';

const initState = {
  showWithdrawDialog: false,

  withDrawAmount: '',
  withDrawAmountErr: '',

  walletAddress: '',
  walletAddressErr: '',

  walletPassWord: '',
  walletPassWordErr: '',

  emailCode: '',
  emailCodeErr: '',

  codeCount: 0,
};

const userAccount = (state = initState, action) => {
  if (action.type === UPDATE_USER_ACCOUNT) {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type === RESET_USER_ACCOUNT) {
    return {
      ...initState,
    };
  }
  return state;
};

const initMyLike = {
  bounty: {
    list: [],
    total: 0,
    page: 1,
    limit: 10,
    filterBy: 'user_create',
  },
  solution: {
    list: [],
    total: 0,
    page: 1,
    limit: 10,
    filterBy: 'user_create',
  },
  activeTab: 'bounty',
  showRemoveDialog: false,
  initDataFetched: false,
};

const myLike = (state = initMyLike, action) => {
  if (action.type === UPDATE_MYLIKE_BOUNTY) {
    return {
      ...state,
      bounty: {
        ...state.bounty,
        ...action.payload,
      },
    };
  }
  if (action.type === UPDATE_MYLIKE_SOLUTION) {
    return {
      ...state,
      solution: {
        ...state.solution,
        ...action.payload,
      },
    };
  }
  if (action.type === UPDATE_MYLIKE) {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type === RESET_MYLIKE) {
    return {
      ...initMyLike,
    };
  }
  return state;
};

const initAccountHistory = {
  rewards: {
    list: [],
    total: -1,
    page: 1,
    limit: 10,
    filterBy: 'user_create',
  },
  withdraws: {
    list: [],
    total: -1,
    page: 1,
    limit: 10,
    filterBy: 'user_create',
  },
  orders: {
    // list: [{ goods: { name: '12 invitation code bundle' }, costFansCoin: 13, createdAt: new Date() }],
    list: [],
    total: -1,
    page: 1,
    limit: 10,
  },
  activeTab: 'rewards',
  initDataFetched: false,
};

const accountHistory = (state = initAccountHistory, action) => {
  if (action.type === UPDATE_HISTORY_REWARDS) {
    return {
      ...state,
      rewards: {
        ...state.rewards,
        ...action.payload,
      },
    };
  }
  if (action.type === UPDATE_HISTORY_WITHDRAWS) {
    return {
      ...state,
      withdraws: {
        ...state.withdraws,
        ...action.payload,
      },
    };
  }
  if (action.type === UPDATE_ORDER_LIST) {
    return {
      ...state,
      orders: {
        ...state.orders,
        ...action.payload,
      },
    };
  }
  if (action.type === UPDATE_HISTORY) {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type === RESET_HISTORY) {
    return {
      ...initAccountHistory,
    };
  }
  return state;
};

export default combineReducers({
  userAccount,
  myLike,
  accountHistory,
});
