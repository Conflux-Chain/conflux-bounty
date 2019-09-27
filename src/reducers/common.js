import { UPDATE_COMMON, UPDATE_BOUNTY_CACHE, UPDATE_SOLUTION_LIST_CACHE } from '../constants';

const initState = {
  lang: 'zh-CN',
  // categoryList: [],
  categoryMap: {},
  categoryL1List: [],

  bountyCache: {},
  solutionListCache: {},

  checkinStatus: null,
  checkinRemainingTime: null,
  checkinFansCoin: null,
  showCheckSuccess: false,
};

export default (state = initState, action) => {
  if (action.type === UPDATE_COMMON) {
    return {
      ...state,
      ...action.payload,
    };
  }

  if (action.type === UPDATE_BOUNTY_CACHE) {
    return {
      ...state,
      bountyCache: {
        ...state.bountyCache,
        [action.payload.bountyId]: action.payload.result,
      },
    };
  }

  if (action.type === UPDATE_SOLUTION_LIST_CACHE) {
    return {
      ...state,
      solutionListCache: {
        ...state.solutionListCache,
        [action.payload.bountyId]: action.payload.result,
      },
    };
  }

  return state;
};
