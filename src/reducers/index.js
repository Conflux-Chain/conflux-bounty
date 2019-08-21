import { combineReducers } from 'redux';
import common from './common';
import home from '../pages/Home/reducer';
import loading from '../components/PageLoading/reducer';
import share from '../components/Share/reducer';
import bounty from '../pages/Bounty/reducer';
import solution from '../pages/Solution/reducer';
import head from '../components/PageHead/reducer';
import userInfo from '../pages/UserInfo/reducer';

export default combineReducers({
  common,
  home,
  bounty,
  solution,
  head,
  userInfo,
  frameworks: combineReducers({
    share,
    loading,
  }),
});
