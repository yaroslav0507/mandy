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

const teleportMap: ICoordinates<{enter: number[]; exit: number[]}> = {
  0 : {
    1: { exit: [1, 1], enter: [0, 1]},
    3: { exit: [3, 0], enter: [0, 3]},
    4: { exit: [12, 4], enter: [0, 4]},
    8: { exit: [12, 8], enter: [0, 8]},
    9: { exit: [3, 12], enter: [0, 9]}
  },
  1 : {
    12: { exit: [1, 11], enter: [1, 12]}
  },
  3 : {
    0 : { exit: [0, 3], enter: [3, 0]},
    12: { exit: [0, 9], enter: [3, 12]}
  },
  4 : {
    0 : { exit: [4, 12], enter: [4, 0]},
    12: { exit: [4, 0], enter: [4, 12]}
  },
  8 : {
    0 : { exit: [8, 12], enter: [8, 0]},
    12: { exit: [8, 0], enter: [8, 12]}
  },
  9 : {
    0 : { exit: [12, 3], enter: [9, 0]},
    12: { exit: [12, 9], enter: [9, 12]}
  },
  11: {
    0: { exit: [11, 1], enter: [11, 0]}
  },
  12: {
    3 : { exit: [9, 0], enter: [12, 3]},
    4 : { exit: [0, 4], enter: [12, 4]},
    8 : { exit: [0, 8], enter: [12, 8]},
    9 : { exit: [9, 12], enter: [12, 9]},
    11: { exit: [11, 11], enter: [12, 11]}
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
      console.log([selectedX, selectedY]);

      dispatch(isFriendlyTarget ? select : move);
      const currTeleportMap = teleportMap[x] && teleportMap[x][y] && teleportMap[x][y];
      const teleportsFrom = currTeleportMap && currTeleportMap.enter || [];
      const teleportsTo = currTeleportMap && currTeleportMap.exit || [];

      if (!isFriendlyTarget && teleportsTo.length) {
        dispatch(setHighlightedField(teleportsTo));

        setTimeout(() => {
          const teleportTargetOccupied = teleportsTo && figureByCoords(teleportsTo[0], teleportsTo[1]);

          const goesToLockRoom = teleportsTo && lockRooms[teleportsTo[0]] && lockRooms[teleportsTo[0]][teleportsTo[1]];
          const lockRoomOccupied = teleportsTo && figureByCoords(teleportsTo[0], teleportsTo[1]);
          const lockRoomOccupiedByEnemy = lockRoomOccupied && lockRoomOccupied[0].teamId !== teamId;
          const lockRoomExitOccupied = goesToLockRoom && figureByCoords(goesToLockRoom[0], goesToLockRoom[1]);
          const lockRoomExitOccupiedByEnemy = lockRoomExitOccupied && lockRoomOccupied && lockRoomOccupied[0].teamId !== lockRoomExitOccupied[0].teamId;

          if (goesToLockRoom && lockRoomOccupiedByEnemy) {
            const player = `Player ${teamId}${id}`;
            console.log(player, ' goesToLockRoom ', goesToLockRoom);
            console.log('lockRoomOccupied: ', lockRoomOccupied);

            if (lockRoomExitOccupiedByEnemy) {
              console.log('lockRoomExitOccupied', lockRoomExitOccupiedByEnemy);
              lockRoomOccupied.forEach(chip => {
                dispatch(selectChip(chip));
                dispatch(moveChip(goesToLockRoom));
              });
              dispatch(deselect);

              const primaryFigure = figureByCoords(selectedX, selectedY)[0];
              dispatch(selectChip({
                ...primaryFigure,
                position: teleportsFrom
              } as IChip));

              dispatch(moveChip(teleportsTo));
            }
          } else {
            const lockRoomExit = lockRooms[x] && lockRooms[x][y];

            if (lockRoomExit && teleportTargetOccupied && teleportTargetOccupied[0].teamId !== teamId) {
              teleportTargetOccupied.forEach(({position: [x, y], id}) => {

                dispatch(selectChip({ teamId, id, position: [x, y] }));
                dispatch(moveChip(lockRoomExit));
                dispatch(deselect);
              });
            }
            dispatch(select);
            dispatch(moveChip(teleportsTo));
            dispatch(resetHighlightedField());
            dispatch(deselect);
          }
        }, 500);

        // setTimeout(() => {
        //   dispatch(moveChip(teleportsTo));
        //   dispatch(resetHighlightedField());
        // }, 500);
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
  ), [id, size, teamId, selectedX, selectedY]);
};
