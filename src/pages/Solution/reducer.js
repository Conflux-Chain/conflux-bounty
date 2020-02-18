import { combineReducers } from 'redux';
import {
  UPDATE_EDIT,
  CLEAR_EDIT,
  UPDATE_EDIT_MILESTONE,
  UPDATE_MY,
  UPDATE_VIEW,
  UPDATE_MILESTONE,
  UPDATE_MILESTONE_STEP,
  RESET_MY,
  RESET_MILESTONE,
  RESET_VIEW,
} from './action';

const initEditState = {
  description: '',
  descriptionErrMsg: '',

  privateMessage: '',
  privateMessageErr: '',

  contactMessage: '',
  contactMessageErr: '',

  attachmentList: [],
  attachmentListCopy: [],

  milestoneList: [
    // {
    //   title: '',
    //   titleErr: '',
    //   description: '',
    //   descriptionErr: '',
    //   duration: '',
    //   durationErr: '',
    // },
    // title , description, duration
  ],

  bountyTitle: '',
  showExample: false,
  addTranslate: false,

  milestoneLimit: null,
  confirmSubmitShow: false,
};

function editSolution(state = initEditState, action) {
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
  if (action.type === UPDATE_EDIT_MILESTONE) {
    const { index } = action;
    const tempArr = state.milestoneList.slice();
    tempArr[index] = {
      ...tempArr[index],
      ...action.payload,
    };
    return {
      ...state,
      milestoneList: tempArr,
    };
  }
  return state;
}

const initMySolution = {
  list: [],
  total: 0,
  page: 1,
  limit: 10,
};

function mySolution(state = initMySolution, action) {
  if (action.type === UPDATE_MY) {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type === RESET_MY) {
    return {
      ...initMySolution,
    };
  }
  return state;
}

const initViewSolution = {
  bounty: {},
  solutionList: [],
  status: '',
  description: '',
  privateMessage: '',
  contactMessage: '',
  attachmentList: [],
  milestoneList: [],
  reward: {},
  user: { nickname: '', email: '', invitationCode: '', photoUrl: null },
  noteList: [],
  noteListTranslated: [],
  showEditNoteMsg: false,
  totalSubmission: 0,
};

function viewSolution(state = initViewSolution, action) {
  if (action.type === UPDATE_VIEW) {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type === RESET_VIEW) {
    return {
      ...initViewSolution,
    };
  }
  return state;
}

const initMileStone = {
  list: [],
};

function editMileStone(state = initMileStone, action) {
  if (action.type === UPDATE_MILESTONE) {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type === RESET_MILESTONE) {
    return {
      ...initMileStone,
    };
  }
  if (action.type === UPDATE_MILESTONE_STEP) {
    const { index } = action;
    const tempArr = state.list.slice();
    tempArr[index] = {
      ...tempArr[index],
      ...action.payload,
    };
    return {
      ...state,
      list: tempArr,
    };
  }
  return state;
}

export default combineReducers({
  editSolution,
  mySolution,
  viewSolution,
  editMileStone,
});
