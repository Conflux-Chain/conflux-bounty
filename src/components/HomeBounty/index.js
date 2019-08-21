import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';
import logo from '../../assets/iconfont/bounty-logo.svg';
import ongoing from '../../assets/iconfont/bounty-ongoing.svg';
import finished from '../../assets/iconfont/bounty-finished.svg';
import add from '../../assets/iconfont/bounty-add.svg';
import { toThousands, i18nTxt } from '../../utils';

const Container = styled.div`
  width: 373px;
  height: 200px;
  margin: 0 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
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
    left: 100px;
    top: 30px;
    opacity: 0.5;
    &.open {
      opacity: 1;
    }
  }
  .bounty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    z-index: 10;
    padding: 0 20px;
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
      text-align: center;
      max-width: 343px;
    }
    .bounty-coin {
      font-weight: normal;
      font-size: 20px;
      line-height: 24px;
      margin: 8px 0;
      font-variant: small-caps;
      .bounty-value {
        font-style: italic;
        font-weight: 800;
        font-size: 24px;
        line-height: 24px;
        &.open {
          color: #f0453a;
        }
      }
    }
    .bounty-user {
      font-size: 16px;
      line-height: 16px;
      .bounty-username {
        font-weight: 700;
      }
    }
  }
  .bounty-button {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    height: 40px;
    color: #fff;
    right: 0;
    bottom: 0;
    border-top-left-radius: 4px;
    border-bottom-right-radius: 12px;
    &.open {
      background: linear-gradient(113.05deg, #69c4db -4.72%, #5499dd 100%);
    }
    &.ongoing {
      background: linear-gradient(123.38deg, #69c4db 3.07%, #5499dd 100%);
    }
    &.finished {
      background: linear-gradient(123.02deg, #69c4db 0.83%, #5499dd 100%);
    }
    .button-icon {
      margin-right: 8px;
    }
  }
`;

function HomeBounty(props) {
  const { type, title, fansCoin, user, id, onClick } = props;

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
        <span className="bounty-coin">
          {type === 'open' && i18nTxt('UP TO ')}
          <span className={classnames('bounty-value', { open: type === 'open' })}>{toThousands(fansCoin)}</span>
          {' FC'}
        </span>
        <span className="bounty-user">
          {i18nTxt('home.from')}&nbsp;
          <span className="bounty-username">{user}</span>
        </span>
      </div>
      {type === 'open' && <div className="bounty-button open">{i18nTxt('CLAIM IT')}</div>}
      {type === 'ongoing' && (
        <div className="bounty-button ongoing">
          <img src={ongoing} className="button-icon" alt="ongoing" />
          {i18nTxt('VIEW PROGRESS')}
        </div>
      )}
      {type === 'finished' && (
        <div className="bounty-button finished">
          <img src={finished} className="button-icon" alt="finished" />
          {i18nTxt('SEE RESULTS')}
        </div>
      )}
    </Container>
  );
}

HomeBounty.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  title: PropTypes.string.isRequired,
  fansCoin: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

HomeBounty.defaultProps = {
  type: 'open', // open,ongoing,finished,create
};

export default HomeBounty;
