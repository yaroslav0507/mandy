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
  setHighlightedField, teamsConfig
}                                         from './boardReducer';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { Legend }                               from './components/Legend';
import { figureMargin, lockRooms, teleportMap } from './maps';

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

export const Board: FC = () => {
  const displayLabels = true;
  const { id, teamId, position: [selectedX, selectedY] } = useAppSelector(selectCurrentChip);
  const selectedChipId = `${id}`;
  const figures: IChip[] = useAppSelector(selectActiveChips);
  const boardState = useAppSelector(selectChipsMap);
  const teams = useAppSelector(selectTeams);
  const [highlightedX, highlightedY] = useAppSelector(selectHighlighted);
  const dispatch = useAppDispatch();
  const [size, setSize] = useState(85);

  const figureByCoords = (x: number, y: number) => boardState[x] && boardState[x][y];
  const isChipSelected = (figureId: number, figureTeamId: number) => figureId === id && figureTeamId === teamId;
  const isChipHighlighted = (x: number, y: number) => x === highlightedX && y === highlightedY;

  const onFieldClick = (x: number, y: number, id: number) => {
    const figureSelected = selectedX !== undefined;
    const fieldOccupied = figureByCoords(x, y);
    const figure = fieldOccupied && fieldOccupied.find(figure => figure.id === id);
    const fieldAccessible = isFieldAccessible(x, y);

    const isFriendlyTarget = teamId < 0 || figure && figure.teamId === teamId;
    const move = moveChip([x, y]);
    const select = selectChip(figure);
    const deselect = deselectChip();

    const whenFigureLanded = () => {
      const currTeleportMap = teleportMap[x] && teleportMap[x][y] && teleportMap[x][y];
      const teleportsFrom = currTeleportMap && currTeleportMap.enter || [];
      const teleportsTo = currTeleportMap && currTeleportMap.exit || [];

      if (teleportsTo.length) {
        dispatch(setHighlightedField(teleportsTo));

        setTimeout(() => {
          const teleportTargetOccupied = teleportsTo && figureByCoords(teleportsTo[0], teleportsTo[1]);

          const goesToLockRoomExit = teleportsTo && lockRooms[teleportsTo[0]] && lockRooms[teleportsTo[0]][teleportsTo[1]];
          const lockRoomOccupied = teleportsTo && figureByCoords(teleportsTo[0], teleportsTo[1]);
          const lockRoomOccupiedByEnemy = lockRoomOccupied && lockRoomOccupied[0].teamId !== teamId;

          const saveFirstKillRest = () => {
            lockRoomOccupied.forEach((enemy, index) => {
              dispatch(selectChip(enemy));

              if (!index) {
                dispatch(moveChip(goesToLockRoomExit));
              } else {
                const { start } = teamsConfig[enemy.teamId];

                start.forEach((coords) => {
                  const isOccupied = figureByCoords(coords[0], coords[1]);
                  if (!isOccupied) {
                    dispatch(moveChip(coords));
                  }
                });
              }

              dispatch(deselect);
            });
          };

          if (goesToLockRoomExit && lockRoomOccupiedByEnemy) {
            const fieldFigures = figureByCoords(selectedX, selectedY);
            const primaryFigure = fieldFigures?.find(figure => figure.id === +selectedChipId);

            saveFirstKillRest();

            dispatch(selectChip({
              ...primaryFigure,
              position: teleportsFrom
            } as IChip));

            dispatch(moveChip(teleportsTo));
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
      }
    };

    const whenFigureSelected = () => {
      if (fieldOccupied) {
        if (isFriendlyTarget) {
          dispatch(select);
        } else {
          dispatch(move);
          whenFigureLanded();
        }
      } else if (fieldAccessible) {
        dispatch(move);
        whenFigureLanded();
      } else {
        dispatch(deselect);
      }
    };

    if (figureSelected) {
      whenFigureSelected();
    } else if (fieldOccupied) {
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
              margin={ figureMargin(size, marginKey, id) }
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
