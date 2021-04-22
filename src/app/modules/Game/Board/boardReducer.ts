import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState }                        from '../../../store';
import { ITeams, selectTeams, teamsConfig } from '../../Settings/settingsReducer';
import { createSelector }                   from 'reselect';

type TMapCoords = number[];

export interface IChip {
  id: number;
  teamId: number;
  position: number[];
}

export interface IMapState {
  chips: IChip[];
  occupied: ICoordinates<IChip[]>;
  selected: IChip;
  highlighted: TMapCoords;
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
  team.start.forEach((position, id) => chips.push({
    id,
    teamId: team.id,
    position
  }));
});

const generateChipsPositionMap = (items: IChip[] = chips): ICoordinates<IChip[]> => {
  const chipsMap: ICoordinates<IChip[]> = {};

  items.forEach((chip) => {
    const [x, y] = chip.position;

    const occupied = chipsMap[x] && chipsMap[x][y] && chipsMap[x][y];
    const occupiedByTeammate = occupied && occupied[0] && occupied[0].teamId === chip.teamId;

    chipsMap[x] = {
      ...chipsMap[x],
      [y]: occupiedByTeammate ? [...occupied, chip] : [chip]
    };
  });

  return chipsMap;
};

const initialState: IMapState = JSON.parse(JSON.stringify({
  chips,
  occupied   : generateChipsPositionMap(chips),
  selected   : { id: 0, position: [] },
  highlighted: []
}));

export const boardSlice = createSlice({
  name    : 'map',
  initialState,
  reducers: {
    selectChip(state, { payload }: PayloadAction<IChip | undefined>) {
      if (payload) {
        const isOccupied = ([x, y]: number[]) => state.occupied[x] && state.occupied[x][y];
        const target = isOccupied(payload.position);
        const figure = target && target.find(chip => chip.id === payload.id);
        state.selected = figure || state.selected;
      }
    },
    deselectChip(state) {
      state.selected.id = -1;
      state.selected.teamId = -1;
      state.selected.position = [];
    },
    setHighlightedField(state, action: PayloadAction<number[]>) {
      state.highlighted = action.payload;
    },
    resetHighlightedField(state) {
      state.highlighted = [];
    },
    moveChip(state, action: PayloadAction<TMapCoords>) {
      if (state?.selected?.position?.length) {
        const { selected: { teamId, position } } = state;

        if (position) {
          const [moveFromX, moveFromY] = position;
          const moveTo = action.payload;
          const [moveToX, moveToY] = moveTo;

          const targetChips = ([x, y]: number[]) => state.occupied[x] && state.occupied[x][y] && state.occupied[x][y];
          const isOccupied = ([x, y]: number[]) => targetChips([x, y])?.[0];
          const targetChip = isOccupied(moveTo);
          const startPosition: any = targetChip && teamsConfig[targetChip.teamId].start.find(position => !isOccupied(position));

          const checkMovement = ({ position: [x, y], id }: IChip) => (x === moveFromX && y === moveFromY && id === state.selected.id) ? moveTo : [x, y];
          const sendToStart = ({ position: [x, y], id }: IChip) => (x === moveToX && y === moveToY) ? startPosition : [x, y];

          const chips = state.chips.map((chip) => {
            if (chip.position[0] === moveToX && chip.position[1] === moveToY && chip.teamId !== teamId) {
              return {
                ...chip,
                position: sendToStart(chip)
              };
            } else {
              return {
                ...chip,
                position: checkMovement(chip)
              };
            }
          });

          state.chips = chips;
          state.selected.teamId = teamId;
          state.selected.position = moveTo;
          state.occupied = generateChipsPositionMap(chips);
        }
      } else {
        console.log('Cannot move unselected figure');
      }
    }
  }
});

// Action creators are generated for each case reducer function
export const { selectChip, deselectChip, moveChip, setHighlightedField, resetHighlightedField } = boardSlice.actions;

export const selectChips = (state: RootState) => state.board.chips;
export const selectOccupied = (state: RootState) => state.board.occupied;
export const selectActiveChips = createSelector([selectTeams, selectChips], (teams, chips) =>
  chips.filter(chip => teams[chip.teamId]?.active));
export const selectCurrentChip = (state: RootState) => state.board.selected;
export const selectHighlighted = (state: RootState) => state.board.highlighted;
