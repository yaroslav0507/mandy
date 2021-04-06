import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState }                  from '../../store';

export interface ITeam {
  id: number;
  active: boolean;
  name: string;
  color: string;
  start: number[][];
  home: number[][];
  doors: number[];
}

export interface ITeams {
  [id: number]: ITeam;
}

export const teamsConfig: ITeam[] = [{
  id: 0,
  active: true,
  name:   'Player 1',
  color:  '#00b894',
  start:  [[7, 8], [7, 9], [7, 10], [7, 11]],
  home:   [[6, 8], [6, 9], [6, 10], [6, 11]],
  doors:  [6, 12]
}, {
  id: 1,
  active: true,
  name:   'Player 2',
  color:  '#0984e3',
  start:  [[4, 7], [3, 7], [2, 7], [1, 7]],
  home:   [[1, 6], [2, 6], [3, 6], [4, 6]],
  doors:  [0, 6]

}, {
  id: 2,
  active: true,
  name:   'Player 3',
  color:  '#fdcb6e',
  start:  [[5, 4], [5, 3], [5, 2], [5, 1]],
  home:   [[6, 4], [6, 3], [6, 2], [6, 1]],
  doors:  [6, 0]
}, {
  id: 3,
  active: true,
  name:   'Player 4',
  color:  '#d63031',
  start:  [[8, 5], [9, 5], [10, 5], [11, 5]],
  home:   [[8, 6], [9, 6], [10, 6], [11, 6]],
  doors:  [12, 6]
}];

export interface ISettingsState {
  teams: ITeam[];
}

const initialState: ISettingsState = JSON.parse(JSON.stringify({
  teams: teamsConfig
}));

export const settingsSlice = createSlice({
  name:     'settings',
  initialState,
  reducers: {
    toggleTeam(state, { payload: teamId }: PayloadAction<number>) {
      if (teamId !== undefined) {
        state.teams[teamId].active = !state.teams[teamId].active;
      }
    }
  }
});

// Action creators are generated for each case reducer function
export const { toggleTeam } = settingsSlice.actions;

export const selectTeams = (state: RootState) => state.settings.teams;
export const selectCurrentTeam = (state: RootState) => state.settings?.teams[state.board?.selected?.teamId];
