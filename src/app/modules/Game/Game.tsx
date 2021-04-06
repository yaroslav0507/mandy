import React, { FC }         from 'react';
import { Grid }              from '@material-ui/core';
import { Board }             from './Board/Board';
import { useAppSelector }    from '../../hooks';
import {
  selectActiveChips,
  selectOccupied,
  selectCurrentChip,
  selectHighlighted,
}                            from './Board/boardReducer';
import { selectDicesResult } from './Dices/dicesReducer';

export const Game: FC = () => {
  const chips = useAppSelector(selectActiveChips);
  const selected = useAppSelector(selectCurrentChip);
  const boardState = useAppSelector(selectOccupied);
  const dicesResult = useAppSelector(selectDicesResult);
  const highlighted = useAppSelector(selectHighlighted);

  return (
    <Grid
      container
      spacing={ 4 }
    >
      <Board
        chips={ chips }
        selected={ selected }
        occupied={ boardState }
        dicesResult={ dicesResult }
        highlighted={ highlighted }
      />

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
            { '' }
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
