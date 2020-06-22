/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { Switch } from 'react-router-dom';
import { EmptyLayout, LayoutRoute } from './components/Layout';
import AuthPage from './pages/AuthPage';
import { STATE_LOGIN, STATE_SIGNUP } from './components/AuthForm';
import RegistrationForm from './views/registration/RegistrationForm';
import { Redirect } from 'react-router';

export default class NonAuthRoutes extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Switch>
        <LayoutRoute
          exact
          path="/login"
          layout={EmptyLayout}
          component={props => (
            <AuthPage {...props} authState={STATE_LOGIN}/>
          )}
        />
        <LayoutRoute
          exact
          path="/registration"
          layout={EmptyLayout}
          component={props => (
            <RegistrationForm {...props} authState={STATE_SIGNUP}/>
          )}
        />
        <Redirect to={'/login'}/>
      </Switch>
    );
  }
}