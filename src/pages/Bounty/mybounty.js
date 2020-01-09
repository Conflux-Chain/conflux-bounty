import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { useEffectOnce } from 'react-use';
import { useMobile } from '../../utils/device';
import * as actions from './action';
import * as s from './commonStyle';
import BackHeadDiv from '../../components/BackHeadDiv';
import { BOUNTY_STATUS_ENUM } from '../../constants';
import * as s2 from '../UserInfo/commonStyle';
import { fmtToDay, getStatus, auth, commonPropTypes, i18nTxt } from '../../utils';
import BountyDeletedWarning from '../../components/BountyDeletedWarning';
import NoResult from '../../components/NoResult';
// import * as s2 from './commonStyle';

function MyBounty({ getMyBounty, getMyJoinedBounty, myBounty, history, resetMy, updateMy }) {
  useEffectOnce(() => {
    if (!auth.loggedIn()) {
      history.push('/signin');
      return;
    }

    const getdata = async () => {
      await getMyBounty(1);
      await getMyJoinedBounty(1);
      updateMy({
        initFetched: true,
      });
    };

    const { initFetched } = myBounty;
    if (history.action === 'PUSH') {
      resetMy();
      getdata();
    } else if (!initFetched) {
      getdata();
    }
    document.title = i18nTxt('My Bounties');
  });

  const isMobile = useMobile();

  // FIXME: duplicates
  return (
    <React.Fragment>
      <BackHeadDiv onClick={() => history.push('/user-info')}>
        <Link to="/user-info">{i18nTxt('My Account')}</Link>
      </BackHeadDiv>
      <s.MyBounSolunDiv>
        <h1>{i18nTxt('My Bounties')}</h1>

        <s2.TabDiv>
          <div className="tab-s">
            <button
              onClick={() => {
                updateMy({
                  activeTab: 'created',
                });
              }}
              type="button"
              className={cx('tab-item', {
                'tab-item-active': myBounty.activeTab === 'created',
              })}
            >
              {i18nTxt('My.Created Bounty')}
            </button>
            <button
              onClick={() => {
                updateMy({
                  activeTab: 'joined',
                });
              }}
              type="button"
              className={cx('tab-item', {
                'tab-item-active': myBounty.activeTab === 'joined',
              })}
            >
              {i18nTxt('My.Involved Bounty')}
            </button>
          </div>
        </s2.TabDiv>

        <div
          style={{
            display: myBounty.activeTab === 'created' ? 'block' : 'none',
          }}
        >
          <div className="my-bounty-list">
            {myBounty.list.map(v => {
              let rejectTips;
              let rejectColor = {};
              if (v.status === BOUNTY_STATUS_ENUM.PENDING) {
                rejectTips = (
                  <div className="reject-tips">
                    <span>
                      <i className="material-icons dp48">info</i>
                      <span className="reject-content">{v.redoMessage}</span>
                    </span>
                    <Link to={`/edit-bounty?bountyId=${v.id}`}>
                      <span>{i18nTxt('EDIT BOUNTY')}</span>
                      <i className="material-icons dp48">chevron_right</i>
                    </Link>
                  </div>
                );
                rejectColor = {
                  color: '#E76A25',
                };
              }

              return (
                <div className="my-bounty-item clearfix">
                  <div className="item-head">
                    <h5>{v.title}</h5>
                    <Link
                      className={`item-link ${v.transDeleted ? 'disabled' : ''}`}
                      to={`/view-bounty?bountyId=${v.id}&language=${v.createdSiteLang}`}
                      onClick={e => {
                        if (v.transDeleted) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <span>{i18nTxt('VIEW MORE')}</span>
                      <i className="material-icons dp48">chevron_right</i>
                    </Link>
                  </div>
                  <div className="item-content">
                    <span className="item-gray">{fmtToDay(v.createdAt)}</span>
                    {!isMobile && <span className="item-gray">{i18nTxt('status')}:</span>}
                    <span className="item-status" style={rejectColor}>
                      {getStatus(v.status)}
                    </span>
                    {v.transDeleted && <BountyDeletedWarning />}
                  </div>
                  {rejectTips}
                </div>
              );
            })}
          </div>
          <div className="show-more">
            <button
              onClick={() => {
                if (myBounty.list.length < myBounty.total) {
                  const nextPage = myBounty.page + 1;
                  getMyBounty(nextPage);
                }
              }}
              style={{
                visibility: myBounty.total > myBounty.list.length ? 'visible' : 'hidden',
              }}
              className="btn waves-effect waves-light default"
              type="button"
            >
              {i18nTxt('SHOW MORE')}
            </button>
          </div>
          {myBounty.total === 0 && <NoResult marginTop={20} />}
        </div>

        <div
          style={{
            display: myBounty.activeTab === 'joined' ? 'block' : 'none',
          }}
        >
          <div className="my-bounty-list">
            {myBounty.joinedlist.map(v => {
              let rejectTips;
              let rejectColor = {};
              if (v.status === BOUNTY_STATUS_ENUM.PENDING) {
                rejectTips = (
                  <div className="reject-tips">
                    <span>
                      <i className="material-icons dp48">info</i>
                      <span className="reject-content">{v.redoMessage}</span>
                    </span>
                    <Link to={`/edit-bounty?bountyId=${v.id}`}>
                      <span>{i18nTxt('EDIT BOUNTY')}</span>
                      <i className="material-icons dp48">chevron_right</i>
                    </Link>
                  </div>
                );
                rejectColor = {
                  color: '#E76A25',
                };
              }

              return (
                <div className="my-bounty-item clearfix">
                  <div className="item-head">
                    <h5>{v.title}</h5>
                    <Link
                      onClick={e => {
                        if (v.transDeleted) {
                          e.preventDefault();
                        }
                      }}
                      className={`item-link ${v.transDeleted ? 'disabled' : ''}`}
                      to={`/view-bounty?bountyId=${v.id}&language=${v.createdSiteLang}`}
                    >
                      <span>{i18nTxt('VIEW MORE')}</span>
                      <i className="material-icons dp48">chevron_right</i>
                    </Link>
                  </div>
                  <div className="item-content">
                    <span className="item-gray">{fmtToDay(v.createdAt)}</span>
                    {!isMobile && <span className="item-gray">{i18nTxt('status')}:</span>}
                    <span className="item-status" style={rejectColor}>
                      {getStatus(v.status)}
                    </span>
                    {v.transDeleted && <BountyDeletedWarning />}
                  </div>
                  {rejectTips}
                </div>
              );
            })}
          </div>
          <div className="show-more">
            <button
              onClick={() => {
                if (myBounty.joinedlist.length < myBounty.joinedTotal) {
                  const nextPage = myBounty.joinedPage + 1;
                  getMyJoinedBounty(nextPage);
                }
              }}
              style={{
                visibility: myBounty.joinedTotal > myBounty.joinedlist.length ? 'visible' : 'hidden',
              }}
              className="btn waves-effect waves-light default"
              type="button"
            >
              {i18nTxt('SHOW MORE')}
            </button>
          </div>
        </div>
      </s.MyBounSolunDiv>
    </React.Fragment>
  );
}

MyBounty.propTypes = {
  myBounty: PropTypes.objectOf({
    total: PropTypes.number,
  }).isRequired,
  updateMy: PropTypes.func.isRequired,
  getMyBounty: PropTypes.func.isRequired,
  history: commonPropTypes.history.isRequired,
  resetMy: PropTypes.func.isRequired,
  getMyJoinedBounty: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { myBounty } = state.bounty;
  return {
    myBounty,
  };
}

export default connect(
  mapStateToProps,
  actions
)(MyBounty);
