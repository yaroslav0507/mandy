import React, { FC, useEffect, useMemo, useState }                    from 'react';
import styled                                                         from 'styled-components';
import { theme }                                                      from '../../../../styles';
import { Grid }                                                       from '@material-ui/core';
import { Chip }                                                       from './components/Chip';
import { Field }                                                      from './components/Field';
import { Dices }                                                      from '../Dices/Dices';
import {
  deselectChip,
  IChip,
  IMapState,
  isFieldAccessible,
  map,
  moveChip,
  resetHighlightedField, selectActiveChips,
  selectChip, selectCurrentChip, selectHighlighted, selectOccupied,
  setHighlightedField,
}                                                                     from './boardReducer';
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
  const chips = useAppSelector(selectActiveChips);
  const selected = useAppSelector(selectCurrentChip);
  const occupied = useAppSelector(selectOccupied);
  const dicesResult = useAppSelector(selectDicesResult);
  const highlighted = useAppSelector(selectHighlighted);

  const displayLabels = true;
  const { id, teamId, position } = selected;
  const [ selectedX, selectedY ] = position;
  const [ highlightedX, highlightedY ] = highlighted;
  const [ size, setSize ] = useState(85);

  const dispatch = useAppDispatch();
  const figuresByCoords = (x: number, y: number) => occupied[x] && occupied[x][y];
  const isChipSelected = (figureId: number, figureTeamId: number) => figureId === id && figureTeamId === teamId;
  const isChipHighlighted = (x: number, y: number) => x === highlightedX && y === highlightedY;
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

  const onFieldClick = (x: number, y: number, figureId: number) => {
    const targetFieldFigures = figuresByCoords(x, y);
    const figure = targetFieldFigures && targetFieldFigures.find(figure => figure.id === figureId);
    const fieldAccessible = isFieldAccessible(x, y);
    const move = moveChip([ x, y ]);
    const select = selectChip(figure);
    const deselect = deselectChip();

    const sendHome = (fromX: number, fromY: number) => {
      const _cache = JSON.stringify(selected);
      const figures = figuresByCoords(fromX, fromY);

      figures.forEach(figure => {
        if (figure.teamId !== teamId) {
          dispatch(selectChip(figure));
          const { start } = teamsConfig[figure.teamId];
          dispatch(moveChip(start[figure.id]));
          dispatch(deselect);
        }
      });

      dispatch(selectChip(JSON.parse(_cache)));
    };

    const checkForAutomatedMovements = () => {
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

              dispatch(deselect);
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

    const whenFigureSelected = () => {
      if (targetFieldFigures) {
        const [homeDoorsX, homeDoorsY] = teamsConfig[teamId]?.doors;
        const isHomeExit = homeDoorsX === x && homeDoorsY === y;
        const isSelfClick = selectedX === x && selectedY === y;

        if (!isSelfClick && (isHomeExit || fieldAccessible)) {
          sendHome(selectedX, selectedY);
          dispatch(move);
          checkForAutomatedMovements();
        } else {
          dispatch(select);
        }
      } else if (fieldAccessible) {
        dispatch(move);
        checkForAutomatedMovements();
      } else {
        dispatch(deselect);
      }
    };

    if (selected?.position?.length) {
      whenFigureSelected();
    } else if (targetFieldFigures) {
      dispatch(select);
    }
  };

  const handleSizeCheck = () => {
    const el: any = document.getElementById(gameBoardId);
    const boardHeight = el && el.offsetHeight;
    const fieldSize = boardHeight / 13;
    setSize(fieldSize);
  };

  const alphabets = {
    english: [ 'A', 'B', 'C', 'D' ],
    greek  : [ 'α', 'β', 'γ', 'δ' ],
    roman  : [ 'I', 'II', 'III', 'IV' ],
    arab   : [ '1', '2', '3', '4' ]
  };

  useEffect(() => {
    handleSizeCheck();
  }, []);

  useEffect(() => {
    setTimeout(highlightProjectedField, 1000);
  }, [ chips, selectedY, selectedX, dicesResult ]);

  useEffect(() => {
    window.addEventListener('resize', () => handleSizeCheck());
    window.addEventListener('orientationchange', () => handleSizeCheck());

    return () => {
      window.removeEventListener('resize', () => handleSizeCheck());
      window.removeEventListener('orientationchange', () => handleSizeCheck());
    };
  }, [ size, window.innerWidth ]);

  return (
    <BoardWrapper item>
      <Dices size={ size }/>

      <GameBoard id={ gameBoardId }>
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

        { chips.map(({ id, teamId, position: [ x, y ] }, index) => {
          const marginKey = figuresByCoords(x, y)?.map(figure => figure.id).join('');

          return (
            <Chip
              x={ x }
              y={ y }
              key={ index }
              size={ size }
              color={ teamsConfig[teamId]?.color }
              selected={ isChipSelected(id, teamId) }
              onClick={ () => onFieldClick(x, y, id) }
              label={ displayLabels && alphabets.arab[id] }
              margin={ figureMargin(size, marginKey, id) }
            />
          );
        }) }
      </GameBoard>
    </BoardWrapper>
  );
};
