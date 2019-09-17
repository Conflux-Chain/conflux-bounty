import { UPDATE_HEAD, UPDATE_UNREAD_MESSAGE_COUNT } from '../../constants';

const initAccountState = {
  user: { nickname: '', email: '', invitationCode: '', invitationCountV1: undefined, language: navigator.language },
  fansCoin: 0,
  id: '',
  fansCoinLocked: 0,
};

export default (state = initAccountState, action) => {
  if (action.type === UPDATE_HEAD) {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type === UPDATE_UNREAD_MESSAGE_COUNT) {
    return {
      ...state,
      ...action.payload,
    };
  }
  return state;
};
