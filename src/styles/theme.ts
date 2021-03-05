export type TThemeColor =
  | 'primary'
  | 'secondary'
  | 'action'
  | 'disabled'
  | 'error'
  | 'warning'
  | 'info'
  | 'success'
  | 'white'
  | 'black'
  | 'grey'
  | 'lightGrey'
  | 'darkGrey';

export interface ITheme {
  colors: {
    [key in TThemeColor]: string;
  };
}

export const theme: ITheme = {
  colors: {
    primary: '#34b97a',
    secondary: '#fac05e',
    action: '#69818b',
    disabled: '#606060',
    error: '#f44336',
    warning: '#e4572e',
    info: '#2c3f69',
    success: '#55bd59',
    black: '#272932',
    white: '#ffffff',
    grey: '#ebf1f6',
    lightGrey: '#f7fafd',
    darkGrey: '#8d91a5',
  },
};
