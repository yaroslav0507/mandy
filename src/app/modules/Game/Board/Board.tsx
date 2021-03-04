import React, { FC, useEffect, useState } from 'react';
import styled                             from 'styled-components';
import { theme }                          from '../../../../styles';
import { Grid }                           from '@material-ui/core';
import { Chip, ChipWrapper }              from './components/Chip';
import { Field }                          from './components/Field';
import { Dices }                          from '../Dices/Dices';
import {
  deselectChip, IChip, ICoordinates,
  isFieldAccessible,
  map,
  moveChip,
  selectActiveChips,
  selectChip,
  selectChipsMap,
  selectCurrentChip, selectHighlighted, setHighlightedField, resetHighlightedField
} from './boardReducer';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { Legend }                         from './components/Legend';

const BoardWrapper = styled(Grid)`&& {
  width: 100%;
  position: relative;
  max-width: calc(100vh - 110px);
  background: #262933;
}`;

const GameBoard = styled.div`
  position: relative;
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

const gameBoardId = 'game-board';

const teleportMap: ICoordinates<number[]> = {
  0: {
    1: [1, 1],
    3: [3, 0],
    4: [12, 4],
    8: [12, 8],
    9: [3, 12]
  },
  1: {
    12: [1, 11]
  },
  3: {
    0: [0, 3],
    12: [0, 9]
  },
  4: {
    0: [4, 12],
    12: [4, 0]
  },
  8: {
    0: [8, 12],
    12: [8, 0]
  },
  9: {
    0: [12, 3],
    12: [12, 9]
  },
  11: {
    0: [11, 1]
  },
  12: {
    3: [9, 0],
    4: [0, 4],
    8: [0, 8],
    9: [9, 12],
    11: [11, 11]
  }
};

export const Board: FC = () => {
  const [selectedX, selectedY] = useAppSelector(selectCurrentChip);
  const chips = useAppSelector(selectActiveChips);
  const boardState = useAppSelector(selectChipsMap);
  const [highlightedX, highlightedY] = useAppSelector(selectHighlighted);
  const dispatch = useAppDispatch();
  const [size, setSize] = useState(85);

  const isFieldOccupied = (x: number, y: number) => boardState[x] && boardState[x][y];
  const isChipSelected = (x: number, y: number) => x === selectedX && y === selectedY;
  const isChipHighlighted = (x: number, y: number) => x === highlightedX && y === highlightedY;

  const onFieldClick = (x: number, y: number) => {
    const fieldIsOccupied = isFieldOccupied(x, y);
    const fieldIsAccessible = isFieldAccessible(x, y);
    const move = moveChip([x, y]);
    const select = selectChip([x, y]);
    const deselect = deselectChip();

    if (selectedX !== undefined) {
      if (fieldIsAccessible) {
        dispatch(move);
        console.log([x, y]);
        const teleportsTo = teleportMap[x] && teleportMap[x][y];

        if (teleportsTo) {
          dispatch(setHighlightedField(teleportsTo));

          setTimeout(() => {
            dispatch(moveChip([teleportsTo[0], teleportsTo[1]]));
            dispatch(resetHighlightedField());
          }, 500);
        }

      } else {
        dispatch(fieldIsOccupied ? select : deselect);
      }
    } else if (fieldIsOccupied) {
      dispatch(select);
    }
  };

  const handleSizeCheck = () => {
    const el: any = document.getElementById(gameBoardId);
    const boardHeight = el && el.offsetHeight;
    const fieldSize = boardHeight / 13;
    setSize(fieldSize);
  };

  useEffect(() => {
    handleSizeCheck();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => handleSizeCheck());

    return () => {
      window.removeEventListener('resize', () => handleSizeCheck());
    };
  }, [size, window.innerWidth]);

  return (
    <BoardWrapper item>
      <GameBoard id={ gameBoardId }>
        <Legend size={ size }/>

        { map.map((row, x) => (
          <Row key={ x }>
            { row.map((field, y) => (
              <Field
                key={ y }
                className="field"
                empty={ !field }
                selected={ isChipSelected(x, y) || isChipHighlighted(x, y) }
                withChip={ !!isFieldOccupied(x, y) }
                onClick={ () => onFieldClick(x, y) }
              />
            )) }
          </Row>
        )) }

        { chips.map(({ color, current: [x, y] }, index) => (
          <ChipWrapper
            key={ index }
            size={ size }
            style={ { 'transform': `translate(${ x * size }px, ${ y * size }px)` } }
            color={ color }
            selected={ isChipSelected(x, y) }
            onClick={ () => onFieldClick(x, y) }
          >
            <Chip key={ x + y }/>
          </ChipWrapper>
        )) }
      </GameBoard>

      <Dices size={ size }/>
    </BoardWrapper>
  );
};
