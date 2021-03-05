import React, { FC } from 'react';
import { Grid }      from '@material-ui/core';

export const Settings: FC = () => {
  return (
    <Grid
      container
      spacing={ 4 }
    >
      <Grid
        item
        xs={ 12 }
      >
        { 'Settings page' }
      </Grid>
    </Grid>
  );
};
