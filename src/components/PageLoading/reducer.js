const initState = {
  loadingCount: 0,
  maskCount: 0,
};

export default (state = initState, action) => {
  if (action.type === 'PAGE_LOADING+') {
    return {
      ...state,
      loadingCount: state.loadingCount + 1,
    };
  }

  if (action.type === 'PAGE_LOADING-') {
    let count = state.loadingCount - 1;
    if (count < 0) {
      count = 0;
    }
    return {
      ...state,
      loadingCount: count,
    };
  }

  if (action.type === 'PAGE_MASK+') {
    return {
      ...state,
      maskCount: state.maskCount + 1,
    };
  }
  if (action.type === 'PAGE_MASK-') {
    let count = state.maskCount - 1;
    if (count < 0) {
      count = 0;
    }
    return {
      ...state,
      maskCount: count,
    };
  }

  return state;
};
