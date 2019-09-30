import React, { Suspense, lazy } from 'react';
import template from 'lodash/template';
import { createIntl, createIntlCache } from 'react-intl';
import zhTranslationMessages from '../lang/zh';
import enTranslationMessages from '../lang/en';

const cache = createIntlCache();
const messageTotal = {
  en: enTranslationMessages,
  'zh-CN': zhTranslationMessages,
};

let store;
export const updateStore = s => {
  store = s;
};

export const i18nTxt = (str, param, lang) => {
  if (str === null || typeof str === 'undefined' || str === '') {
    return '';
  }
  const language = lang || store.getState().head.user.language;
  const intl = createIntl(
    {
      locale: language,
      messages: messageTotal[language],
    },
    cache
  );
  const txt = intl.formatMessage({
    id: str,
  });

  if (param) {
    return template(txt)(param);
  }
  return txt;
};

export const i18nTxtAsync = (str, lang) => {
  if (str === null || typeof str === 'undefined' || str === '') {
    return '';
  }
  const language = lang || store.getState().head.user.language;
  const LazyComp = lazy(() => {
    return messageTotal[language][str].then(content => {
      return {
        default: () => {
          return <div dangerouslySetInnerHTML={{ __html: content.default }}></div>;
        },
      };
    });
  });

  return (
    <Suspense fallback={<div />}>
      <LazyComp />
    </Suspense>
  );
};
