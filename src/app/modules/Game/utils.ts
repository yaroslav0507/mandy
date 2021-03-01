import { IPlayer, Player } from './models/Player';

const fieldMap = [
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

export interface IBoardChipCoordinates {
  [x: string]: {
    [y: string]: IPlayer;
  }
}

const initialCoordinates = [
  new Player({
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

const initialCoordinatesMap: { [x: string]: { [y: string]: Player } } = {};

initialCoordinates.forEach((player) => {
  player.chips.forEach(({ x, y }) => {
    initialCoordinatesMap[x] = {
      ...initialCoordinatesMap[x],
      [y]: player
    }
  })
});

export {
  fieldMap,
  initialCoordinatesMap
}
