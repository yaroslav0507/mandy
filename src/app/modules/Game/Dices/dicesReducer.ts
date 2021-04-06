import { createSlice }  from '@reduxjs/toolkit';
import { RootState }    from '../../../store';
import { randomNumber } from '../../../shared/functions';

const angleToResult = (xAngle: number, yAngle: number) => {
  const spinMap: { [key: number]: number[] } = {
    0: [1, 3, 6, 4],
    1: [2, 2, 2, 2],
    2: [6, 4, 1, 3],
    3: [5, 5, 5, 5]
  };

  const spins = (degX: number, degY: number) => ({ a: (degX / 90) % 4, b: (degY / 90) % 4 });
  const { a, b } = spins(xAngle, yAngle);
  return spinMap[a] && spinMap[a][b];
};

const rollDices = () => {
  const result: number[][] = [];
  // specifying number of spins
  const min = 1;
  const max = 16;

  for (let i = 0; i < 2; i++) {
    const randomAngle = (max: number, min: number) => {
      return randomNumber(min, max) * 90;
    };

    const xRand = randomAngle(max, min);
    const yRand = randomAngle(max, min);

    result.push([xRand, yRand]);
  }

  return result;
};

interface IDicesState {
  angles: number[][];
  result: number[];
}

const initialState: IDicesState = {
  angles: [[0, 0], [0, 0]],
  result: [1, 1]
};

export const dicesSlice = createSlice({
  name    : 'dices',
  initialState,
  reducers: {
    randomize() {
      const angles = rollDices();
      const [dice1Angles, dice2Angles] = angles;
      const result = [
        angleToResult(dice1Angles[0], dice1Angles[1]),
        angleToResult(dice2Angles[0], dice2Angles[1]),
      ];

      return {
        angles,
        result
      };
    }
  }
});

// Action creators are generated for each case reducer function
export const { randomize } = dicesSlice.actions;

export const selectDicesAngles = (state: RootState) => state.dices.angles;
export const selectDicesResult = (state: RootState) => state.dices.result;
