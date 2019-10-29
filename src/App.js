import React, { PureComponent } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

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
import MaterialHook from './components/MaterialHook';
import PageHead from './components/PageHead';
import PageFoot from './components/PageFoot';
import Share from './components/Share';
import media from './globalStyles/media';

const PageWrapper = styled.div`
  background-color: #f7f9fa;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  .page-holder {
    min-width: auto;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    ${media.mobile`
      min-width: 100%;
    `}
  }
  .page-content {
    flex: 1;
  }
  ${media.mobile`
    .page-holder {
      min-width: 100%;
    }
  `}
`;
class App extends PureComponent {
  render() {
    return (
      <BrowserRouter>
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
    );
  }
}

function mapStateToProps(state) {
  return {
    lang: state.head.user.language,
  };
}
export default connect(mapStateToProps)(App);
