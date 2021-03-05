import React, { FC }               from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { NotFound }                from '../shared/components/NotFound';
import { EAppModule }              from '../shared/constants';
import { Game }                    from '../modules/Game/Game';
import { Settings }                from '../modules/Settings/Settings';

export const Routes: FC = () => (
  <Switch>
    <Route
      exact
      path="/"
      render={ () => <Redirect to={ `/${ EAppModule.Game }/all/` }/> }
    />

    <Route
      exact
      path={ `/${ EAppModule.Game }` }
      render={ () => <Redirect to={ `/${ EAppModule.Game }/ai` }/> }
    />

    <Route
      path={ `/${ EAppModule.Game }/:page` }
      component={ Game }
    />

    <Route
      exact
      path={ `/${ EAppModule.Settings }` }
      component={ Settings }
    />

    <Route
      path="*"
      component={ NotFound }
    />
  </Switch>
);
