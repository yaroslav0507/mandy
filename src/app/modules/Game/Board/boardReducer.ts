import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState }                  from '../../../store';
import { IPlayer, Player }            from '../models/Player';
import { IChip }                      from '../models/Chip';

interface IMapCoords {
  x: number;
  y: number;
}

interface IMapState {
  chips: IChipsCoordinates;
  players: IPlayer[];
  selected?: IMapCoords;
}

export interface IChipsCoordinates {
  [x: string]: {
    [y: string]: IPlayer;
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

const initialPlayers = [
  new Player({
    id: '1',
    active: true,
    name : 'Player 1',
    color: '#fdcb6e',
    chips: [
      { x: 5, y: 4 },
      { x: 5, y: 3 },
      { x: 5, y: 2 },
      { x: 5, y: 1 },
    ]
  }),
  new Player({
    id: '2',
    active: true,
    name : 'Player 2',
    color: '#00b894',
    chips: [
      { x: 7, y: 8 },
      { x: 7, y: 9 },
      { x: 7, y: 10 },
      { x: 7, y: 11 },
    ]
  }),
  new Player({
    id: '3',
    active: true,
    name : 'Player 3',
    color: '#0984e3',
    chips: [
      { x: 1, y: 7 },
      { x: 2, y: 7 },
      { x: 3, y: 7 },
      { x: 4, y: 7 },
    ]
  }),
  new Player({
    id: '4',
    active: true,
    name : 'Player 4',
    color: '#d63031',
    chips: [
      { x: 8, y: 5 },
      { x: 9, y: 5 },
      { x: 10, y: 5 },
      { x: 11, y: 5 },
    ]
  })
]

const generateChipsPositionMap = (players: IPlayer[] = initialPlayers) => {
  const chips: IChipsCoordinates = {};

  players.forEach((player) => {
    player.chips.forEach(({ x, y }) => {
      chips[x] = {
        ...chips[x],
        [y]: player
      }
    })
  });

  return chips;
}

const initialState: IMapState = JSON.parse(JSON.stringify({
  players: initialPlayers,
  chips: generateChipsPositionMap(),
}));

export const boardSlice = createSlice({
  name    : 'map',
  initialState,
  reducers: {
    selectChip(state, action: PayloadAction<IMapCoords>) {
      state.selected = action.payload;
    },
    deselectChip(state) {
      state.selected = undefined;
    },
    moveChip(state, action: PayloadAction<IMapCoords>) {
      const { selected } = state;

      if (selected) {
        const player = state.chips[selected.x][selected.y];

        const { x, y } = action.payload;

        const replaceChipPosition = (item: IChip) => (item.x === selected.x && item.y === selected.y) ? ({ x, y }) : item;

        const players = state.players.map((item) => (player && item.id === player.id) ?  {
          ...player,
          chips: player.chips.map(replaceChipPosition)
        } : item);

        state.chips = generateChipsPositionMap(players);
        state.players = players;
        state.selected = undefined;
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { selectChip, deselectChip, moveChip } = boardSlice.actions

export const selectActiveCoords = (state: RootState) => state.board.chips;
export const selectCurrentChip = (state: RootState) => state.board.selected;
export const selectPlayers = (state: RootState) => state.board.players;

export default boardSlice.reducer
