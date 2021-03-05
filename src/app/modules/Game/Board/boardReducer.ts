import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState }                  from '../../../store';

type TMapCoords = number[];

export interface IChip {
  team: number;
  name: string;
  color: string;
  active: boolean;
  current: number[];
  start: number[];
  home: number[][];
}

interface IMapState {
  chips: IChip[];
  map: ICoordinates<IChip>;
  selected: TMapCoords;
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

export const players = [{
  team  : 1,
  active: true,
  name  : 'Player 1',
  color : '#fdcb6e',
  chips : [[5, 4], [5, 3], [5, 2], [5, 1]],
  home  : [[6, 4], [6, 3], [6, 2], [6, 1]]
}, {
  team  : 2,
  active: true,
  name  : 'Player 2',
  color : '#00b894',
  chips : [[7, 8], [7, 9], [7, 10], [7, 11]],
  home  : [[6, 8], [6, 9], [6, 10], [6, 11]]
}, {
  team  : 3,
  active: true,
  name  : 'Player 3',
  color : '#0984e3',
  chips : [[1, 7], [2, 7], [3, 7], [4, 7]],
  home  : [[1, 6], [2, 6], [3, 6], [4, 6]]
}, {
  team  : 4,
  active: true,
  name  : 'Player 4',
  color : '#d63031',
  chips : [[8, 5], [9, 5], [10, 5], [11, 5]],
  home  : [[8, 6], [9, 6], [10, 6], [11, 6]]
}];

const chips: IChip[] = players.map(player => player.chips.map(chip => ({
  team   : player.team,
  name   : player.name,
  color  : player.color,
  active : player.active,
  current: chip,
  start  : chip,
  home   : player.home
}))).flat();

const generateChipsPositionMap = (items: IChip[] = chips): ICoordinates<IChip> => {
  const chipsMap: ICoordinates<IChip> = {};

  items.forEach((chip) => {
    const [x, y] = chip.current;

    chipsMap[x] = {
      ...chipsMap[x],
      [y]: chip
    };
  });

  return chipsMap;
};

const initialState: IMapState = JSON.parse(JSON.stringify({
  chips,
  players,
  map     : generateChipsPositionMap(),
  selected: [],
  highlighted: []
}));

export const boardSlice = createSlice({
  name    : 'map',
  initialState,
  reducers: {
    selectChip(state, action: PayloadAction<TMapCoords>) {
      state.selected = action.payload;
    },
    deselectChip(state) {
      state.selected = [];
    },
    setHighlightedField(state, action: PayloadAction<number[]>) {
      state.highlighted = action.payload;
    },
    resetHighlightedField(state) {
      state.highlighted = [];
    },
    moveChip(state, action: PayloadAction<TMapCoords>) {
      const moveFrom = state.selected;
      const [moveFromX, moveFromY] = moveFrom;

      const moveTo = action.payload;
      const [moveToX, moveToY] = action.payload;

      const currentChip = moveFrom && state.map[moveFromX][moveFromY];
      const targetChip = state.map[moveToX] && state.map[moveToX][moveToY];

      if (moveFrom && currentChip) {
        const moveChip = ({ current }: IChip) =>
          (current[0] === moveFromX && current[1] === moveFromY) ? moveTo : current;

        const sendToStart = ({ current }: IChip) =>
          (current[0] === moveToX && current[1] === moveToY) ? targetChip.start : current;

        const chips: IChip[] = state.chips.map((chip) => {
          const isEnemy = targetChip && chip.team !== currentChip.team;

          return {
            ...chip,
            current: isEnemy ? sendToStart(chip) : moveChip(chip)
          };
        });

        state.chips = chips;
        state.map = generateChipsPositionMap(chips);
        state.selected = moveTo;
      }
    }
  }
});

// Action creators are generated for each case reducer function
export const { selectChip, deselectChip, moveChip, setHighlightedField, resetHighlightedField } = boardSlice.actions;

export const selectChipsMap = (state: RootState) => state.board.map;
export const selectActiveChips = (state: RootState) => state.board.chips;
export const selectCurrentChip = (state: RootState) => state.board.selected;
export const selectHighlighted = (state: RootState) => state.board.highlighted;

export default boardSlice.reducer;
