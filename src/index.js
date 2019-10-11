import * as Sentry from '@sentry/browser';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './reducers/index';
import App from './App';
import { updateDispatch } from './utils';
import { updateStore } from './utils/i18n';

window.recaptchaOptions = {
  useRecaptchaNet: true,
};

Sentry.init({ dsn: 'https://14d772ae785b46d2979814725a251882@sentry.conflux-chain.org/3' });

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
updateDispatch(store.dispatch);
updateStore(store);

/* eslint-enable */
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
