import { UPDATE_SHARE_MODAL } from './action';

const initState = {
  show: false,
};

export default (state = initState, action) => {
  if (action.type === UPDATE_SHARE_MODAL) {
    return {
      ...state,
      ...action.payload,
    };
  }

  return state;
};
