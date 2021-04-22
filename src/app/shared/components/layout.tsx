import { Grid } from '@material-ui/core';
import React    from 'react';

export const GridItem = ({children, ...rest}: any) => <Grid item { ...rest }>{ children }</Grid>;

export const GridContainer = ({children, ...rest}: any) => <Grid container { ...rest }>{ children }</Grid>;
