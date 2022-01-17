import React, { FC, Fragment, useEffect, useState }                             from 'react';
import styled                                                         from 'styled-components';
import { theme }                                                      from '../../../../styles';
import { Grid }                                                       from '@material-ui/core';
import { Chip }                                                       from './components/Chip';
import { Field }                                                      from './components/Field';
import { Dices }                                                      from '../Dices/Dices';
import {
  deselectChip,
  IChip,
  isFieldAccessible,
  map,
  moveChip,
  resetHighlightedField,
  selectActiveChips,
  selectChip,
  selectCurrentChip, selectCurrentTeam,
  selectHighlighted,
  selectOccupied,
  setHighlightedField,
} from './boardReducer';
import { useAppDispatch, useAppSelector }                             from '../../../hooks';
import { Legend }                                                     from './components/Legend';
import { figureMargin, getProjectedPosition, lockRooms, teleportMap } from './maps';
import { teamsConfig }                                                from '../../Settings/settingsReducer';
import { selectDicesResult }                                          from '../Dices/dicesReducer';

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
  const team = useAppSelector(selectCurrentTeam);
  const chips = useAppSelector(selectActiveChips);
  const selected = useAppSelector(selectCurrentChip);
  const occupied = useAppSelector(selectOccupied);
  const dicesResult = useAppSelector(selectDicesResult);
  const highlighted = useAppSelector(selectHighlighted);

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  const displayLabels = true;
  const { id, teamId, x: selectedX, y: selectedY } = selected;
  const [highlightedX, highlightedY] = highlighted;
  const [size, setSize] = useState(85);

  const config = !!teamId && teamsConfig[teamId];
  const isAtHome = config && config.start.find(([x, y]) => x === selectedX && y === selectedY);

  const canAccessCoordinates = (x: number, y: number) => {
    if (selectedX && selectedY) {
      const horizDistance = Math.abs(x - selectedX);
      const vertDistance = Math.abs(y - selectedY);
      const pathLength = horizDistance + vertDistance;
      const dicesSum = dicesResult.reduce((acc, curr) => acc + curr);

      const isClockWise = !y && x > selectedX || x === 12 && y > selectedY || y === 12 && x < selectedX || !x && y < selectedY;

      if (isAtHome) {
        const canExitFromHome = !!dicesResult.find(dice => dice === 6);
        const isHomeExitCoords = config && x === config?.doors[0] && y === config?.doors[1];
        return canExitFromHome && isHomeExitCoords;
      }

      return !!pathLength && isClockWise && isFieldAccessible(x, y) && pathLength <= dicesSum;
    }

    return false;
  };

  const dispatch = useAppDispatch();
  const figuresByCoords = (x: number, y: number) => occupied[x] && occupied[x][y];
  const isChipSelected = (figureId: number, figureTeamId: number) => figureId === id && figureTeamId === teamId;
  const isChipHighlighted = (x: number, y: number) => x === highlightedX && y === highlightedY || canAccessCoordinates(x, y);
  const projectedPosition = (x: number, y: number, dice: number) => getProjectedPosition(x, y, occupied, teamId, dice);

  const highlightProjectedField = () => {
    const sorted = dicesResult.slice().sort((a, b) => b - a);
    const projections = sorted.map(dice => projectedPosition(selectedX, selectedY, dice)).filter(pos => !!pos);
    const projection = projections[0];

    if (projection) {
      dispatch(setHighlightedField(projection as number[]));
    } else if (highlightedX !== undefined) {
      dispatch(resetHighlightedField());
    }
  };

  const sendHome = (fromX: number, fromY: number) => {
    const _cache = JSON.stringify(selected);
    const figures = figuresByCoords(fromX, fromY);

    figures.forEach(figure => {
      if (figure.teamId !== teamId) {
        const { start } = teamsConfig[figure.teamId];
        dispatch(selectChip(figure));
        dispatch(moveChip(start[figure.id]));
        dispatch(deselectChip());
      }
    });

    dispatch(selectChip(JSON.parse(_cache)));
  };

  const checkForAutomatedMovements = (x: number,  y: number) => {
    const currTeleportMap = teleportMap[x] && teleportMap[x][y] && teleportMap[x][y];
    const teleportsFrom = currTeleportMap && currTeleportMap.enter || [];
    const teleportsTo = currTeleportMap && currTeleportMap.exit || [];

    if (teleportsTo.length) {
      dispatch(setHighlightedField(teleportsTo));

      setTimeout(() => {
        const goesToLockRoomExit = teleportsTo && lockRooms?.[teleportsTo[0]]?.[teleportsTo[1]];
        const lockRoomOccupied = teleportsTo && figuresByCoords(teleportsTo[0], teleportsTo[1]);
        const lockRoomOccupiedByEnemy = lockRoomOccupied && lockRoomOccupied[0].teamId !== teamId;

        const saveFirstKillRest = () => {
          lockRoomOccupied.forEach((enemy, index) => {
            dispatch(selectChip(enemy));

            if (!index) {
              dispatch(moveChip(goesToLockRoomExit));
            } else {
              const { start } = teamsConfig[enemy.teamId];
              dispatch(moveChip(start[enemy.id]));
            }

            dispatch(deselectChip());
          });
        };

        if (goesToLockRoomExit && lockRoomOccupiedByEnemy) {
          const fieldFigures = figuresByCoords(selectedX, selectedY);
          const primaryFigure = fieldFigures[0];

          saveFirstKillRest();

          dispatch(selectChip({
            ...primaryFigure,
            position: teleportsFrom
          } as IChip));

          dispatch(moveChip(teleportsTo));
        } else {
          dispatch(moveChip(teleportsTo));
          dispatch(resetHighlightedField());
        }
      }, 500);
    }
  };

  const onFieldClick = (x: number, y: number, figureId: number) => {
    const targetFieldFigures = figuresByCoords(x, y);
    const figure = targetFieldFigures && targetFieldFigures.find(figure => figure.id === figureId);
    const fieldAccessible = isFieldAccessible(x, y);
    const move = moveChip([x, y]);
    const select = selectChip(figure);
    const deselect = deselectChip();
    const isCurrentTeam = team?.id === figure?.teamId;

    const whenFigureSelected = () => {
      if (targetFieldFigures) {
        const [homeDoorsX, homeDoorsY] = figure?.teamId ? teamsConfig[figure?.teamId]?.doors : [];
        const isHomeExit = homeDoorsX === x && homeDoorsY === y;
        const isSelfClick = selectedX === x && selectedY === y;

        if (!isSelfClick && (isHomeExit || fieldAccessible)) {
          sendHome(selectedX, selectedY);
          dispatch(move);
          checkForAutomatedMovements(x, y);
        } else if (isCurrentTeam) {
          dispatch(select);
        }
      } else if (fieldAccessible) {
        dispatch(move);
        checkForAutomatedMovements(x, y);
      } else {
        dispatch(deselect);
      }
    };

    if (selectedX !== -1) {
      whenFigureSelected();
    } else if (targetFieldFigures && isCurrentTeam) {
      dispatch(select);
    } else {
      dispatch(deselect);
    }
  };

  const handleSizeCheck = () => {
    const el: any = document.getElementById(gameBoardId);
    const boardHeight = el && el.offsetHeight;
    const fieldSize = boardHeight / 13;
    setSize(fieldSize);
  };

  const alphabets = {
    english: ['A', 'B', 'C', 'D'],
    greek:   ['α', 'β', 'γ', 'δ'],
    roman:   ['I', 'II', 'III', 'IV'],
    arab:    ['1', '2', '3', '4']
  };

  useEffect(() => {
    handleSizeCheck();
  }, []);

  useEffect(() => {
    setTimeout(highlightProjectedField, 1000);
  }, [chips, selectedY, selectedX, dicesResult]);

  useEffect(() => {
    window.addEventListener('resize', () => handleSizeCheck());
    window.addEventListener('orientationchange', () => handleSizeCheck());

    return () => {
      window.removeEventListener('resize', () => handleSizeCheck());
      window.removeEventListener('orientationchange', () => handleSizeCheck());
    };
  }, [size, window.innerWidth]);

  return (
    <BoardWrapper item>
      <Dices size={ size }/>

      <GameBoard id={ gameBoardId } key={ team?.id}>
        <Legend size={ size }/>

        { map.map((row, x) => (
          <Row key={ x }>
            { row.map((field, y) => (
              <Field
                key={ y }
                className="field"
                empty={ !field }
                highlighted={ isChipHighlighted(x, y) }
                occupied={ !!figuresByCoords(x, y) && isFieldAccessible(x, y) }
                onClick={ () => onFieldClick(x, y, 0) }
              />
            )) }
          </Row>
        )) }

        { chips.map(({ id, teamId, x, y }, index) => {
          const figure = figuresByCoords(x, y);
          const marginKey = figure?.map(figure => figure.id).join('');

          return (
            <Chip
              x={ x }
              y={ y }
              key={ index }
              size={ size }
              locked={ figure?.[0]?.teamId !== team?.id }
              color={ teamsConfig[teamId]?.color }
              selected={ isChipSelected(id, teamId) }
              onClick={ () => onFieldClick(x, y, id) }
              label={ displayLabels && alphabets.english[id] }
              margin={ figureMargin(size, marginKey, id) }
            />
          );
        }) }
      </GameBoard>
    </BoardWrapper>
  );
};
