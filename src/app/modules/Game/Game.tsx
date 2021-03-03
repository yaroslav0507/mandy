import React, { FC, useState }                          from 'react';
import { Grid }                                         from '@material-ui/core';
import { Board }                                        from './Board/Board';
import { IBoardChipCoordinates, initialCoordinatesMap } from './utils';
import { IChip }                                        from './models/Chip';

export const Game: FC = () => {
  const [selectedChip, setSelectedChip] = useState<IChip>();
  const [boardState] = useState<IBoardChipCoordinates>(initialCoordinatesMap);

  return (
    <Grid
      container
      spacing={ 4 }
    >
      <Board
        boardState={ boardState }
        selectedChip={ selectedChip }
        onChipSelected={ (x, y) => setSelectedChip({ x, y }) }
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
            Selected

            { selectedChip ? (
              <>
                <div>
                  x: { selectedChip.x }
                </div>
                <div>
                  y: { selectedChip.y }
                </div>
              </>
            ) : null }
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
