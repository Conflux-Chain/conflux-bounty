import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import template from 'lodash/template';

/* eslint react/prop-types: 0 */
/* eslint react/no-multi-comp: 0 */
class I18nComp extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      fmtStr: '',
    };
    const fmtMessageStr = this.updateFmtMsg();
    if (typeof fmtMessageStr === 'string') {
      this.state.fmtStr = fmtMessageStr;
    }
  }

  componentDidUpdate() {
    this.updateFmtMsg();
  }

  updateFmtMsg = () => {
    const { id, intl } = this.props;
    const fmtMessageStr = intl.formatMessage({
      id,
    });
    if (fmtMessageStr && fmtMessageStr.then) {
      fmtMessageStr.then(content => {
        this.setState({
          fmtStr: content.default,
        });
      });
    } else {
      this.setState({
        fmtStr: fmtMessageStr,
      });
    }
    return fmtMessageStr;
  };

  render() {
    const { fmtStr } = this.state;
    return <span dangerouslySetInnerHTML={{ __html: fmtStr }}></span>;
  }
}
const I18nComp1 = injectIntl(I18nComp);

export function i18n(id) {
  return <I18nComp1 id={id} />;
}

let intlTemp;
class I18nTextComp extends PureComponent {
  constructor(...args) {
    super(...args);
    this.saveIntl = () => {
      const { intl } = this.props;
      intlTemp = intl;
    };
    this.saveIntl();
  }

  render() {
    this.saveIntl();
    return null;
  }
}
export const I18nText = injectIntl(I18nTextComp);
export function i18nTxt(id, param) {
  if (id === null || typeof id === 'undefined' || id === '') {
    return '';
  }
  const txt = intlTemp.formatMessage({
    id,
  });
  if (param) {
    return template(txt)(param);
  }
  return txt;
}
