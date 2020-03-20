// eslint-disable-next-line import/no-cycle
import { sendRequest, auth } from './index';
import { UPDATE_COMMON, UPDATE_BOUNTY_CACHE, UPDATE_SOLUTION_LIST_CACHE } from '../constants';

function isNull(a) {
  // todo fix null check
  return a === null || a === 'null';
}

export const getCategory = () => (dispatch, getState) => {
  const { common } = getState();
  if (common.categoryL1List.length > 0) {
    return Promise.resolve({
      categoryMap: common.categoryMap,
      categoryL1List: common.categoryL1List,
    });
  }

  return sendRequest({
    url: '/category',
  }).then(res => {
    const categoryMap = {};
    const categoryL1List = [];
    res.body.result.list.forEach(item => {
      if (isNull(item.parentId)) {
        categoryMap[item.id] = [];
        categoryL1List.push(item);
      }
    });
    res.body.result.list.forEach(item => {
      if (isNull(item.parentId) === false) {
        if (categoryMap[item.parentId]) {
          categoryMap[item.parentId].push(item);
        }
      }
    });
    dispatch({
      type: UPDATE_COMMON,
      payload: {
        categoryMap,
        categoryL1List,
      },
    });
    return {
      categoryL1List,
      categoryMap,
    };
  });
};

export const reqBountyCreate = param => {
  return sendRequest({
    url: '/bounty/create',
    body: param,
  }).then(res => res.body);
};

export const reqBountyQuery = param => dispatch => {
  return sendRequest({
    url: '/bounty/query',
    body: param,
  }).then(res => {
    if (!res.body.result.attachmentList) {
      res.body.result.attachmentList = [];
    }
    dispatch({
      type: UPDATE_BOUNTY_CACHE,
      payload: {
        bountyId: param.bountyId,
        result: res.body.result,
      },
    });
    return res.body;
  });
};

export const reqBountyUpdate = param => {
  return sendRequest({
    url: '/bounty/update',
    body: param,
  }).then(res => res.body);
};

export const reqMyBounty = param => {
  return sendRequest({
    url: '/bounty/mybounty',
    body: param,
  }).then(res => res.body);
};

export const reqBountyList = param => {
  return sendRequest({
    url: '/bounty/list',
    body: param,
    showMask: true,
  }).then(res => res.body);
};

export const reqBroadcastList = () => {
  return sendRequest({
    url: '/announcement/list',
  }).then(res => res.body);
};

export const reqSolutionCreate = param => {
  return sendRequest({
    url: '/submission/create',
    body: param,
  }).then(res => res.body);
};

export const reqSolutionUpdate = param => {
  return sendRequest({
    url: '/submission/update',
    body: param,
  }).then(res => res.body);
};

export const reqSolutionList = param => dispatch => {
  return sendRequest({
    url: '/submission/list',
    body: param,
  }).then(res => {
    if (param.cacheRecord) {
      dispatch({
        type: UPDATE_SOLUTION_LIST_CACHE,
        payload: {
          bountyId: param.bountyId,
          result: res.body.result.list,
        },
      });
    }
    return res.body;
  });
};

export const reqNearBySolution = param => () => {
  return sendRequest({
    url: '/submission/list/nearby',
    body: {
      bountyId: param.bountyId,
      submissionId: param.submissionId,
      count: param.count,
    },
  }).then(res => {
    return res.body;
  });
};

export const reqSolutionQuery = param => {
  return sendRequest({
    url: '/submission/query',
    body: param,
  }).then(res => {
    if (!res.body.result.attachmentList) {
      res.body.result.attachmentList = [];
    }
    return res.body;
  });
};

export const reqMySolution = param => {
  return sendRequest({
    url: '/submission/mysubmission',
    body: param,
  }).then(res => res.body);
};

export const reqAccountQuery = param => {
  return sendRequest({
    url: '/account/query',
    body: param,
  }).then(res => res.body);
};

export const reqSendLike = param => {
  return sendRequest({
    url: '/like',
    body: param,
  }).then(res => res.body);
};

export const reqCheckLike = param => {
  return sendRequest({
    url: '/like/query',
    body: param,
  }).then(res => res.body);
};

export const reqUpdateMileStone = param => {
  return sendRequest({
    url: '/milestone/update',
    body: param,
  }).then(res => res.body);
};

export const reqValidateNickname = param => {
  return sendRequest({
    url: '/user/validateNickname',
    body: param,
  }).then(res => res.body);
};

export const reqCheckDupEmail = param => {
  return sendRequest({
    url: '/user/searchDuplicateEmail',
    body: param,
  }).then(res => res.body);
};

export const reqCheckUserEmail = param => {
  return sendRequest({
    url: '/user/searchEmail',
    body: param,
  }).then(res => res.body);
};

export const reqCheckIsInvitationCodeValid = param => {
  return sendRequest({
    url: '/user/isValidInvitationCode',
    body: param,
  }).then(res => res.body);
};

export const reqUserQuery = param => {
  return sendRequest({
    url: '/user/query',
    body: param,
  }).then(res => res.body);
};

export const reqUserUpdate = (param, config = {}) => {
  return sendRequest({
    url: '/user/update',
    body: param,
    ...config,
  }).then(res => res.body);
};

export const reqSendVerificationEmail = param => {
  return sendRequest({
    url: '/user/sendVerificationEmail',
    body: param,
  }).then(res => res.body);
};

export const reqUserSignup = (param, { getErrMsg }) => {
  return sendRequest({
    url: '/user/signup',
    body: param,
    getErrMsg,
  }).then(res => res.body);
};

export const reqCommentCreate = param => {
  return sendRequest({
    url: '/comment/create',
    body: param,
  }).then(res => res.body);
};

export const reqCommentList = param => {
  return sendRequest({
    url: '/comment/list',
    body: param,
  }).then(res => res.body);
};

export const sendWithdrawVerificationCode = param => {
  return sendRequest({
    url: '/user/sendWithdrawVerificationCode',
    body: param,
  }).then(res => res.body);
};

export const reqDoWithdraw = param => {
  return sendRequest({
    url: '/account/dowithdraw',
    body: param,
  }).then(res => res.body);
};

export const reqRewardsList = () => {
  // return sendRequest({
  //   url: '/account/dowithdraw',
  //   body: param,
  // }).then(res => res.body);
  return Promise.resolve({});
};

export const reqWithdrawList = param => {
  return sendRequest({
    url: '/account/withdraw/list',
    body: param,
  }).then(res => res.body);
};

export const reqMessageList = param => {
  return sendRequest({
    url: '/account/message/list',
    body: param,
  }).then(res => res.body);
};

export const reqMessageQuery = param => {
  return sendRequest({
    url: '/account/message/query',
    body: param,
  }).then(res => res.body);
};

export const reqMessageUpdate = param => {
  return sendRequest({
    url: '/account/message/update',
    body: param,
  }).then(res => res.body);
};

export const reqMessageCount = param => {
  return sendRequest({
    url: '/account/message/count',
    body: param,
  }).then(res => res.body);
};

export const reqMessageReadAll = param => {
  return sendRequest({
    url: '/account/message/readAll',
    body: param,
  }).then(res => res.body);
};

export const reqLogout = param => {
  auth.removeToken();
  return sendRequest({
    url: '/user/logout',
    body: param,
  }).then(res => res.body);
};

export const reqRewardList = param => {
  return sendRequest({
    url: '/account/reward/list',
    body: param,
  }).then(res => res.body);
};

export const reqInvitationCode = param => {
  return sendRequest({
    url: '/user/newInvitationCode',
    body: param,
  }).then(res => res.body);
};

export const reqInvitationLimit = param => {
  return sendRequest({
    url: '/user/checkUserInvitationV1Limit',
    body: param,
  }).then(res => res.body);
};

export const reqGoodsList = param => {
  return sendRequest({
    url: '/goods/list',
    body: param,
  }).then(res => res.body);
};

export const reqOrderList = param => {
  return sendRequest({
    url: '/order/list',
    body: param,
  }).then(res => res.body);
};

export const reqCreateOrder = param => {
  return sendRequest({
    url: '/order/createList',
    body: param,
  }).then(res => res.body);
};

export const reqCreateNote = param => {
  return sendRequest({
    url: '/submission/note/create',
    body: param,
  }).then(res => res.body);
};

export const reqGetCheckInInfo = param => {
  return sendRequest({
    url: '/account/checkin/info',
    body: param,
  }).then(res => res.body);
};

export const reqSubmitCheckIn = param => {
  return sendRequest({
    url: '/account/checkin',
    body: param,
  }).then(res => res.body);
};
// 'api/account/checkin/info'

export const reqLoginBind = param => {
  return sendRequest({
    url: '/account/login/bind',
    body: param,
  }).then(res => res.body);
};

export const reqAcccountUnBind = param => {
  return sendRequest({
    url: '/account/unbind',
    body: param,
  }).then(res => res.body);
};
