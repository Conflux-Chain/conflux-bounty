/**
 * @fileOverview mock redux store to test redux-thunk
 * @name mock-store.js
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

global.mockStore = configureMockStore([thunk]);

function findAction(store, type) {
  return store.getActions().find(action => action.type === type);
}

global.getAction = function getAction(store, type) {
  const action = findAction(store, type);
  if (action) return Promise.resolve(action);

  return new Promise(resolve => {
    store.subscribe(() => {
      // eslint-disable-next-line no-shadow
      const action = findAction(store, type);
      if (action) resolve(action);
    });
  });
};
