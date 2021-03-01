import React, { FC }               from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { NotFound }                from '../shared/components/NotFound';
import { EAppModule } from '../shared/constants';
import { GamePage }   from '../modules/Game/components/GamePage/GamePage';

export const Routes: FC = () => (
  <Switch>
    <Route
      exact
      path="/"
      render={() => <Redirect to={`/${EAppModule.Game}/all/`}/>}
    />
  
    <Route
      exact
      path={`/${EAppModule.Game}`}
      render={() => <Redirect to={`/${EAppModule.Game}/ai`}/>}
    />
  
    <Route
      path={`/${EAppModule.Game}/:page`}
      component={GamePage}
    />
    
    <Route path="*" component={NotFound}/>
  </Switch>
);
