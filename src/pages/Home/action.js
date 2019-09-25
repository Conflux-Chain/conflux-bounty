import { reqBountyList, reqBroadcastList } from '../../utils/api';

export const UPDATE_HOME = 'bounty-home/UPDATE';

export function update(d) {
  return {
    type: UPDATE_HOME,
    payload: d,
  };
}

export const getBountyList = ({ category: categoryP, subCategory: subCategoryP, tag: tagP, sort: sortP }) => (dispatch, getState) => {
  const updateHome = getState().home;
  const category = categoryP !== undefined ? categoryP : updateHome.category;
  const subCategory = subCategoryP !== undefined ? subCategoryP : updateHome.subCategory;
  const tag = tagP || updateHome.tag;
  const sort = sortP || updateHome.sort;
  let categoryId = null;
  if (subCategory !== null) {
    categoryId = subCategory;
  } else if (category !== null) {
    categoryId = category;
  }
  dispatch(update({ category, subCategory, tag, sort }));
  return reqBountyList({
    categoryId,
    status: tag.toUpperCase(),
    limit: tag === 'open' ? 8 : 9,
    sort,
    skip: 0,
    filterBy: 'home',
  }).then(body => {
    dispatch(
      update({
        bountyList: body.result.list,
        total: body.result.total,
      })
    );
  });
};

export const getPopBountyList = () => dispatch => {
  return reqBountyList({
    filterBy: 'select',
    sort: 'time_desc',
  }).then(body => {
    dispatch(
      update({
        popBountyList: body.result.list,
      })
    );
  });
};

export const getBroadcastList = () => dispatch => {
  return reqBroadcastList().then(body => {
    dispatch(
      update({
        broadcastList: body.result.list,
      })
    );
  });
};

export const getMoreBounty = () => (dispatch, getState) => {
  const updateHome = getState().home;
  const { category, subCategory, tag, sort, bountyList } = updateHome;
  let categoryId = null;
  if (subCategory !== null) {
    categoryId = subCategory;
  } else if (category !== null) {
    categoryId = category;
  }
  return reqBountyList({
    categoryId,
    status: tag.toUpperCase(),
    limit: 9,
    sort,
    skip: bountyList.length,
    filterBy: 'home',
  }).then(body => {
    const newBountyList = bountyList.concat(body.result.list);
    dispatch(
      update({
        bountyList: newBountyList,
      })
    );
  });
};
