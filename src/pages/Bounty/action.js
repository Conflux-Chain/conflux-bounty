import get from 'lodash/get';
import { ERR_MSG, REGEX, ALI_OSS_KEYS, BOUNTY_STATUS_ENUM } from '../../constants';
import * as utils from '../../utils';

import {
  reqBountyCreate,
  reqMyBounty,
  reqBountyQuery,
  reqBountyUpdate,
  reqCheckLike,
  reqSendLike,
  reqCommentCreate,
  reqCommentList,
  reqSolutionList,
} from '../../utils/api';

export const UPDATE_EDIT = 'bounty-edit/UPDATE';
export const CLEAR_EDIT = 'bounty-edit/CLEAR_EDIT';
export function updateEdit(d) {
  return {
    type: UPDATE_EDIT,
    payload: d,
  };
}
export function clearEdit(d) {
  return {
    type: CLEAR_EDIT,
    payload: d,
  };
}

let lockSubmit = false;

export const doSubmit = ({ pageType, history }) => (dispatch, getState) => {
  const { editBounty } = getState().bounty;
  const errs = {
    titleErrMsg: '',
    l1ErrMsg: '',
    l2ErrMsg: '',
    descriptionErrMsg: '',
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

  const pairs = {
    title: 'titleErrMsg',
    categoryL1Id: 'l1ErrMsg',
    categoryL2Id: 'l2ErrMsg',
    description: 'descriptionErrMsg',
  };

  let valid = true;
  Object.keys(pairs).forEach(key => {
    if (isEmpty(editBounty[key])) {
      valid = false;
      errs[pairs[key]] = ERR_MSG.NOT_BLANK;
    }
  });

  dispatch(
    updateEdit({
      ...errs,
    })
  );

  if (valid === false) {
    utils.scrollToErr();
  } else {
    const baseParam = {
      title: editBounty.title,
      categoryId: editBounty.categoryL2Id,
      description: editBounty.description,
      privateMessage: editBounty.privateMessage,
    };
    if (!baseParam.privateMessage) {
      delete baseParam.privateMessage;
    }
    if (pageType === 'create') {
      if (lockSubmit) {
        return;
      }
      lockSubmit = true;
      const param = {
        ...baseParam,
        attachmentList: editBounty.attachmentList,
      };
      reqBountyCreate(param).then(body => {
        utils.notice.show({
          type: 'message-success',
          content: utils.i18nTxt('create success'),
          timeout: 3000,
        });
        setTimeout(() => {
          lockSubmit = false;
          history.push(`/create-bounty-success?bountyId=${body.result.id}`);
        }, 600);
      })
      .catch(() => {
        lockSubmit = false;
      });

    } else if (pageType === 'edit') {
      if (editBounty.status === BOUNTY_STATUS_ENUM.REVIEWING) {
        // todo other status
        utils.notice.show({
          type: 'message-error-light',
          content: utils.i18nTxt('bounty is reviewing'),
          timeout: 3000,
        });
        return;
      }
      const query = utils.getQuery();
      const param = {
        ...baseParam,
        bountyId: query.bountyId,
        attachmentList: editBounty.attachmentList.slice(),
      };
      utils.addDelAttachment(param.attachmentList, editBounty.attachmentListOrigin);

      reqBountyUpdate(param).then(body => {
        utils.notice.show({
          type: 'message-success',
          content: utils.i18nTxt('edit success'),
          timeout: 3000,
        });
        setTimeout(() => {
          history.push(`/edit-bounty-success?bountyId=${body.result.id}`);
        }, 600);
      });
    }
  }
};

export const uploadFile = e => (dispatch, getState) => {
  const { files } = e.target;
  const { target } = e;
  const curFile = files[0];
  if (!curFile) {
    return;
  }

  if (!utils.checkFileSize(curFile.size)) {
    return;
  }

  const fileKey = utils.encodeKey(curFile.name);
  const md5Promise = utils.getMd5(curFile);

  utils.uploadFileOss(fileKey, curFile).then(() => {
    md5Promise.then(md5 => {
      const { editBounty } = getState().bounty;
      const attachmentListCopy = editBounty.attachmentList.slice();

      attachmentListCopy.push({
        title: curFile.name,
        url: utils.genUrlFromName(curFile.name, md5),
        size: curFile.size,
        info: {
          md5,
          attachmentGetHost: ALI_OSS_KEYS.attachmentGetHost,
          downBucket: ALI_OSS_KEYS.downBucket,
        },
      });

      const upAttach = () => {
        dispatch(
          updateEdit({
            attachmentList: attachmentListCopy,
          })
        );
      };
      if (utils.isImgLike(curFile.name)) {
        setTimeout(upAttach, 1000);
      } else {
        upAttach();
      }
      target.value = '';
    });
  });
};

export const getBounty = () => dispatch => {
  const query = utils.getQuery();
  if (!query.bountyId) {
    utils.notice.show({
      type: 'message-error-light',
      content: utils.i18nTxt('please provide bountyId'),
      timeout: 100 * 1000,
    });
    return Promise.reject();
  }
  return dispatch(reqBountyQuery({ bountyId: query.bountyId })).then(body => {
    // const { editBounty } = getState().bounty;

    dispatch(
      updateEdit({
        ...body.result,
        categoryL1Id: get(body, 'result.categoryList.0.id'),
        categoryL2Id: get(body, 'result.categoryList.1.id'),
        attachmentListOrigin: body.result.attachmentList.map(v => {
          return { ...v };
        }),
      })
    );
  });
};

// mybounty
export const UPDATE_MY = 'bounty-my/UPDATE_MY';
export function updateMy(d) {
  return {
    type: UPDATE_MY,
    payload: d,
  };
}
export const RESET_MY_BOUNTY = 'bounty-my/RESET_MY_BOUNTY';
export function resetMy(d) {
  return {
    type: RESET_MY_BOUNTY,
    payload: d,
  };
}

export const getMyBounty = reqPage => (dispatch, getState) => {
  const { myBounty } = getState().bounty;
  return reqMyBounty({
    page: reqPage,
    limit: myBounty.limit,
    filterBy: 'user_create',
  }).then(body => {
    dispatch(
      updateMy({
        page: reqPage,
        list: myBounty.list.concat(body.result.list),
        total: body.result.total,
      })
    );
  });
};

export const getMyJoinedBounty = reqPage => (dispatch, getState) => {
  const { myBounty } = getState().bounty;
  return reqMyBounty({
    page: reqPage,
    limit: myBounty.joinedLimit,
    filterBy: 'user_create_submission',
  }).then(body => {
    dispatch(
      updateMy({
        joinedPage: reqPage,
        joinedlist: myBounty.joinedlist.concat(body.result.list),
        joinedTotal: body.result.total,
      })
    );
  });
};

// view bounty
export const UPDATE_VIEW = 'bounty-view/UPDATE_VIEW';
export const RESET_VIEW = 'bounty-view/RESET_VIEW';
export function updateView(d) {
  return {
    type: UPDATE_VIEW,
    payload: d,
  };
}
export function resetView(d) {
  return {
    type: RESET_VIEW,
    payload: d,
  };
}

export const getBountyView = () => dispatch => {
  const query = utils.getQuery();
  if (!query.bountyId) {
    utils.notice.show({
      type: 'message-error-light',
      content: utils.i18nTxt('please provide bountyId'),
      timeout: 100 * 1000,
    });
    return Promise.reject();
  }
  return dispatch(reqBountyQuery({ bountyId: query.bountyId })).then(body => {
    dispatch(
      updateView({
        likeNumber: body.result.likeNumber || 0,
        cat1Name: get(body, 'result.categoryList.0.name'),
        cat2Name: get(body, 'result.categoryList.1.name'),
        ...body.result,
      })
    );
    document.title = `${utils.i18nTxt('View Bounty')}: ${body.result.title}`;
  });
};

export const getLike = () => dispatch => {
  const query = utils.getQuery();
  if (!query.bountyId) {
    utils.notice.show({
      type: 'message-error-light',
      content: utils.i18nTxt('please provide bountyId'),
      timeout: 100 * 1000,
    });
    return Promise.reject();
  }

  if (!utils.auth.loggedIn()) {
    return Promise.resolve();
  }
  return reqCheckLike({
    bountyId: query.bountyId,
  }).then(body => {
    dispatch(
      updateView({
        isLike: body.result.isLike,
      })
    );
  });
};

export const sendLike = type => (dispatch, getState) => {
  if (utils.auth.loggedIn() === false) {
    utils.notice.show({
      type: 'message-error-light',
      content: utils.i18nTxt('please login first'),
      timeout: 3 * 1000,
    });
    return Promise.resolve();
  }

  const query = utils.getQuery();
  return reqSendLike({
    bountyId: query.bountyId,
    type,
  }).then(body => {
    if (body.result.bountyId) {
      const { viewBounty } = getState().bounty;
      dispatch(
        updateView({
          isLike: type === 'add',
          likeNumber: type === 'add' ? viewBounty.likeNumber + 1 : viewBounty.likeNumber - 1,
        })
      );
    }
  });
};

function prependToComment(list, commentList) {
  const commentListCp = commentList.slice();
  for (let i = 0; i < list.length; i += 1) {
    const curItem = list[list.length - 1 - i];
    const finded = commentListCp.some((v, index) => {
      if (v.id === curItem.id) {
        commentListCp[index] = v;
        return true;
      }
      return false;
    });
    if (!finded) {
      commentListCp.unshift(curItem);
    }
  }
  return commentListCp;
}

export const sendComment = () => (dispatch, getState) => {
  const { bountyId } = utils.getQuery();

  const { viewBounty } = getState().bounty;
  const { user } = getState().head;
  reqCommentCreate({
    bountyId,
    description: viewBounty.commentText,
  }).then(body => {
    const comment = {
      ...body.result,
      user,
    };

    dispatch(
      updateView({
        commentText: '',
        commentList: [comment].concat(viewBounty.commentList),
      })
    );

    reqCommentList({
      bountyId,
      page: 1,
      limit: 10,
    }).then(body1 => {
      const list = body1.result.list || [];
      const commentListNew = prependToComment(list, getState().bounty.viewBounty.commentList);
      dispatch(
        updateView({
          commentList: commentListNew,
          commentTotal: body1.result.total,
        })
      );
    });
  });
};

export const getCommentList = page => (dispatch, getState) => {
  const { bountyId } = utils.getQuery();
  const { viewBounty } = getState().bounty;

  let nextPage;
  if (page === 'nextPage') {
    nextPage = utils.getTotalPage(viewBounty.commentList.length, viewBounty.commentLimit) + 1;
  } else {
    nextPage = page;
  }

  reqCommentList({
    bountyId,
    page: nextPage,
    limit: viewBounty.commentLimit,
  }).then(body => {
    const commentLimitCopy = getState().bounty.viewBounty.commentList.slice();
    const list = body.result.list || [];
    list.forEach(item => {
      if (commentLimitCopy.some(v => v.id === item.id) === false) {
        commentLimitCopy.push(item);
      }
    });

    dispatch(
      updateView({
        commentList: commentLimitCopy,
        commentTotal: body.result.total,
        commentPage: nextPage,
      })
    );
  });
};

export const getSolutionList = page => (dispatch, getState) => {
  const { bountyId } = utils.getQuery();
  const { viewBounty } = getState().bounty;

  dispatch(
    reqSolutionList({
      bountyId,
      page,
      limit: viewBounty.solutionPageLimit,
    })
  ).then(body => {
    dispatch(
      updateView({
        solutionList: viewBounty.solutionList.concat(body.result.list || []),
        solutionTotal: body.result.total,
        solutionPage: page,
      })
    );
  });
};
