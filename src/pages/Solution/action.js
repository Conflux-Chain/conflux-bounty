import { ERR_MSG, REGEX, ALI_OSS_KEYS, SOLUTION_STATUS_ENUM } from '../../constants';
import * as utils from '../../utils';

import {
  reqBountyQuery,
  reqSolutionCreate,
  reqSolutionUpdate,
  reqSolutionQuery,
  reqMySolution,
  reqSendLike,
  reqCheckLike,
  reqUpdateMileStone,
  reqSolutionList,
} from '../../utils/api';

export const UPDATE_EDIT = 'solution-edit/UPDATE';
export const UPDATE_EDIT_MILESTONE = 'solution-edit/UPDATE_MILESTONE';
export const CLEAR_EDIT = 'solution-edit/CLEAR_EDIT';

export function updateEdit(d) {
  return {
    type: UPDATE_EDIT,
    payload: d,
  };
}
export function clearEdit() {
  return {
    type: CLEAR_EDIT,
    payload: {},
  };
}

export function updateEditMileStone(d, index) {
  return {
    type: UPDATE_EDIT_MILESTONE,
    payload: d,
    index,
  };
}

export const getBounty = bountyId => (dispatch, getState) => {
  if (!bountyId) {
    utils.notice.show({
      type: 'message-error-light',
      content: utils.i18nTxt('please provide bountyId'),
      timeout: 100 * 1000,
    });
    return;
  }

  const { bountyCache } = getState().common;
  let bountyTitlep;
  if (bountyCache[bountyId]) {
    bountyTitlep = Promise.resolve(bountyCache[bountyId].title);
  } else {
    bountyTitlep = dispatch(reqBountyQuery({ bountyId })).then(body => {
      return body.result.title;
    });
  }
  bountyTitlep.then(bountyTitle => {
    dispatch(updateEdit({ bountyTitle, bountyId }));
  });
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
      const { editSolution } = getState().solution;
      const attachmentListCopy = editSolution.attachmentList.slice();

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
const isEmpty = val => {
  if (!val) {
    return true;
  }
  if (REGEX.CHECK_BLANK.test(val)) {
    return true;
  }
  return false;
};

export const doSubmit = ({ pageType, history }) => (dispatch, getState) => {
  const { editSolution } = getState().solution;
  const query = utils.getQuery();
  const errs = {
    descriptionErrMsg: '',
    contactMessageErr: '',
  };

  const pairs = {
    description: 'descriptionErrMsg',
    contactMessage: 'contactMessageErr',
    // agreeLicence: 'agreeLicenceErr',
  };

  let valid = true;
  Object.keys(pairs).forEach(key => {
    if (isEmpty(editSolution[key])) {
      valid = false;
      errs[pairs[key]] = ERR_MSG.NOT_BLANK;
    }
  });

  const milestoneList = editSolution.milestoneList.map(v => {
    const milest = { ...v };

    if (isEmpty(milest.title)) {
      valid = false;
      milest.titleErr = ERR_MSG.NOT_BLANK;
    }
    if (isEmpty(milest.description)) {
      valid = false;
      milest.descriptionErr = ERR_MSG.NOT_BLANK;
    }
    if (!REGEX.CHECK_NUMBER.test(milest.duration)) {
      valid = false;
      milest.durationErr = ERR_MSG.POSITIVE_NUMBER;
    } else if (milest.duration > 90) {
      valid = false;
      milest.durationErr = ERR_MSG.NO_LARGE_THAN_90;
    }
    return milest;
  });

  dispatch(
    updateEdit({
      ...errs,
      milestoneList,
    })
  );

  if (valid === false) {
    utils.scrollToErr();
  } else {
    if (!editSolution.bountyTitle) {
      utils.notice.show({
        type: 'message-notice',
        content: 'no bounty title, please reload',
        timeout: 3000,
      });
      return;
    }

    const baseParam = {
      title: editSolution.bountyTitle,
      bountyId: query.bountyId,
      description: editSolution.description,
      privateMessage: editSolution.privateMessage,
      contactMessage: editSolution.contactMessage,
      milestoneList: milestoneList.map(v => {
        return {
          ...v,
          duration: parseInt(v.duration, 10),
        };
      }),
    };
    if (pageType === 'create') {
      const param = {
        ...baseParam,
        attachmentList: editSolution.attachmentList,
      };
      reqSolutionCreate(param).then(body => {
        utils.notice.show({
          type: 'message-success',
          content: utils.i18nTxt('create success'),
          timeout: 3000,
        });
        setTimeout(() => {
          history.push(`/create-submission-success?bountyId=${query.bountyId}&submissionId=${body.result.id}`);
        }, 600);
      });
    } else if (pageType === 'edit') {
      if (editSolution.status === SOLUTION_STATUS_ENUM.REVIEWING) {
        // todo other status
        utils.notice.show({
          type: 'message-error-light',
          content: utils.i18nTxt('submission is already reviewing'),
          timeout: 3000,
        });
        return;
      }
      const param = {
        ...baseParam,
        bountyId: editSolution.bountyId,
        submissionId: query.submissionId,
        attachmentList: editSolution.attachmentList.slice(),
      };

      utils.addDelAttachment(param.attachmentList, editSolution.attachmentListOrigin);

      reqSolutionUpdate(param).then(body => {
        utils.notice.show({
          type: 'message-success',
          content: utils.i18nTxt('edit success'),
          timeout: 3000,
        });
        setTimeout(() => {
          history.push(`/edit-submission-success?submissionId=${body.result.id}`);
        }, 600);
      });
    }
  }
};

export const getSolution = () => dispatch => {
  const query = utils.getQuery();
  if (!query.submissionId) {
    utils.notice.show({
      type: 'message-error',
      content: utils.i18nTxt('please provide submissionId'),
      timeout: 100 * 1000,
    });
    return Promise.reject();
  }
  return reqSolutionQuery({
    submissionId: query.submissionId,
  }).then(body => {
    dispatch(
      updateEdit({
        ...body.result,
        attachmentListOrigin: body.result.attachmentList.map(v => {
          return { ...v };
        }),
      })
    );
    return body;
  });
};

// mySolution
export const UPDATE_MY = 'solution-my/UPDATE_MY';
export const RESET_MY = 'solution-my/RESET_MY';
export function updateMy(d) {
  return {
    type: UPDATE_MY,
    payload: d,
  };
}
export function resetMy(d) {
  return {
    type: RESET_MY,
    payload: d,
  };
}

export const getmySolution = reqPage => (dispatch, getState) => {
  const { mySolution } = getState().solution;
  return reqMySolution({
    page: reqPage,
    limit: mySolution.limit,
    filterBy: 'user_create',
  }).then(body => {
    dispatch(
      updateMy({
        list: mySolution.list.concat(body.result.list),
        total: body.result.total,
        page: reqPage,
      })
    );
  });
};

// solution view
export const UPDATE_VIEW = 'solution-view/UPDATE_VIEW';
export const RESET_VIEW = 'solution-view/RESET_VIEW';
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
export const getSolutionList = bountyId => (dispatch, getState) => {
  const { solutionListCache } = getState().common;
  const doUpdate = list => {
    dispatch(
      updateView({
        solutionList: list,
      })
    );
  };

  if (solutionListCache[bountyId]) {
    doUpdate(solutionListCache[bountyId]);
  } else {
    dispatch(
      reqSolutionList({
        bountyId,
        page: 1,
        limit: 100,
        cacheRecord: true,
      })
    ).then(body => {
      doUpdate(body.result.list);
    });
  }
};

export const getSolutionView = submissionId => (dispatch, getState) => {
  if (!submissionId) {
    utils.notice.show({
      type: 'message-error',
      content: utils.i18nTxt('please provide submissionId'),
      timeout: 100 * 1000,
    });
    return;
  }
  reqSolutionQuery({
    submissionId,
  }).then(body => {
    const { bountyId } = body.result;
    const { user } = body.result;
    dispatch(
      updateView({
        status: body.result.status,
        description: body.result.description,
        attachmentList: body.result.attachmentList,
        bountyId,
        user,
        milestoneList: body.result.milestoneList.sort((a, b) => a.step - b.step),
        // fansCoin: body.result.fansCoin,
        reward: body.result.reward,
        likeNumber: body.result.likeNumber,
      })
    );

    const { bountyCache } = getState().common;
    let bountyPromise;
    if (bountyCache[bountyId]) {
      bountyPromise = Promise.resolve(bountyCache[bountyId]);
    } else {
      bountyPromise = dispatch(reqBountyQuery({ bountyId })).then(body1 => {
        return body1.result;
      });
    }
    bountyPromise.then(bounty => {
      dispatch(
        updateView({
          bounty,
        })
      );
      if (window.location.pathname === '/view-submission') {
        document.title = `${utils.i18nTxt(`Submission`)}${user.nickname}: ${bounty.title} `;
      }
    });
    dispatch(getSolutionList(bountyId));
  });
};

export const freshSubmissionDesc = ({ submissionId, language }) => dispatch => {
  reqSolutionQuery({
    submissionId,
    language,
  }).then(body => {
    dispatch(
      updateView({
        addTranslate: true,
        descriptionTranslated: body.result.description,
        milestoneListTraqnslated: body.result.milestoneList,
      })
    );
  });
};

export const sendLike = (submissionId, type) => (dispatch, getState) => {
  if (utils.auth.loggedIn() === false) {
    utils.notice.show({
      type: 'message-notice',
      content: utils.i18nTxt('please login first'),
      timeout: 3 * 1000,
    });
  }

  return reqSendLike({
    submissionId,
    type,
  }).then(body => {
    if (body.result.submissionId) {
      const { viewSolution } = getState().solution;
      dispatch(
        updateView({
          isLike: type === 'add',
          likeNumber: type === 'add' ? viewSolution.likeNumber + 1 : viewSolution.likeNumber - 1,
        })
      );
    }
  });
};

export const getLike = submissionId => dispatch => {
  if (utils.auth.loggedIn() === false) {
    return Promise.resolve();
  }

  return reqCheckLike({
    submissionId,
  }).then(body => {
    dispatch(
      updateView({
        isLike: body.result.isLike,
      })
    );
  });
};

// solution view
export const UPDATE_MILESTONE = 'solution/UPDATE_MILESTONE';
export const UPDATE_MILESTONE_STEP = 'solution/UPDATE_MILESTONE_STEP';
export const RESET_MILESTONE = 'solution/RESET_MILESTONE';

export function updateMileStone(d) {
  return {
    type: UPDATE_MILESTONE,
    payload: d,
  };
}

export function updateMileStoneStep(d, index) {
  return {
    type: UPDATE_MILESTONE_STEP,
    payload: d,
    index,
  };
}

export function resetMileStone(d) {
  return {
    type: RESET_MILESTONE,
    payload: d,
  };
}

export const getMileStone = () => dispatch => {
  const { submissionId } = utils.getQuery();
  if (!submissionId) {
    utils.notice.show({
      type: 'message-error-light',
      content: utils.i18nTxt('please provide submissionId'),
      timeout: 100 * 1000,
    });
    return;
  }
  reqSolutionQuery({
    submissionId,
  }).then(body => {
    dispatch(
      updateMileStone({
        list: body.result.milestoneList,
      })
    );
  });
};

export const uploadFileMileStone = (e, index) => (dispatch, getState) => {
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
      const { editMileStone } = getState().solution;
      const attachmentListCopy = (editMileStone.list[index].attachmentList || []).slice();

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
          updateMileStoneStep(
            {
              attachmentList: attachmentListCopy,
            },
            index
          )
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

export const submitMileStone = ({ milestoneId }) => (dispatch, getState) => {
  const { editMileStone } = getState().solution;
  const { submissionId } = utils.getQuery();

  let valid = true;
  let curMilest;
  const list = editMileStone.list.map(v => {
    const milest = { ...v };
    if (v.id === milestoneId) {
      curMilest = milest;
      if (isEmpty(milest.proof)) {
        valid = false;
        milest.titleErr = ERR_MSG.NOT_BLANK;
      }
    }
    return milest;
  });

  if (valid === false) {
    dispatch(
      updateMileStone({
        list,
      })
    );
    utils.scrollToErr();
  } else {
    reqUpdateMileStone({
      proof: curMilest.proof,
      attachmentList: curMilest.attachmentList || [],
      submissionId,
      milestoneId,
    }).then(body => {
      if (body.result.id) {
        dispatch(getMileStone());
        utils.notice.show({
          type: 'message-success',
          content: utils.i18nTxt('update success'),
          timeout: 3000,
        });
      }
    });
  }
};
