import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState }                  from '../../../store';

type TMapCoords = number[];

export interface IChip {
  teamId: number;
  position: number[];
}

export interface ITeam {
  active: boolean;
  name: string;
  color: string;
  start: number[][];
  home: number[][];
}

export interface ITeams {
  [id: number]: ITeam;
}

interface IMapState {
  chips: IChip[];
  teams: ITeams;
  occupied: ICoordinates<IChip>;
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

export const isFieldAccessible = (x: number, y: number) => !!map[x][y];

export const teamsConfig: ITeam[] = [{
  active: true,
  name  : 'Player 1',
  color : '#fdcb6e',
  start : [[5, 4], [5, 3], [5, 2], [5, 1]],
  home  : [[6, 4], [6, 3], [6, 2], [6, 1]]
}, {
  active: true,
  name  : 'Player 2',
  color : '#00b894',
  start : [[7, 8], [7, 9], [7, 10], [7, 11]],
  home  : [[6, 8], [6, 9], [6, 10], [6, 11]]
}, {
  active: true,
  name  : 'Player 3',
  color : '#0984e3',
  start : [[1, 7], [2, 7], [3, 7], [4, 7]],
  home  : [[1, 6], [2, 6], [3, 6], [4, 6]]
}, {
  active: true,
  name  : 'Player 4',
  color : '#d63031',
  start : [[8, 5], [9, 5], [10, 5], [11, 5]],
  home  : [[8, 6], [9, 6], [10, 6], [11, 6]]
}];

const teams: ITeams = {};
const chips: IChip[] = [];

teamsConfig.forEach((team, teamId) => {
  teams[teamId] = team;
  team.start.forEach(position => chips.push({
    teamId: teamId,
    position
  }));
});

const generateChipsPositionMap = (items: IChip[] = chips): ICoordinates<IChip> => {
  const chipsMap: ICoordinates<IChip> = {};

  items.forEach((chip) => {
    const [x, y] = chip.position;

    chipsMap[x] = {
      ...chipsMap[x],
      [y]: chip
    };
  });

  return chipsMap;
};

const initialState: IMapState = JSON.parse(JSON.stringify({
  chips,
  teams,
  occupied   : generateChipsPositionMap(chips),
  selected   : { position: [] },
  highlighted: []
}));

export const boardSlice = createSlice({
  name    : 'map',
  initialState,
  reducers: {
    selectChip(state, action: PayloadAction<TMapCoords>) {
      const isOccupied = ([x, y]: number[]) => state.occupied[x] && state.occupied[x][y];
      state.selected = isOccupied(action.payload);
    },
    deselectChip(state) {
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
      if (state.selected) {
        const { teams, selected: { teamId, position } } = state;
        const [moveFromX, moveFromY] = position;

        const moveTo = action.payload;
        const [moveToX, moveToY] = action.payload;

        const isOccupied = ([x, y]: number[]) => state.occupied[x] && state.occupied[x][y];
        const targetChip = isOccupied(moveTo);

        const startPosition: any = targetChip && teams[targetChip.teamId].start.find(position => !isOccupied(position));

        if (position) {
          const moveChip = ({ position }: IChip) =>
            (position[0] === moveFromX && position[1] === moveFromY) ? moveTo : position;

          const sendToStart = ({ position }: IChip) =>
            (position[0] === moveToX && position[1] === moveToY) ? startPosition : position;

          const chips = state.chips.map((chip) => {
            const isEnemy = targetChip && chip.teamId !== teamId;

            return {
              ...chip,
              position: isEnemy ? sendToStart(chip) : moveChip(chip)
            };
          });

          state.chips = chips;
          state.selected.position = moveTo;
          state.occupied = generateChipsPositionMap(chips);
        }
      }
    }
  }
});

// Action creators are generated for each case reducer function
export const { selectChip, deselectChip, moveChip, setHighlightedField, resetHighlightedField } = boardSlice.actions;

export const selectTeams = (state: RootState) => state.board.teams;
export const selectCurrentTeam = (state: RootState) => state.board.teams[state.board.selected.teamId];
export const selectChipsMap = (state: RootState) => state.board.occupied;
export const selectActiveChips = (state: RootState) => state.board.chips;
export const selectCurrentChip = (state: RootState) => state.board.selected;
export const selectHighlighted = (state: RootState) => state.board.highlighted;

export default boardSlice.reducer;
