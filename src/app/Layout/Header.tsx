import { AppBar as MuiHeader, Badge, IconButton, Toolbar, } from '@material-ui/core';
import { AppBarProps }                                      from '@material-ui/core/AppBar/AppBar';
import { Menu }                                             from '@material-ui/icons';
import React, { FC }                                        from 'react';
import styled, { css }                                      from 'styled-components';
import { ReactComponent as Logo }                           from '../../images/icons/logo.svg';
import { DRAWER_WIDTH }                                     from './Sidebar';
import { Chip }                                             from '../modules/Game/Board/components/Chip';
import { useAppDispatch, useAppSelector }                   from '../hooks';
import { selectActiveTeams }                 from '../modules/Settings/settingsReducer';
import { deselectChip, selectCurrentTeam, setCurrentTeam } from '../modules/Game/Board/boardReducer';

interface IStyledHeaderProps extends AppBarProps {
  shifted: number;
}

const StyledLogo = styled(Logo)`
  height: 50px;
  width: 50px;
`;

const MenuIcon = styled(Menu)`&& {
  font-size: 30px;
  margin-right: 2px;
}`;

const Section = styled.div`
  display: flex;
  align-items: center;
  min-width: 100px;
  justify-content: flex-end;
  padding-right: 5px;
`;

const LogoSection = styled(Section)``;

const StyledHeader: FC<IStyledHeaderProps> = styled(MuiHeader)`&& ${ ({ shifted, theme: { transitions, breakpoints } }: any) => css`{
  position         : absolute;
  background-color : rgb(38,40,51);
  box-shadow       : none;

  ${ shifted && `width: calc(100% - ${ DRAWER_WIDTH }px)` };

  ${ breakpoints.up('lg') } {
    background-color: transparent;
    
    ${ LogoSection } {
      visibility: hidden;
    }
  }
    
  transition: ${ transitions.create(['margin', 'width'], {
  easing:   shifted ? transitions.easing.easeOut : transitions.easing.sharp,
  duration: shifted ? transitions.duration.enteringScreen : transitions.duration.leavingScreen
}) };
` }`;

const StyledToolbar = styled(Toolbar)`&& {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  padding: 0 15px 0 10px;
}`;

export const StyledBadge = styled(Badge)`&& {
 .MuiBadge-badge {
    right             : 6px;
    top               : 6px;
    font-variant-caps : small-caps;
  }
}`;

interface IHeaderOwnProps {
  isMobile: boolean;
  sidebarOpen: boolean;
  toggleDrawer: () => void;
}

export const Header: FC<IHeaderOwnProps> = ({
  isMobile,
  sidebarOpen,
  toggleDrawer
}) => {
  const dispatch = useAppDispatch();
  const team = useAppSelector(selectCurrentTeam);
  const teams = useAppSelector(selectActiveTeams);

  const setNextPlayer = () => {
    const teamIndex = teams.map(team => team.id).indexOf(team?.id);
    const nextTeamIndex = teamIndex !== teams.length - 1 ? teamIndex + 1 : 0;

    dispatch(deselectChip());
    dispatch(setCurrentTeam(teams[nextTeamIndex]?.id));
  };

  return (
    <StyledHeader shifted={ +(sidebarOpen && !isMobile) }>
      <StyledToolbar
        disableGutters
        variant="dense"
      >
        <LogoSection>
          <IconButton
            color="inherit"
            onClick={ toggleDrawer }
          >
            <MenuIcon/>
          </IconButton>

          <StyledLogo/>
        </LogoSection>

        { team !== undefined && (
          <Section>
            <StyledBadge
              color="primary"
              badgeContent={ '2' }
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={ setNextPlayer }
            >
              <Chip
                x={ 0 }
                y={ 0 }
                size={ 50 }
                selected
                relative
                color={ teams.find(t => t.id === team?.id)?.color }
              />
            </StyledBadge>
          </Section>
        ) }
      </StyledToolbar>
    </StyledHeader>
  );
};
