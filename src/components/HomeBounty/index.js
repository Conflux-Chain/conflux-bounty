import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';
import logo from '../../assets/iconfont/bounty-logo.svg';
import add from '../../assets/iconfont/bounty-add.svg';
import team from '../../assets/iconfont/bounty-team.svg';
import teamOpen from '../../assets/iconfont/bounty-team-open.svg';
import BountyStatus from '../BountyStatus';
import { toThousands, i18nTxt } from '../../utils';

const Container = styled.div`
  width: 373px;
  height: 200px;
  margin: 0 20px;
  padding: 16px;
  padding-bottom: 0px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  cursor: pointer;
  &.wrap-open {
    background: linear-gradient(118.2deg, #ffe501 0%, #fac801 100%);
    transition: box-shadow 0.3s ease-in;
    -webkit-transition: box-shadow 0.3s;
    &:hover {
      box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.2);
    }
  }
  &.wrap-ongoing {
    background: linear-gradient(118.2deg, #8d39f8 0%, #ff6610 100%);
    transition: box-shadow 0.3s ease-in;
    -webkit-transition: box-shadow 0.3s;
    &:hover {
      box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.2);
    }
  }
  &.wrap-finished {
    background: linear-gradient(118.2deg, #1acb96 0%, #1080bf 100%);
    transition: box-shadow 0.3s ease-in;
    -webkit-transition: box-shadow 0.3s;
    &:hover {
      box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.2);
    }
  }

  &.wrap-create {
    background: #ffffff;
    border: 1px dashed #8e9394;
    box-sizing: border-box;
    font-weight: 500;
    font-size: 20px;
    line-height: 20px;
    color: #22b2d6;
    .bounty-create {
      margin-right: 12px;
    }
    &:hover {
      box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.2);
      border: none;
      transition: all 0.5s ease-in;
    }
  }
  position: relative;
  .bounty-logo {
    position: absolute;
    right: 0;
    top: 40px;
    opacity: 0.5;
    &.open {
      opacity: 1;
    }
  }
  .bounty-content {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: flex-start;
    color: #fff;
    z-index: 10;
    &.open {
      color: #171d1f;
    }
    .bounty-title {
      font-weight: 700;
      font-size: 24px;
      line-height: 28px;
      word-wrap: break-word;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      display: -webkit-box;
      text-align: left;
      max-width: 341px;
      height: 56px;
      margin-bottom: 20px;
    }
    .bounty-creator {
      font-size: 16px;
      line-height: 16px;
      opacity: 0.8;
    }
    .bounty-detail {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: baseline;
      margin: 16px 0;
      .bounty-coin {
        display: flex;
        align-items: center;
      }
      .bounty-coin-num {
        font-size: 24px;
        line-height: 24px;
        font-weight: 800;
        font-size: 24px;
        line-height: 24px;
        &.open {
          color: #f0453a;
        }
      }
      .bounty-upto {
        font-size: 16px;
        line-height: 16px;
        margin-right: 4px;
      }
      .bounty-user {
        font-size: 16px;
        line-height: 16px;
        display: flex;
        align-items: flex-end;
        > img {
          margin-right: 4px;
        }
        > span {
          font-size: 16px;
          line-height: 16px;
        }
      }
    }
  }
`;

function HomeBounty(props) {
  const { type, title, fansCoin, user, id, onClick, count, status } = props;

  if (type === 'create') {
    return (
      <Container className="wrap-create" onClick={onClick}>
        <img src={add} className="bounty-create" alt="add" />
        {i18nTxt('Create New Bounty')}
      </Container>
    );
  }

  return (
    <Container className={`wrap-${type}`} onClick={() => onClick(id)}>
      <img src={logo} className={classnames('bounty-logo', { open: type === 'open' })} alt="logo" />
      <div className={classnames('bounty-content', { open: type === 'open' })}>
        <span className="bounty-title">{title}</span>
        <span className="bounty-creator">
          {i18nTxt('home.from')}&nbsp;{user}
        </span>

        <span className="bounty-detail">
          <span className="bounty-coin">
            <span className="bounty-upto">{i18nTxt('Up to')}</span>
            <span className={classnames('bounty-coin-num', { open: type === 'open' })}>
              <span>{toThousands(fansCoin)}</span>
              FC
            </span>
          </span>
          <span className="bounty-user">
            <img src={type === 'open' ? teamOpen : team} alt="team" />
            <span>{`${count} ${i18nTxt('Participants')}`}</span>
          </span>
        </span>
        <BountyStatus status={status} />
      </div>
    </Container>
  );
}

HomeBounty.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  title: PropTypes.string.isRequired,
  fansCoin: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

HomeBounty.defaultProps = {
  type: 'open', // open,ongoing,finished,create
};

export default HomeBounty;
