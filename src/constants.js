export const UPDATE_COMMON = 'UPDATE_COMMON';
export const UPDATE_HOME = 'UPDATE_HOME';
export const UPDATE_HEAD = 'UPDATE_HEAD';
export const UPDATE_BOUNTY_CACHE = 'UPDATE_BOUNTY_CACHE';
export const UPDATE_SOLUTION_LIST_CACHE = 'UPDATE_SOLUTION_LIST_CACHE';
export const UPDATE_UNREAD_MESSAGE_COUNT = 'UPDATE_UNREAD_MESSAGE_COUNT';

export const ERR_MSG = {
  INVALID: 'Invalid message',
  POSITIVE_NUMBER: 'Message shoule be positive number',
  NOT_BLANK: 'Message should not be blank',
  AGREE_LICENCE: 'Please check agreement',
  NO_LARGE_THAN_90: 'Duration should not > 90',
  NO_LARGE_THAN_200: 'Content length shoule not > 200',
};

export const REGEX = {
  CHECK_BLANK: /^\s+$/,
  CHECK_NUMBER: /^\d+$/,
  CHECK_FLOAT: /^\d+\.?\d*$/,
  /* eslint no-useless-escape: 0 */
  EMAIL: /^[a-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+(?:\.[a-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?$/i,
  EMAIL_CODE: /[\da-zA-z]{5}/,
  PASSWORD: /^[\w\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\|\;\:\'\"\,\<\.\>\/\?]+$/,
};

export const ALI_OSS_KEYS = {
  AccessKeyId: 'LTAIf1is0L1Eil4F',
  AccessKeySecret: 'Ac7mB405j33q2JaNotxbe6Kbra76r1',
  bucket: 'conflux-bucket-test',
  region: 'oss-cn-beijing',
  downBucket: 'conflux-bounty-readonly-test',
  attachmentGetHost: 'https://conflux-bounty-readonly-test.oss-cn-beijing.aliyuncs.com',
  ...process.env.ALI_OSS_KEYS,
};

const { bountyEnum } = process.env;
export const { ACCOUNT_STATUS_ENUM } = bountyEnum;
export const { BOUNTY_STATUS_ENUM } = bountyEnum;
export const { SOLUTION_STATUS_ENUM } = bountyEnum;
export const { MILESTONE_STATUS_ENUM } = bountyEnum;
export const { REWARD_STATUS_ENUM } = bountyEnum;
export const { WITHDRAWAL_STATUS_ENUM } = bountyEnum;

export const recaptchaKey = '6LcGDroUAAAAAIDuTI9RpZNIuCi-QpSEKCdq_I4i';

const fileAccept = [
  'txt',
  'doc',
  'docx',
  'hlp',
  'wps',
  'rtf',
  'pdf',
  'xlsx',
  'xls',
  'ppt',
  'pptx',
  'rar',
  'zip',
  'arj',
  'z',
  'bmp',
  'tif',
  'psd',
  'raw',
];

let fileAccepts = 'image/*,';
fileAccept.forEach((v, i) => {
  fileAccepts += `.${v},.${v.toUpperCase()}`;
  if (i !== fileAccept.length - 1) {
    fileAccepts += ',';
  }
});

if (typeof window.orientation !== 'undefined') {
  fileAccepts = 'image/*';
}

export const fileAcceptStr = fileAccepts;
