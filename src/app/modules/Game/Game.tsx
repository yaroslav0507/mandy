import React, { FC }     from 'react';
import { Board }         from './Board/Board';
import { GridContainer } from '../../shared/components/layout';

export const Game: FC = () => {
  return (
    <GridContainer spacing={ 4 }>
      <Board/>
    </GridContainer>
  );
};
