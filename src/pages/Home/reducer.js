import { UPDATE_HOME } from './action';

const initState = {
  tag: 'open',
  category: null,
  subCategory: null,
  sort: 'time_desc',
  bountyList: [],
  popBountyList: [],
  broadcastList: [],
  total: 0,
};

function updateHome(state = initState, action) {
  if (action.type === UPDATE_HOME) {
    return {
      ...state,
      ...action.payload,
    };
  }
  return state;
}

export default updateHome;
