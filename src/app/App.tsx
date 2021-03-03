import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles';
import React, { FC }                         from 'react';
import { BrowserRouter }                     from 'react-router-dom';
import { ThemeProvider }                     from 'styled-components';
import { BaseStyles, muiTheme, theme }       from '../styles';
import { Layout }                            from './Layout/Layout';
import { Routes }                            from './Routes/Routes';
import { Provider }                          from 'react-redux';
import { store }                             from './store';

export const App: FC = () => {
  return (
    <MuiThemeProvider theme={ muiTheme }>
      <ThemeProvider theme={ { ...muiTheme, ...theme } }>
        <Provider store={ store }>
          <BaseStyles/>
          <BrowserRouter>
            <Layout>
              <Routes/>
            </Layout>
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default App;
