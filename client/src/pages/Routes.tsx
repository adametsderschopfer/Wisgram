import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthChoose from './AuthChoose/AuthChoose';
import { IRootState } from '../Redux/types';

function Routes() {
  const isAuth = useSelector<IRootState>(({ auth: { isAuth } }) => isAuth);

  if (!isAuth) {
    return (
      <Switch>
        <Route path="/" exec component={AuthChoose} />
        <Route path="/sigup" exec component={AuthChoose} />
        <Route path="/sinin" exec component={AuthChoose} />
        <Route path="/resetpassword" exec component={AuthChoose} />
        <Route path="/resetpassword/validatecode" exec component={AuthChoose} />
        <Route
          path="/resetpassword/chagepassword"
          exec
          component={AuthChoose}
        />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" exec />
    </Switch>
  );
}

export default Routes;
