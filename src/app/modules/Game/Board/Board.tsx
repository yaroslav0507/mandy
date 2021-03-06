import React, { FC, useEffect, useMemo, useState } from 'react';
import styled                                      from 'styled-components';
import { theme }                                   from '../../../../styles';
import { Grid }                                    from '@material-ui/core';
import { Chip }                                    from './components/Chip';
import { Field }                                   from './components/Field';
import { Dices }                                   from '../Dices/Dices';
import {
  deselectChip,
  IChip,
  ICoordinates,
  isFieldAccessible,
  map,
  moveChip,
  resetHighlightedField,
  selectActiveChips,
  selectChip,
  selectChipsMap,
  selectCurrentChip,
  selectHighlighted,
  selectTeams,
  setHighlightedField
}                                                  from './boardReducer';
import { useAppDispatch, useAppSelector }          from '../../../hooks';
import { Legend }                                  from './components/Legend';

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

export const lockRooms: ICoordinates<number[]> = {
  1: {
    1: [1, 0],
    11: [0, 11]
  },
  11: {
    1: [12, 1],
    11: [11, 12]
  }
};

const teleportMap: ICoordinates<number[]> = {
  0 : {
    1: [1, 1],
    3: [3, 0],
    4: [12, 4],
    8: [12, 8],
    9: [3, 12]
  },
  1 : {
    12: [1, 11]
  },
  3 : {
    0 : [0, 3],
    12: [0, 9]
  },
  4 : {
    0 : [4, 12],
    12: [4, 0]
  },
  8 : {
    0 : [8, 12],
    12: [8, 0]
  },
  9 : {
    0 : [12, 3],
    12: [12, 9]
  },
  11: {
    0: [11, 1]
  },
  12: {
    3 : [9, 0],
    4 : [0, 4],
    8 : [0, 8],
    9 : [9, 12],
    11: [11, 11]
  }
};

export const Board: FC = () => {
  const displayLabels = true;

  const { id, teamId, position: [selectedX, selectedY] } = useAppSelector(selectCurrentChip);
  const figures: IChip[] = useAppSelector(selectActiveChips);
  const boardState = useAppSelector(selectChipsMap);
  const teams = useAppSelector(selectTeams);
  const [highlightedX, highlightedY] = useAppSelector(selectHighlighted);
  const dispatch = useAppDispatch();
  const [size, setSize] = useState(85);

  const figureByCoords = (x: number, y: number) => boardState[x] && boardState[x][y];
  const isChipSelected = (figureId: number, figureTeamId: number) => figureId === id && figureTeamId === teamId;
  const isChipHighlighted = (x: number, y: number) => x === highlightedX && y === highlightedY;

  const figureMargin = (key: string, id: number) => {
    const shift = `${ size / 4 }px`;
    const center = '0';
    const topLeft = `-${ shift }`;
    const topCenter = `-${ shift } 0`;
    const topRight = `-${ shift } 0 0 ${ shift }`;
    const bottomLeft = `${ shift } 0 0 -${ shift }`;
    const bottomRight = `${ shift }`;

    const map: any = {
      '0'   : { 0: center },
      '1'   : { 1: center },
      '2'   : { 2: center },
      '3'   : { 3: center },
      '01'  : { 0: topLeft, 1: bottomRight },
      '02'  : { 0: topLeft, 2: bottomRight },
      '03'  : { 0: topLeft, 3: bottomRight },
      '12'  : { 1: topLeft, 2: bottomRight },
      '13'  : { 1: topLeft, 3: bottomRight },
      '23'  : { 2: topLeft, 3: bottomRight },
      '012' : { 0: topCenter, 1: bottomLeft, 2: bottomRight },
      '013' : { 0: topCenter, 1: bottomLeft, 3: bottomRight },
      '023' : { 0: topCenter, 2: bottomLeft, 3: bottomRight },
      '123' : { 1: topCenter, 2: bottomLeft, 3: bottomRight },
      '0123': { 0: topRight, 1: topLeft, 2: bottomLeft, 3: bottomRight }
    };

    return map[key] && map[key][id];
  };

  const onFieldClick = (x: number, y: number, id: number) => {
    const target = figureByCoords(x, y);
    const figure = target && target.find(figure => figure.id === id);
    const isFriendlyTarget = teamId < 0 || figure && figure.teamId === teamId;
    const fieldAccessible = isFieldAccessible(x, y);
    const move = moveChip([x, y]);
    const select = selectChip(figure);
    const deselect = deselectChip();

    if (fieldAccessible) {
      dispatch(isFriendlyTarget ? select : move);
      const teleportsTo = teleportMap[x] && teleportMap[x][y] || [];

      if (!isFriendlyTarget && teleportsTo.length) {
        dispatch(setHighlightedField(teleportsTo));

        // setTimeout(() => {
        //   const teleportTargetOccupied = chipByCoords(teleportsTo[0], teleportsTo[1]);
        //   const lockRoomExit = lockRooms[x] && lockRooms[x][y];
        //
        //   if (lockRoomExit && teleportTargetOccupied && teleportTargetOccupied[0].teamId !== teamId) {
        //     teleportTargetOccupied.forEach(({position: [x, y], id}) => {
        //
        //       dispatch(selectChip({ teamId, id, position: [x, y] }));
        //       dispatch(move(lockRoomExit[0], lockRoomExit[1]));
        //       dispatch(deselect);
        //     });
        //   }
        //   dispatch(select);
        //   dispatch(move(teleportsTo[0], teleportsTo[1]));
        //   dispatch(resetHighlightedField());
        //   dispatch(deselect);
        // }, 500);

        setTimeout(() => {
          dispatch(moveChip(teleportsTo));
          dispatch(resetHighlightedField());
        }, 500);
      }

    } else {
      dispatch(figure ? select : deselect);
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

  return useMemo(() => (
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
                highlighted={isChipHighlighted(x, y)}
                occupied={ !!figureByCoords(x, y) && isFieldAccessible(x, y)}
                onClick={ () => onFieldClick(x, y, 0) }
              />
            )) }
          </Row>
        )) }

        { figures.map(({ id, teamId, position: [x, y] }, index) => {
          const target = boardState[x] && boardState[x][y];
          const marginKey = target && target.map(figure => figure.id).join('');

          const alphabets = {
            greek: ['α', 'β', 'γ', 'δ'],
            roman: ['I', 'II', 'III', 'IV'],
            arab: ['1', '2', '3', '4']
          };

          const label = displayLabels && alphabets.roman[id];

          return (
            <Chip
              x={ x }
              y={ y }
              key={ index }
              label={ label }
              size={ size }
              margin={ figureMargin(marginKey, id) }
              color={ teams[teamId]?.color }
              selected={ isChipSelected(id, teamId) }
              onClick={ () => onFieldClick(x, y, id) }
            />
          );
        }) }
      </GameBoard>

      <Dices size={ size }/>
    </BoardWrapper>
  ), [id, size, selectedX, selectedY]);
};
