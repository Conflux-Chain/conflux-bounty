import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { notice, auth, i18nTxt } from '../../utils';

const PrivateRoute = ({ component: Component, render, ...rest }) => {
  const isLoggedIn = auth.loggedIn();
  if (!isLoggedIn) notice.show({ content: i18nTxt('Token expired. Please login again.'), type: 'message-important-light', timeout: 3000 });
  return (
    <Route
      {...rest}
      render={props => {
        if (!isLoggedIn) {
          return (
            <Redirect
              to={{
                pathname: '/signin',
                state: { from: props.location },
              }}
            />
          );
        }
        if (render) {
          return render(props);
        }
        return <Component {...props} />;
      }}
    />
  );
};

PrivateRoute.propTypes = {
  location: PropTypes.string.isRequired,
  component: PropTypes.func.isRequired,
  render: PropTypes.func,
};
PrivateRoute.defaultProps = {
  render: undefined,
};

export default PrivateRoute;
