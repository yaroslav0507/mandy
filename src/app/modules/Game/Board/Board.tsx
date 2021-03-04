import React, { FC, useEffect, useState } from 'react';
import styled, { css }                    from 'styled-components';
import { theme }                          from '../../../../styles';
import { Grid }                           from '@material-ui/core';
import { Chip, ChipWrapper }              from './components/Chip';
import { Field }                          from './components/Field';
import { Dices }                          from '../Dices/Dices';
import {
  deselectChip,
  isFieldAccessible,
  map,
  moveChip,
  selectActiveChips,
  selectChip,
  selectChipsMap,
  selectCurrentChip
}                                         from './boardReducer';
import { useAppDispatch, useAppSelector } from '../../../hooks';

const legendColor = '#2bb36f';
const legendWidth = 3;

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

const Line = styled.div`
  position: absolute;
  width: ${ legendWidth }px;
  background: linear-gradient(#2e323a, ${ legendColor }, #0f6b5c);
  
  &:after {
     content: '';
     position: absolute;
     border: solid black;
     border-width: 0 ${ legendWidth }px ${ legendWidth }px 0;
     border-radius: 0 ${ legendWidth }px;
     border-color: ${ legendColor };
     display: inline-block;
     padding: 4px;
     transform: rotate(45deg);
     left: -4px;
     bottom: 0;
  }
`;

const Line2 = styled(Line)`
  transform-origin: top;
  transform: rotate(-90deg);
`;

const ArcWrapper = styled.div`
   position: relative;
   
   &:before, &:after {
      content: '';
      position: absolute;
      border: solid black;
      border-width: 0 ${ legendWidth }px ${ legendWidth }px 0;
      border-radius: 0 ${ legendWidth }px;
      border-color: ${ legendColor };
      display: inline-block;
      padding: 4px;
      z-index: 1;
   }
   
   &:before {
      transform: rotate(135deg);
      bottom: -4px;
   }
   
   &:after {
      transform: rotate(-135deg);
      top: 0;
      right: -4px;
   }
`;

const Arc = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  &:after, &:before {
    content: '';
    position: absolute;
    border-radius: 100%;
  }
  
  &:after {
    right: 2px;
    bottom: 2px;
    background: #262a33;
  }

  &:before {
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #000, ${ legendColor }, #000);
  }
`;

const GameBoardLegendQuarter = styled.div<{ index: number }>`${ ({ index }) => css`
  position: absolute;
  width: 50%;
  height: 50%;
  float: left;
  transform-origin: right bottom;
  transform: rotate(${ index * 90 }deg);
` }`;

const GameBoardLegend = styled(GameBoard)<{ size: number }>`${ ({ size }) => css`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  color: ${ legendColor };
  
  ${ Line }  {
    height: ${ size * 2 }px;
    top: ${ size * 1.5 }px;
    left: ${ size * 4.5 }px;
  }
  
  ${ Line2 } {
    height: ${ size * 2 }px;
    left: ${ size * 1.5 }px;
    top: ${ size * 4.5 }px;
  }
  
  ${ ArcWrapper } {
    margin: ${ size * 1.5 }px;
    width: ${ size * 2 }px;
    height: ${ size * 2 }px;
    
    ${ Arc } {
      &:after, &:before {
        width: ${ size * 4 }px;
        height: ${ size * 4 }px;
      }
    }
  }
` }`;

const Row = styled.div`
  width: ${ 100 / 13 }%;
`;

const gameBoardId = 'game-board';

export const Board: FC = () => {
  const [selectedX, selectedY] = useAppSelector(selectCurrentChip);
  const chips = useAppSelector(selectActiveChips);
  const boardState = useAppSelector(selectChipsMap);
  const dispatch = useAppDispatch();
  const [size, setSize] = useState(85);

  const isFieldOccupied = (x: number, y: number) => boardState[x] && boardState[x][y];
  const isChipSelected = (x: number, y: number) => x === selectedX && y === selectedY;

  const onFieldClick = (x: number, y: number) => {
    const fieldIsOccupied = isFieldOccupied(x, y);
    const fieldIsAccessible = isFieldAccessible(x, y);
    const move = moveChip([x, y]);
    const select = selectChip([x, y]);
    const deselect = deselectChip();

    if (selectedX !== undefined) {
      if (fieldIsAccessible) {
        dispatch(move);
      } else {
        if (fieldIsOccupied) {
          dispatch(select);
        } else {
          dispatch(deselect);
        }
      }
    } else if (fieldIsOccupied) {
      dispatch(select);
    }
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
        <GameBoardLegend size={ size }>
          { ['a', 'b', 'c', 'd'].map((sector: string, index: number) => (
            <GameBoardLegendQuarter key={index} index={ index }>
              <Line/>
              <ArcWrapper>
                <Arc/>
              </ArcWrapper>
              <Line2/>
            </GameBoardLegendQuarter>
          )) }
        </GameBoardLegend>

        { map.map((row, x) => (
          <Row key={ x }>
            { row.map((field, y) => {
              const player = isFieldOccupied(x, y);
              return (
                <Field
                  key={ y }
                  className="field"
                  empty={ !field }
                  selected={ isChipSelected(x, y) }
                  withChip={ !!player }
                  onClick={ () => onFieldClick(x, y) }
                />
              )
            }) }
          </Row>
        )) }

        {chips.map(({ color, current: [x, y] }, index) => (
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
        ))}
      </GameBoard>

      <Dices size={ size }/>
    </BoardWrapper>
  );
};
