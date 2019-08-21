import React, { PureComponent } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';

// components
import Router from './route/router';
import { ToastComp } from './components/Toast';
import { NoticeComp } from './components/Message/notice';
import { PageLoading } from './components/PageLoading';

// styles
import './globalStyles/material-design.scss';
import './assets/material-icons/material-icons.css';
import './globalStyles/icons.less';
import './globalStyles/base.less';
import './globalStyles/helper.less';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// import * as utils from './utils';
import { I18nText } from './utils';

import zhTranslationMessages from './lang/zh';
import enTranslationMessages from './lang/en';
import MaterialHook from './components/MaterialHook';
import PageHead from './components/PageHead';
import PageFoot from './components/PageFoot';
import Share from './components/Share';

addLocaleData([...enLocaleData, ...zhLocaleData]);

const messages = {
  en: enTranslationMessages,
  'zh-CN': zhTranslationMessages,
};
const PageWrapper = styled.div`
  background-color: #f7f9fa;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow: auto;
  .page-holder {
    min-width: 600px;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .page-content {
    flex: 1;
  }
`;
class App extends PureComponent {
  render() {
    const { lang } = this.props;

    return (
      <IntlProvider locale={lang} messages={messages[lang]}>
        <BrowserRouter>
          <I18nText />
          <PageWrapper id="page-wrapper">
            <div className="page-holder">
              <PageHead />
              <div className="page-content">
                <Router />
              </div>
              <PageFoot />
            </div>
          </PageWrapper>
          <ToastComp />
          <NoticeComp />
          <PageLoading />
          <MaterialHook />
          <Share />
        </BrowserRouter>
      </IntlProvider>
    );
  }
}

App.propTypes = {
  lang: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    lang: state.head.user.language || state.common.lang,
  };
}
export default connect(mapStateToProps)(App);
