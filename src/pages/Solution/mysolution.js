import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import * as actions from './action';
import * as s from '../Bounty/commonStyle';
import BackHeadDiv from '../../components/BackHeadDiv';
import { SOLUTION_STATUS_ENUM } from '../../constants';
import { fmtToDay, getStatus, auth, commonPropTypes, i18nTxt } from '../../utils';
import BountyDeletedWarning from '../../components/BountyDeletedWarning';

const MyBounSolunDiv = styled(s.MyBounSolunDiv)`
  .update-progress {
    float: right;
    margin-top: 5px;
  }
  .step-progress-info {
    text-align: center;
    margin-top: 6px;
    > span {
      font-size: 14px;
      line-height: 14px;
      color: #8e9394;
      margin-right: 8px;
    }
    .step {
      color: #8e9394;
    }
    .step-status {
      color: #8e9394;
    }
  }
`;
class MySolution extends Component {
  constructor(...args) {
    super(...args);
    const { getmySolution, mySolution, resetMy, history } = this.props;
    if (!auth.loggedIn()) {
      history.push('/signin');
      return;
    }

    const getdata = () => {
      getmySolution(1);
    };
    if (history.action === 'PUSH') {
      resetMy();
      getdata();
    } else if (mySolution.total === 0) {
      getdata();
    }
  }

  render() {
    const { mySolution, getmySolution, history } = this.props;
    return (
      <React.Fragment>
        <BackHeadDiv onClick={() => history.push('/user-info')}>
          <Link to="/user-info">{i18nTxt('My Account')}</Link>
        </BackHeadDiv>
        <MyBounSolunDiv>
          <h1>{i18nTxt('My Submissions')}</h1>
          <div className="my-bounty-list">
            {mySolution.list.map(v => {
              let rejectTips;
              let rejectColor = {};
              if (v.status === SOLUTION_STATUS_ENUM.PENDING) {
                rejectTips = (
                  <div className="reject-tips">
                    <i className="material-icons dp48">info</i>
                    <span className="reject-content">{v.redoMessage}</span>
                    <Link to={`/edit-submission?submissionId=${v.id}`}>
                      <span>{i18nTxt('EDIT SUBMISSION')}</span>
                      <i className="material-icons dp48">chevron_right</i>
                    </Link>
                  </div>
                );
                rejectColor = {
                  color: '#E76A25',
                };
              }

              let updateDiv;
              if (v.status === SOLUTION_STATUS_ENUM.ONGOING) {
                updateDiv = (
                  <div className="clearfix">
                    <div className="update-progress">
                      <Link
                        style={{
                          opacity: v.transDeleted ? '0.6' : 1,
                        }}
                        onClick={e => {
                          if (v.transDeleted) {
                            e.preventDefault();
                          }
                        }}
                        to={`/update-progress?submissionId=${v.id}`}
                        className="btn waves-effect waves-light default"
                        type="button"
                      >
                        {i18nTxt('Update Progress')}
                      </Link>
                      <div className="step-progress-info">
                        <span className="step">
                          {i18nTxt('Step')} {v.finishedMilestoneNumber}/{v.totalMilestoneNumber}:
                        </span>
                        <span className="step-status">{i18nTxt('mysolution.Approved')}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div className="my-bounty-item clearfix">
                  <div className="item-head">
                    <h5>{v.title}</h5>
                    <Link
                      className={`item-link ${v.transDeleted ? 'disabled' : ''}`}
                      to={`/view-submission?submissionId=${v.id}&from=mysubmission&language=${v.createdSiteLang}`}
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
                  <div>
                    <span className="item-gray">{fmtToDay(v.updatedAt || v.createdAt)}</span>
                    <span className="item-gray">{i18nTxt('Submission')}:</span>
                    <span className="item-status" style={rejectColor}>
                      {getStatus(v.status)}
                    </span>
                    {v.transDeleted && <BountyDeletedWarning />}
                  </div>
                  {updateDiv}
                  {rejectTips}
                </div>
              );
            })}
          </div>
          <div className="show-more">
            <button
              onClick={() => {
                if (mySolution.list.length < mySolution.total) {
                  const nextPage = mySolution.page + 1;
                  getmySolution(nextPage);
                }
              }}
              className="btn waves-effect waves-light default"
              type="button"
              style={{
                visibility: mySolution.total > mySolution.list.length ? 'visible' : 'hidden',
              }}
            >
              {i18nTxt('SHOW MORE')}
            </button>
          </div>
        </MyBounSolunDiv>
      </React.Fragment>
    );
  }
}

MySolution.propTypes = {
  history: commonPropTypes.history.isRequired,
  getmySolution: PropTypes.func.isRequired,
  mySolution: PropTypes.objectOf({
    total: PropTypes.number,
  }).isRequired,
  // updateMy: PropTypes.func.isRequired,
  resetMy: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { mySolution } = state.solution;
  return {
    mySolution,
  };
}

export default connect(
  mapStateToProps,
  actions
)(MySolution);
