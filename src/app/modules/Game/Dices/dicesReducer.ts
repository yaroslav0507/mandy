import { createSlice }       from '@reduxjs/toolkit'
import { RootState }         from '../../../store';
import { randomDicesResult } from '../utils';

interface IDicesState {
  angles: number[][];
  result: number[];
}

const initialState: IDicesState = {
  angles: [[0, 0], [0, 0]],
  result: []
}

export const dicesSlice = createSlice({
  name    : 'dices',
  initialState,
  reducers: {
    randomize: () => {
      return randomDicesResult();
    }
  }
})

// Action creators are generated for each case reducer function
export const { randomize } = dicesSlice.actions

export const selectDicesAngles = (state: RootState) => state.dices.angles;
export const selectDicesResult = (state: RootState) => state.dices.result;

export default dicesSlice.reducer
