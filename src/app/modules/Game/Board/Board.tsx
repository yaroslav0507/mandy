import React, { FC } from 'react';
import styled        from 'styled-components';
import { theme }     from '../../../../styles';
import { Grid }      from '@material-ui/core';
import { Chip }      from './components/Chip';
import { Field }     from './components/Field';
import { IChip }     from '../models/Chip';
import { Dices }     from '../Dices/Dices';
import {
  deselectChip,
  isFieldAccessible,
  map,
  moveChip,
  selectActiveCoords,
  selectChip,
  selectCurrentChip
}                    from './boardReducer';
import {
  useAppDispatch,
  useAppSelector
}                    from '../../../hooks';

const BoardWrapper = styled(Grid)`&& {
  width: 100%;
  position: relative;
  max-width: calc(100vh - 110px);
  background: #262933;
}`;

const GameBoard = styled.div`
  font-size: 16px;
  color: ${ theme.colors.info };
  width: 100%;
  height: 100%;
  display: flex;
  
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;

const Row = styled.div`
  width: ${ 100 / 13 }%;
`;

export const Board: FC = () => {
  const selectedChip = useAppSelector(selectCurrentChip);
  const boardState = useAppSelector(selectActiveCoords);
  const dispatch = useAppDispatch();

  const isFieldOccupied = (x: number, y: number) => boardState[x] && boardState[x][y];
  const isChipSelected = (chip: IChip) => !!selectedChip && chip.x === selectedChip.x && chip.y === selectedChip.y;

  const onFieldClick = (x: number, y: number) => {
    if (selectedChip) {
      if (isFieldAccessible(x, y) && !isFieldOccupied(x, y)) {
        dispatch(moveChip({ x, y }));
      } else {
        dispatch(deselectChip())
      }
    } else if (isFieldOccupied(x, y)) {
      dispatch(selectChip({ x, y }));
    }
  }

  return (
    <BoardWrapper item>
      <GameBoard>
        { map.map((row, x) => (
          <Row key={ x }>
            { row.map((field, y) => {
              const player = isFieldOccupied(x, y);

              return (
                <Field
                  key={ y }
                  className="field"
                  empty={ !field }
                  selected={ isChipSelected({ x, y }) }
                  withChip={ !!player }
                  onClick={ () => onFieldClick(x, y) }
                >
                  { player ? (
                    <Chip color={ player.color }/>
                  ) : null }
                </Field>
              )
            }) }
          </Row>
        )) }
      </GameBoard>

      <Dices/>
    </BoardWrapper>
  );
};
