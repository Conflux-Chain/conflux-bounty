import React, { useEffect } from 'react';
import { enquire } from 'enquire-js';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { UPDATE_ISMOBILE } from '../../constants';

function IsMobileComp(props) {
  /**
   * 注册监听屏幕的变化，可根据不同分辨率做对应的处理
   */
  const { children } = props;

  function enquireScreenHandle(type) {
    const handler = {
      match: () => {
        props.dispatch({
          type: UPDATE_ISMOBILE,
          payload: {
            isMobile: type !== 'isDesktop',
          },
        });
      },
    };

    return handler;
  }

  function enquireScreenRegister() {
    const isMobile = 'screen and (max-width: 720px)';
    const isTablet = 'screen and (min-width: 721px) and (max-width: 1199px)';
    const isDesktop = 'screen and (min-width: 1200px)';

    enquire.register(isMobile, enquireScreenHandle('isMobile'));
    enquire.register(isTablet, enquireScreenHandle('isTablet'));
    enquire.register(isDesktop, enquireScreenHandle('isDesktop'));
  }

  useEffect(() => {
    enquireScreenRegister();
  }, []);

  return <div>{children}</div>;
}
IsMobileComp.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired,
};

export default connect()(IsMobileComp);
