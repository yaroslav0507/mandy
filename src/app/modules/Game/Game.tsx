import React, { FC } from 'react';
import { Grid }      from '@material-ui/core';
import { Board }     from './Board/Board';

export const Game: FC = () => {
  return (
    <Grid
      container
      spacing={ 4 }
    >
      <Board/>

      <Grid
        item
        xs
      >
        <Grid
          container
          spacing={ 4 }
        >
          <Grid
            item
            md={ 12 }
          >
            Selected

            {/*{ selectedChip ? (*/ }
            {/*  <>*/ }
            {/*    <div>*/ }
            {/*      x: { selectedChip.x }*/ }
            {/*    </div>*/ }
            {/*    <div>*/ }
            {/*      y: { selectedChip.y }*/ }
            {/*    </div>*/ }
            {/*  </>*/ }
            {/*) : null }*/ }
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
