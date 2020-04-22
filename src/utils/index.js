/* eslint-disable no-console */
import superagent from 'superagent';
import { matchPath } from 'react-router-dom';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';
import decode from 'jwt-decode';
import qs from 'querystring';
import moment from 'moment';
import M from 'materialize-css';
import viewer from 'react-mobile-image-viewer';
import 'react-mobile-image-viewer/lib/index.css';
import React from 'react';
import BMF from './bmf';

import { toast as $toast } from '../components/Toast';
import { notice as $notice } from '../components/Message/notice';
import { ALI_OSS_KEYS, UPDATE_HEAD, UPDATE_UNREAD_MESSAGE_COUNT } from '../constants';
// eslint-disable-next-line import/no-cycle
import { reqAccountQuery, reqMessageCount } from './api';
import { i18nTxt, i18nTxtAsync } from './i18n';
import unitParser from './device';

export { compose } from 'redux';
export { i18nTxt, i18nTxtAsync };

const USER_ERROR = {
  0: 'Unauthorized',
  1: 'Invalid third party token',
  2: 'Invalid user id',
  3: 'Duplicate email',
  4: 'Nickname already exists, please re-enter',
  5: 'Validation failed. Please check your email verification code',
  6: 'Invalid operation',
  7: 'Invalid password',
  8: 'Invalid current email address',
  9: 'Duplicate new email address',
  10: 'Invalid file format',
  11: 'Invalid email address',
  12: 'Send email too often , please wait',
  13: 'Invalid invitation code',
  14: 'Please request next invitation code 5 seconds later',
  15: 'You run out of invites',
  16: 'Nickname contains sensitive words, please re-enter',
  17: 'Nickname should only contain letters, digits and underscores',
  18: 'Nickname should only contain no more than 30 characters',
};

/*
  {
    url: '/xxx',
    type: 'GET', //默认
    query: { // get参数
    },
    body: { // post参数
    },
    headers: {} // 可选
  }
  error code under HTTP status code 2xx:
 0. no error
 1. Parameter error: input parameters invalid
 2. Database error: database service is not available
 3. Full-node error: full-node is not available
*/

let dispatch = () => {};
export const updateDispatch = fn => {
  dispatch = fn;
};

export const sendRequest = config => {
  const reqType = config.type || 'POST';
  // eslint-disable-next-line no-use-before-define
  const urlQuery = getQuery();
  let siteLang = localStorage.getItem('SITE_LANG') || 'en';
  if (urlQuery.language) {
    siteLang = urlQuery.language;
  }
  // eslint-disable-next-line no-use-before-define
  const accessToken = auth.getToken();
  const reqPromise = superagent(reqType, `/api${config.url}`)
    .set({ ...config.headers, authorization: accessToken, 'X-SITE-LANG': siteLang })
    .query(config.query)
    .send(config.body)
    .responseType(config.responseType || 'json');

  if (config.showLoading !== false) {
    dispatch({
      type: 'PAGE_LOADING+',
      payload: {},
    });
  }
  if (config.showMask) {
    dispatch({
      type: 'PAGE_MASK+',
      payload: {},
    });
  }

  reqPromise
    .then(result => {
      if (result.body.code >= 500) {
        let content;
        switch (result.body.code) {
          case 499:
            content = 'PermissionError';
            break;
          case 502:
            content = 'app.comp.toast.error.2';
            break;
          case 503:
            content = 'app.comp.toast.error.3';
            break;
          case 4004: {
            const tips = i18nTxt(
              'The number of Submissions you submit exceeds the maximum number of Submissions that can be submitted by a single user in this Bounty.'
            );
            $notice.show({ content: tips, type: 'message-error-light', timeout: 7000 });
            return;
          }
          default:
            content = 'server error';
        }

        if (config.showError !== false) {
          $toast.info({
            content,
            detail: result.body.message,
            title: 'Sorry! there is something wrong',
          });
        }
      } else if (result.body.code > 0) {
        if (!config.manualNotice && result.body.result && result.body.result.errorCode !== undefined) {
          const errMsg = i18nTxt(USER_ERROR[result.body.result.errorCode]);
          $notice.show({ content: errMsg, type: 'message-error', timeout: 3000 });
        } else if (config.manualNotice !== true) {
          let errContent = result.body.message || 'internal server error';
          if (result.body.code === 499) {
            errContent = i18nTxt('PermissionError');
          }
          if (config.getErrMsg) {
            errContent = config.getErrMsg(result.body);
          }
          $notice.show({ content: errContent, type: 'message-error', timeout: 3000 });
        }
      }
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log(error);
      $toast.error({
        content: i18nTxt('Please reload page'),
        title: i18nTxt('Network Error'),
      });
    })
    .then(() => {
      if (config.showLoading !== false) {
        dispatch({
          type: 'PAGE_LOADING-',
          payload: {},
        });
      }
      if (config.showMask) {
        dispatch({
          type: 'PAGE_MASK-',
          payload: {},
        });
      }
    });

  return reqPromise.then(result => {
    if (result.body.code >= 499) {
      throw result;
    }
    return result;
  });
};

export function isPath(location, path) {
  if (
    matchPath(location.pathname, {
      path,
      exact: true,
      strict: false,
    })
  ) {
    return true;
  }
  return false;
}

export const toThousands = num => {
  let str = `${num}`;
  const re = /(?=(?!(\b))(\d{3})+$)/g;
  str = str.replace(re, ',');
  return str;
};
export const toast = $toast;
export const notice = $notice;

const location = PropTypes.shape({
  hash: PropTypes.string.isRequired,
  key: PropTypes.string, // only in createBrowserHistory and createMemoryHistory
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  state: PropTypes.oneOfType([PropTypes.array, PropTypes.bool, PropTypes.number, PropTypes.object, PropTypes.string]), // only in createBrowserHistory and createMemoryHistory
});

const history = PropTypes.shape({
  action: PropTypes.oneOf(['PUSH', 'REPLACE', 'POP']).isRequired,
  block: PropTypes.func.isRequired,
  canGo: PropTypes.func, // only in createMemoryHistory
  createHref: PropTypes.func.isRequired,
  entries: PropTypes.arrayOf(location), // only in createMemoryHistory
  go: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  index: PropTypes.number, // only in createMemoryHistory
  length: PropTypes.number,
  listen: PropTypes.func.isRequired,
  location: location.isRequired,
  push: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
});

export const commonPropTypes = {
  history,
  location,
};

export const scrollToErr = () => {
  setTimeout(() => {
    const errElem = document.querySelector('.helper-text');
    if (errElem) {
      errElem.scrollIntoViewIfNeeded();
    }
  }, 100);
};

export function genUUid() {
  return uuidv1();
}
export function encodeKey(str) {
  return `bounty/${str}(${genUUid()})`;
}
export function encodeImgKey(str) {
  return `img/${str}(${genUUid()})`;
}
export function decodeKey(str) {
  let fileName = str;
  fileName = str.replace(/^bounty\//, '');
  fileName = str.replace(/\(\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\)$/, '');
  return fileName;
}

export function getMd5(file) {
  return new Promise((resolve, reject) => {
    const bmf = new BMF();
    bmf.md5(
      file,
      (err, md5) => {
        if (err) {
          reject(err);
        } else {
          resolve(md5);
        }
      },
      () => {}
    );
  });
}

export function genUrlFromName(name, md5hex) {
  return `${ALI_OSS_KEYS.attachmentGetHost}/bounty/${md5hex}/${encodeURIComponent(name)}`;
}

export function genImgUrlFromName(name, md5hex) {
  return `${ALI_OSS_KEYS.attachmentGetHost}/img/${md5hex}/${encodeURIComponent(name)}`;
}

let ossClient;
const getOssClient = () => {
  if (ossClient) {
    return Promise.resolve(ossClient);
  }
  return import('ali-oss').then(mod => {
    const Oss = mod.default;
    ossClient = new Oss({
      region: ALI_OSS_KEYS.region,
      accessKeyId: ALI_OSS_KEYS.AccessKeyId,
      accessKeySecret: ALI_OSS_KEYS.AccessKeySecret,
      bucket: ALI_OSS_KEYS.bucket,
    });
    return ossClient;
  });
};

export const uploadFileOss = (key, file) => {
  dispatch({
    type: 'PAGE_LOADING+',
    payload: {},
  });

  const reqFile = getOssClient().then(client => {
    return client.put(key, file).then(result => {
      return result;
    });
  });

  reqFile
    .catch(e => {
      // eslint-disable-next-line no-console
      console.log(e);
      notice.show({
        type: 'message-error-light',
        content: e.message || 'upload failed',
        timeout: 3000,
      });
    })
    .then(() => {
      dispatch({
        type: 'PAGE_LOADING-',
        payload: {},
      });
    });

  return reqFile;
};

export const getDefaultLang = () => {
  if (navigator.language.indexOf('zh') === 0) {
    return 'zh-CN';
  }
  return 'en';
};

export const auth = {
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = auth.getToken(); // GEtting token from localstorage
    return !!token && !auth.isTokenExpired(token); // handwaiving here
  },
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        // Checking if token is expired. N
        if (auth.expireShow === false) {
          auth.expireShow = true;
          notice.show({
            type: 'message-error-light',
            content: i18nTxt('login expired, please sign in again'),
            timeout: 3000,
          });
          setTimeout(() => {
            auth.expireShow = false;
            window.location.href = '/signin';
          }, 3000);
        }
        auth.removeToken();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },
  setToken(token) {
    localStorage.setItem('accessToken', token);
    auth.$token = token;

    reqAccountQuery().then(body => {
      dispatch({
        type: UPDATE_HEAD,
        payload: {
          user: body.result.user,
          fansCoin: body.result.fansCoin,
          fansCoinLocked: body.result.fansCoinLocked,
          role: body.result.role,
          status: body.result.status,
        },
      });
    });

    reqMessageCount({ isRead: false }).then(body => {
      dispatch({
        type: UPDATE_UNREAD_MESSAGE_COUNT,
        payload: {
          messageCount: body.result.total,
        },
      });
    });
  },
  getToken() {
    if (auth.$token) {
      return auth.$token;
    }
    auth.$token = localStorage.getItem('accessToken');
    return auth.$token;
  },
  removeToken() {
    dispatch({
      type: UPDATE_HEAD,
      payload: {
        user: { nickname: '', email: '', invitationCode: '', language: getDefaultLang() },
        fansCoin: 0,
        id: '',
        fansCoinLocked: 0,
      },
    });

    dispatch({
      type: UPDATE_UNREAD_MESSAGE_COUNT,
      payload: {
        messageCount: 0,
      },
    });
    auth.$token = null;
    return localStorage.removeItem('accessToken');
  },
};

export const pageToOffset = (page, limit) => {
  return (page - 1) * limit;
};

export function getQuery() {
  return qs.parse(window.location.search.replace(/^\?/, ''));
}
export function getTotalPage(totalNum, limit) {
  return Math.ceil(totalNum / limit);
}

export function fmtToDay(date) {
  return moment(date).format('YYYY/MM/DD');
}

export const addDelAttachment = (attachmentList, attachmentListOrigin) => {
  const originMap = {};
  attachmentListOrigin.forEach(v => {
    originMap[v.url] = v;
  });
  // prefer to use origin values
  attachmentList.forEach((v, index) => {
    if (originMap[v.url]) {
      // eslint-disable-next-line no-param-reassign
      attachmentList[index] = originMap[v.url];
    }
  });

  attachmentListOrigin.forEach(v => {
    if (attachmentList.some(item => item.url === v.url)) {
      // finded
      return;
    }
    attachmentList.push({
      ...v,
      isDelete: true,
    });
  });
};

export const renderAny = cb => {
  return cb();
};

export function getStatus(status) {
  switch (status) {
    case 'REVIEWING':
      return i18nTxt('Reviewing');
    case 'PENDING':
      return i18nTxt('Pending');
    case 'OPEN':
      return i18nTxt('Open');
    case 'ONGOING':
      return i18nTxt('Ongoing');
    case 'HAND_IN':
      return i18nTxt('Auditing');
    case 'AUDITING':
      return i18nTxt('Final Auditing');
    case 'FINISHED':
      return i18nTxt('Finished');
    case 'EXPIRED':
      return i18nTxt('Expired');
    default:
      return status;
  }
}

export function getStatusMileStone(status) {
  switch (status) {
    case 'PENDING':
      return i18nTxt('Pending');
    case 'ONGOING':
      return i18nTxt('Ongoing');
    case 'AUDITING':
      return i18nTxt('Auditing');
    case 'FINISHED':
      return i18nTxt('Finished');
    case 'EXPIRED':
      return i18nTxt('Expired');
    default:
      return status;
  }
}

export function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    // IE specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData('Text', text);
  }
  if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand('copy'); // Security exception may be thrown by some browsers.
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.warn('Copy to clipboard failed.', ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
  return false;
}

export function addSignCfx(inputNum) {
  let outNum;
  if (inputNum > 0) {
    outNum = `+ ${inputNum} FC`;
  } else if (inputNum < 0) {
    outNum = `- ${Math.abs(inputNum)} FC`;
  } else {
    outNum = '0 FC';
  }
  return outNum;
}

export function timeSince(date) {
  let seconds;
  if (date instanceof Date) {
    seconds = Math.floor((new Date() - date) / 1000);
  } else {
    seconds = Math.floor((new Date() - new Date(date)) / 1000);
  }
  if (!Number.isInteger(seconds)) return '';

  let interval = Math.floor(seconds / 31536000);
  if (interval === 1) {
    return `${interval} ${i18nTxt('year ago')}`;
  }
  if (interval > 1) {
    return `${interval} ${i18nTxt('years ago')}`;
  }

  interval = Math.floor(seconds / 2592000);
  if (interval === 1) {
    return `${interval} ${i18nTxt('month ago')}`;
  }
  if (interval > 1) {
    return `${interval} ${i18nTxt('months ago')}`;
  }

  interval = Math.floor(seconds / 86400);
  if (interval === 1) {
    return `${interval} ${i18nTxt('day ago')}`;
  }
  if (interval > 1) {
    return `${interval} ${i18nTxt('days ago')}`;
  }

  interval = Math.floor(seconds / 3600);
  if (interval === 1) {
    return `${interval} ${i18nTxt('hour ago')}`;
  }
  if (interval > 1) {
    return `${interval} ${i18nTxt('hours ago')}`;
  }

  // return 'Within an hour.';

  interval = Math.floor(seconds / 60);
  if (interval === 1) {
    return `${interval} ${i18nTxt('minute ago')}`;
  }
  if (interval > 1) {
    return `${interval} ${i18nTxt('minutes ago')}`;
  }

  return i18nTxt('Just now');
  // return Math.floor(seconds) + ' seconds';
}

export function checkFileSize(size) {
  if (size > 50 * 1024 * 1024) {
    notice.show({
      type: 'message-error-light',
      content: i18nTxt('file shold not larger than 50M'),
      timeout: 3000,
    });
    return false;
  }
  return true;
}

const sanitizeHtml = require('sanitize-html');

const cssSize = [/^\d+(?:px|em|%)$/];
const allowStyles = {
  // Match HEX and RGB
  color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
  'text-align': [/^left$/, /^right$/, /^center$/],
  // Match any number with px, em, or %
  'font-size': cssSize,
  margin: cssSize,
  padding: cssSize,
  width: cssSize,
  height: cssSize,
};
const sanitizeCfg = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
  allowedAttributes: {
    div: ['style'],
    img: ['style', 'src'],
    a: ['href', 'target'],
  },
  allowedStyles: {
    div: allowStyles,
    img: allowStyles,
  },
};

export function htmlsafe(s) {
  return sanitizeHtml(s, sanitizeCfg);
}

export function isImgLike(str) {
  return str.match(/(\.jpeg|\.jpg|\.png|\.gif)$/i);
}

export function downLink(url, title) {
  let target = '';
  if (url && isImgLike(url)) {
    target = '_blank';
    return (
      <span>
        <img
          alt={title}
          src={url}
          style={{
            maxWidth: '100%',
            marginTop: 10,
          }}
        />
        <br />
        <a href={url} download target={target}>
          {title}
        </a>
      </span>
    );
  }
  return (
    <a href={url} download target={target}>
      {title}
    </a>
  );
}

export function showLink(url, title, list) {
  let currentItem;
  const urlList = list.filter(v => url && isImgLike(v.url)).map(v => v.url);
  if (url && isImgLike(url)) {
    const showViewer = (urls, i) => {
      viewer({
        urls,
        index: i,
        onClose: () => {
          currentItem.blur();
        },
      });
    };
    const index = urlList.findIndex(l => l === url);
    return (
      <span
        role="button"
        tabIndex="0"
        ref={ref => {
          currentItem = ref;
        }}
        onClick={() => showViewer(urlList, index)}
        onKeyDown={() => showViewer(urlList, index)}
      >
        <img
          alt={title}
          src={url}
          style={{
            width: '100%',
          }}
        />
        <br />
        <span
          style={{
            textDecoration: 'underline',
            fontSize: `${unitParser(16)}`,
            wordBreak: 'break-word',
          }}
        >
          {title}
        </span>
      </span>
    );
  }
  return (
    <span>
      <i
        className="icon-attachment-file-icon"
        style={{
          display: 'inline-block',
          width: `${unitParser(46)}`,
          height: `${unitParser(46)}`,
          backgroundColor: '#22B2D6',
          borderRadius: '4px',
          textAlign: 'center',
          lineHeight: `${unitParser(46)}`,
          color: '#fff',
          fontSize: `${unitParser(24)}`,
          verticalAlign: 'middle',
          marginRight: '8px',
        }}
      ></i>
      <a
        href={url}
        style={{
          verticalAlign: 'middle',
          fontSize: `${unitParser(16)}`,
        }}
      >
        {title}
      </a>
    </span>
  );
}

export function resizeTextArea() {
  document.querySelectorAll('.materialize-textarea ').forEach(elem => {
    M.textareaAutoResize(elem);
  });
}

const loadImg = imgSrc => {
  return new Promise((resolve, reject) => {
    const imgTmp = new Image();
    imgTmp.onload = () => {
      resolve();
    };
    imgTmp.onerror = () => {
      reject();
    };
    imgTmp.src = imgSrc;
  });
};

const wait = time => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time || 1000);
  });
};

export const fetchPic = imgSrc => {
  dispatch({
    type: 'PAGE_LOADING+',
    payload: {},
  });
  return wait(1000)
    .then(() => loadImg(imgSrc))
    .catch(() => {
      return wait(1000).then(() => loadImg(imgSrc));
    })
    .catch(() => {
      return wait(1000).then(() => loadImg(imgSrc));
    })
    .catch(() => {})
    .then(() => {
      dispatch({
        type: 'PAGE_LOADING-',
        payload: {},
      });
    });
};

export const getRecaptchaErr = (errCodes = []) => {
  const reContains = a => {
    return errCodes.indexOf(a) !== -1;
  };
  let noticeMsg = '';
  if (reContains('missing-input-secret') || reContains('invalid-input-secret')) {
    noticeMsg = i18nTxt('invalid recaptcha secret');
  } else if (reContains('missing-input-response') || reContains('invalid-input-response')) {
    noticeMsg = i18nTxt('invalid recaptcha secret');
  } else if (reContains('timeout-or-duplicate')) {
    noticeMsg = i18nTxt('recaptcha check timeout, please reload page');
  } else if (reContains('bad-request')) {
    noticeMsg = i18nTxt('invalid recaptcha request');
  } else {
    noticeMsg = errCodes.join(',');
  }
  return noticeMsg;
};
