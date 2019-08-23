import { combineReducers } from 'redux';
import { UPDATE_EDIT, UPDATE_MY, CLEAR_EDIT, UPDATE_VIEW, RESET_VIEW, RESET_MY_BOUNTY } from './action';

const initEditState = {
  title: '',
  titleErrMsg: '',

  categoryL1Id: null,
  l1ErrMsg: '',

  categoryL2Id: null,
  l2ErrMsg: '',

  description: '',
  descriptionErrMsg: '',

  privateMessage: '',
  privateMessageErr: '',

  contactMessage: '',
  contactMessageErr: '',

  descExampleShow: false,
  privateMsgExampleShow: false,

  attachmentList: [
    /*
    title, url, size, info
    */
  ],
  attachmentListOrigin: [],

  redoMessage: '',
};

function editBounty(state = initEditState, action) {
  if (action.type === UPDATE_EDIT) {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type === CLEAR_EDIT) {
    return {
      ...initEditState,
    };
  }
  return state;
}

const initMyBounty = {
  list: [],
  total: 0,
  page: 1,
  limit: 10,
  activeTab: 'created',
  // filterBy: 'user_create',
};

function myBounty(state = initMyBounty, action) {
  if (action.type === UPDATE_MY) {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type === RESET_MY_BOUNTY) {
    return {
      ...initMyBounty,
    };
  }
  return state;
}

const initViewBounty = {
  title: '',
  cat1Name: '',
  cat2Name: '',
  description: '',
  privateMessage: '',
  contactMessage: '',
  agreeLicence: '',
  attachmentList: [
    /*
    title, url, size, info
    */
  ],
  isLike: false,

  solutionList: [],
  solutionTotal: 0,
  solutionPage: 1,
  solutionPageLimit: 10,

  commentText: '',
  commentList: [],
  commentTotal: 0,
  commentPage: 1,
  commentLimit: 10,
};
function viewBounty(state = initViewBounty, action) {
  if (action.type === UPDATE_VIEW) {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type === RESET_VIEW) {
    return {
      ...initViewBounty,
    };
  }
  return state;
}

export default combineReducers({
  editBounty,
  myBounty,
  viewBounty,
});
