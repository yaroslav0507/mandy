import React, { FC }                                    from 'react';
import { Grid }                                         from '@material-ui/core';
import { GameBoard }                                    from '../GameBoard/GameBoard';
import { useState }                                     from 'react';
import { IBoardChipCoordinates, initialCoordinatesMap } from '../../utils';
import { IChip }                                        from '../../models/Chip';

export const GamePage: FC = () => {
  const [selectedChip, setSelectedChip] = useState<IChip>();
  const [boardState] = useState<IBoardChipCoordinates>(initialCoordinatesMap);
  
  return (
    <Grid container spacing={4}>
      <GameBoard
        boardState={boardState}
        selectedChip={selectedChip}
        onChipSelected={(x, y) => setSelectedChip({x, y})}
      />
      
      <Grid item xs>
        <Grid container spacing={4}>
          <Grid item md={12}>
            Selected
            
            {selectedChip ? (
              <>
                <div>
                  x: { selectedChip.x }
                </div>
                <div>
                  y: { selectedChip.y }
                </div>
              </>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
