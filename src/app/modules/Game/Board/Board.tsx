import React, { FC, useEffect, useState } from 'react';
import styled                             from 'styled-components';
import { theme }                          from '../../../../styles';
import { Grid }                           from '@material-ui/core';
import { Chip, ChipWrapper }              from './components/Chip';
import { Field }                          from './components/Field';
import { IChip }                          from '../models/Chip';
import { Dices }                          from '../Dices/Dices';
import {
  deselectChip,
  isFieldAccessible,
  map,
  moveChip,
  selectActiveCoords,
  selectChip,
  selectCurrentChip,
  selectPlayers
}                                         from './boardReducer';
import { useAppDispatch, useAppSelector } from '../../../hooks';

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

const gameBoardId = 'game-board';

export const Board: FC = () => {
  const selectedChip = useAppSelector(selectCurrentChip);
  const boardState = useAppSelector(selectActiveCoords);
  const players = useAppSelector(selectPlayers);
  const dispatch = useAppDispatch();
  const [size, setSize] = useState(85);

  const isFieldOccupied = (x: number, y: number) => boardState[x] && boardState[x][y];
  const isChipSelected = (chip: IChip) => !!selectedChip && chip.x === selectedChip.x && chip.y === selectedChip.y;

  const onFieldClick = (x: number, y: number) => {
    if (selectedChip) {
      if (isFieldAccessible(x, y)) {
        dispatch(moveChip({ x, y }));
      } else if (isFieldOccupied(x, y)) {
        dispatch(selectChip({ x, y }));
      } else {
        dispatch(deselectChip())
      }
    } else if (isFieldOccupied(x, y)) {
      dispatch(selectChip({ x, y }));
    }
  }

  const chipStyleCoordinates = (chip: IChip) => {
    const x = chip.x * size;
    const y = chip.y * size;
    return `translate(${ x }px, ${ y }px)`;
  }

  const handleSizeCheck = () => {
    const el: any = document.getElementById(gameBoardId);
    const boardHeight = el && el.offsetHeight;
    const fieldSize = boardHeight / 13;
    setSize(fieldSize);
  }

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
                />
              )
            }) }
          </Row>
        )) }

        { players.map(({ color, chips }) => chips.map((chip, index) => (
          <ChipWrapper
            key={ index }
            size={ size }
            style={ { 'transform': chipStyleCoordinates(chip) } }
            color={ color }
            selected={ isChipSelected(chip) }
            onClick={ () => onFieldClick(chip.x, chip.y) }
          >
            <Chip
              key={ chip.x + chip.y }
              className="animate-movement"
            />
          </ChipWrapper>
        ))) }
      </GameBoard>

      <Dices size={ size }/>
    </BoardWrapper>
  );
};
