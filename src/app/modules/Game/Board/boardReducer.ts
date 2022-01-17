import { createSlice, PayloadAction }       from '@reduxjs/toolkit';
import { RootState }                        from '../../../store';
import { ITeams, selectTeams, teamsConfig } from '../../Settings/settingsReducer';
import { createSelector }                   from 'reselect';

type TMapCoords = number[];

export interface IChip {
  teamId: number;
  id: number;
  x: number;
  y: number;
}

export interface IMapState {
  chips: IChip[];
  occupied: ICoordinates<IChip[]>;
  selected: IChip;
  highlighted: TMapCoords;
  current: number;
}

export interface ICoordinates<T> {
  [x: number]: {
    [y: number]: T;
  }
}

export const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const isFieldAccessible = (x: number, y: number) => !!map[x]?.[y];

const teams: ITeams = {};
const chips: IChip[] = [];

teamsConfig.forEach((team) => {
  teams[team.id] = team;
  team.start.forEach(([x, y], id) => chips.push({
    id,
    teamId: team.id,
    x,
    y
  }));
});

const generateChipsPositionMap = (items: IChip[] = chips): ICoordinates<IChip[]> => {
  const chipsMap: ICoordinates<IChip[]> = {};

  items.forEach((chip) => {
    const { x, y } = chip;

    const occupied = chipsMap[x] && chipsMap[x][y] && chipsMap[x][y];
    const occupiedByTeammate = occupied && occupied[0] && occupied[0].teamId === chip.teamId;

    chipsMap[x] = {
      ...chipsMap[x],
      [y]: occupiedByTeammate ? [...occupied, chip] : [chip]
    };
  });

  return chipsMap;
};

const unselectedState = { id: -1, teamId: -1, x: -1, y: -1 };

const initialState: IMapState = JSON.parse(JSON.stringify({
  chips,
  occupied:    generateChipsPositionMap(chips),
  selected:    unselectedState,
  highlighted: [],
  current:     0
}));

export const boardSlice = createSlice({
  name:     'map',
  initialState,
  reducers: {
    selectChip(state, { payload }: PayloadAction<IChip | undefined>) {
      if (payload) {
        const isOccupied = ([x, y]: number[]) => state.occupied[x] && state.occupied[x][y];
        const target = isOccupied([payload.x, payload.y]);
        const figure = target && target.find(chip => chip.id === payload.id);
        state.selected = figure || state.selected;
      }
    },
    setCurrentTeam(state, action: PayloadAction<number>) {
      state.current = action.payload;
    },
    deselectChip(state) {
      state.selected = { ...unselectedState };
    },
    setHighlightedField(state, action: PayloadAction<number[]>) {
      state.highlighted = action.payload;
    },
    resetHighlightedField(state) {
      state.highlighted = [];
    },
    moveChip(state, action: PayloadAction<TMapCoords>) {
      const { selected: { teamId, x: moveFromX, y: moveFromY } } = state;

      if (moveFromX !== -1) {
        const moveTo = action.payload;
        const [moveToX, moveToY] = moveTo;

        const targetChips = ([x, y]: number[]) => state.occupied[x] && state.occupied[x][y] && state.occupied[x][y];
        const isOccupied = ([x, y]: number[]) => targetChips([x, y])?.[0];
        const targetChip = isOccupied(moveTo);
        const startPosition: any = targetChip && teamsConfig[targetChip.teamId].start.find(position => !isOccupied(position));

        const checkMovement = ({ x, y, id }: IChip) => {
          if (x === moveFromX && y === moveFromY && id === state.selected.id) {
            return moveTo;
          } else {
            return [x, y];
          }
        };
        const sendToStart = ({ x, y, id }: IChip) => (x === moveToX && y === moveToY) ? startPosition : [x, y];

        const chips = state.chips.map((chip) => {
          if (chip.x === moveToX && chip.y === moveToY && chip.teamId !== teamId) {
            const [x, y] = sendToStart(chip);
            return {
              ...chip,
              x,
              y
            };
          } else {
            const [x, y] = checkMovement(chip);
            return {
              ...chip,
              x,
              y
            };
          }
        });

        state.chips = chips;
        // state.selected.teamId = teamId;
        state.selected.x = moveToX;
        state.selected.y = moveToY;
        state.occupied = generateChipsPositionMap(chips);
      } else {
        console.log('Cannot move unselected figure');
      }
    }
  }
});

// Action creators are generated for each case reducer function
export const {
               selectChip,
               deselectChip,
               moveChip,
               setHighlightedField,
               resetHighlightedField,
               setCurrentTeam
             } = boardSlice.actions;

export const selectChips = (state: RootState) => state.board.chips;
export const selectOccupied = (state: RootState) => state.board.occupied;
export const selectActiveChips = createSelector([selectTeams, selectChips], (teams, chips) =>
  chips.filter(chip => teams[chip.teamId]?.active));
export const selectCurrentChip = (state: RootState) => state.board.selected;
export const selectHighlighted = (state: RootState) => state.board.highlighted;
export const selectCurrentTeam = (state: RootState) => state.settings?.teams[state.board.current];
