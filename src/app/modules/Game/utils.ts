import { IPlayer, Player } from './models/Player';
import { randomNumber }    from '../../shared/functions';

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

export const angleToResult = (xAngle: number, yAngle: number) => {
  const spinMap = {
    0: {
      0: 1,
      1: 3,
      2: 6,
      3: 4
    },
    1: {
      0: 2,
      1: 2,
      2: 2,
      3: 2
    },
    2: {
      0: 6,
      1: 4,
      2: 1,
      3: 3
    },
    3: {
      0: 5,
      1: 5,
      2: 5,
      3: 5
    }
  };

  const spins = (degX: number, degY: number) => ({ a: (degX / 90) % 4, b: (degY / 90) % 4 });
  const { a, b } = spins(xAngle, yAngle);
  // @ts-ignore
  return spinMap[a][b]
}

export const rollDices = () => {
  const result: number[][] = [];
  const min = 1;
  const max = 16;

  for (let i = 0; i < 2; i++) {
    const randomAngle = (max: number, min: number) => {
      return randomNumber(min, max) * 90;
    }

    const xRand = randomAngle(max, min);
    const yRand = randomAngle(max, min);

    result.push([xRand, yRand]);
  }

  return result;
}

export const randomDicesResult = () => {
  const angles = rollDices();
  const [dice1Angles, dice2Angles] = angles;
  const result = [
    angleToResult(dice1Angles[0], dice1Angles[1]),
    angleToResult(dice2Angles[0], dice2Angles[1]),
  ];

  return {
    angles,
    result
  }
};

export {
  fieldMap,
  initialCoordinatesMap,
}
