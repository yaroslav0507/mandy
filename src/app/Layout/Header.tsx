import { AppBar as MuiHeader, Badge, IconButton, Menu as MuiMenu, MenuItem, Toolbar, } from '@material-ui/core';
import { AppBarProps }                                                                 from '@material-ui/core/AppBar/AppBar';
import { Menu }                                                                        from '@material-ui/icons';
import React, { FC, useRef }                                                           from 'react';
import styled, { css }                                                                 from 'styled-components';
import { ReactComponent as Logo }                                                      from '../../images/icons/logo.svg';
import mockUserImage
                                                                                       from '../../images/mock/main-profile-icon.jpg';
import { UserCircle }                                                                  from '../modules/Game/Board/components/UserCircle';
import { DRAWER_WIDTH }                                                                from './Sidebar';

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
  easing  : shifted ? transitions.easing.easeOut : transitions.easing.sharp,
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

const StyledBadge = styled(Badge)`&& {
 .MuiBadge-badge {
    min-width         : 17px;
    height            : 17px;
    right             : 6px;
    top               : 6px;
    font-variant-caps : small-caps;
  }
}`;

const RelativeBadge = styled(StyledBadge)`&& {
 .MuiBadge-badge {
    position: relative;
    top: 10px;
    right: 0;
 }
`;

const MenuAnchor = styled.div`
  visibility: hidden;
  height: 0;
  width: 0;
`;

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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuAnchorRef = useRef(null);
  const handleClick = () => {
    setAnchorEl(menuAnchorRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

        <Section>
          {/*<IconButton*/ }
          {/*  color="inherit"*/ }
          {/*  onClick={ () => rollDices() }*/ }
          {/*>*/ }
          {/*  <DiceIcon src={ iconDice }/>*/ }
          {/*</IconButton>*/ }

          <StyledBadge
            color="secondary"
            badgeContent={ '1' }
            aria-controls="user-menu"
            aria-haspopup="true"
            onClick={ handleClick }
          >
            <UserCircle
              color="#368962"
              image={ mockUserImage }
            />

            <MenuAnchor ref={ menuAnchorRef }/>
          </StyledBadge>

          <MuiMenu
            id="user-menu"
            anchorEl={ anchorEl }
            keepMounted
            open={ Boolean(anchorEl) }
            onClose={ handleClose }
          >
            <MenuItem onClick={ handleClose }>Profile</MenuItem>
            <MenuItem onClick={ handleClose }>Settings</MenuItem>
            <MenuItem onClick={ handleClose }>
              <RelativeBadge
                color="secondary"
                badgeContent={ '1' }
              >
                Notifications
              </RelativeBadge>
            </MenuItem>
            <MenuItem onClick={ handleClose }>Log Out</MenuItem>
          </MuiMenu>
        </Section>
      </StyledToolbar>
    </StyledHeader>
  );
};
