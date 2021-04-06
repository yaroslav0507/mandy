import React, { FC }                                             from 'react';
import { Card, CardContent, FormControlLabel, Grid, Typography } from '@material-ui/core';
import { useAppDispatch, useAppSelector }                        from '../../hooks';
import { Chip }                                                  from '../Game/Board/components/Chip';
import { StyledBadge }                                           from '../../Layout/Header';
import styled                                                    from 'styled-components';
import { theme }                                                 from '../../../styles';
import { IOSSwitch }                      from '../../shared/components/Select';
import { ITeam, selectTeams, toggleTeam } from './settingsReducer';

const StyledCard = styled(Card)`&& {
  background-color: ${ theme.colors.black };
  color: #fff;
  
  .MuiCardContent-root {
    padding-bottom: 16px;
  }
}`;

const TeamControls = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  
  .MuiFormControlLabel-label {
    color: #fff;
  }
  
  ${ StyledBadge } {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
`;

export const Settings: FC = () => {
  const teams = useAppSelector(selectTeams);
  const dispatch = useAppDispatch();

  const renderPlayerControls = (team: ITeam) => (
    <FormControlLabel
      control={
        <IOSSwitch
          checked={ team.active }
          onChange={ () => dispatch(toggleTeam(team.id)) }
          name="checkedB"
        />
      }
      label={ team.active ? 'Enabled' : 'Disabled' }
    />
  );

  return (
    <Grid
      container
      spacing={ 4 }
    >
      { teams?.map((team, index) => (
        <Grid
          item
          key={ index }
          xs={ 12 }
          md={ 6 }
        >
          <StyledCard>
            <CardContent>
              <Grid container>
                <Grid
                  item
                  xs={ 4 }
                  alignContent="center"
                  alignItems="center"
                >
                  <TeamControls>
                    <StyledBadge
                      color="primary"
                      aria-controls="user-menu"
                      aria-haspopup="true"
                    >
                      <Chip
                        x={ 0 }
                        y={ 0 }
                        size={ 75 }
                        selected
                        relative
                        color={ team?.color }
                      />
                    </StyledBadge>
                  </TeamControls>
                </Grid>

                <Grid
                  item
                  xs={ 8 }
                >
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="h4"
                  >
                    { team.name }
                  </Typography>

                  { renderPlayerControls(team) }
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      )) }
    </Grid>
  );
};
