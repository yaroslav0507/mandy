import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { dicesSlice }                          from './modules/Game/Dices/dicesReducer';
import { boardSlice }                          from './modules/Game/Board/boardReducer';

export const store = configureStore({
  reducer: {
    dices: dicesSlice.reducer,
    board: boardSlice.reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
  RootState,
  unknown,
  Action<string>>;
