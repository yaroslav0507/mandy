import { Drawer, IconButton, ListItem, SwipeableDrawer } from '@material-ui/core';
import { Close }                                         from '@material-ui/icons';
import React, { FC, useCallback }                        from 'react';
import { NavLink }                                       from 'react-router-dom';
import styled, { css }                                   from 'styled-components';
import { ReactComponent as IconActivity }                from '../../images/icons/activity-icon.svg';
import { ReactComponent as IconDashboard }               from '../../images/icons/dashboard-icon.svg';
import { ReactComponent as IconFriends }                 from '../../images/icons/user-friends.svg';
import { EAppModule }                                    from '../shared/constants';
import { ReactComponent as GameLogo }                    from '../../images/icons/logo.svg';

export const DRAWER_WIDTH = 270;

const SidebarLogo = styled.img`
  margin: 24px 25px 10px;
  height: 51px;
  width: 118px;
  display: none;
`;

const IconClose = styled(Close)`&& {
  color: #fff;
  font-size: 32px;
}`;

const SidebarHeader = styled.div`
  display: flex;
  margin: 0 5px 7px;
`;

const Wrapper = styled.div`${ ({ theme: { palette, breakpoints } }) => css`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 18px;
  font-weight: 500;
  padding: 9px 0;
  color: ${ palette.common.white };
  background-color: rgb(38, 40, 51);
  
  ${ breakpoints.up('lg') } {
    .MuiButtonBase-root {
      display: none;
    }
    
    ${ SidebarLogo } {
      display: block;
    }
  }
` }`;

const Separator = styled.div`
  height: 0;
  width: calc(100% - 30px);
  border-top: 1px solid #ffffff25;
  margin: 25px auto 23px;
`;

const DrawerStyles = css`
  .MuiDrawer-paper {
    position: relative;
    width: ${ DRAWER_WIDTH }px;
  }
  
  .MuiDrawer-paperAnchorDockedLeft {
    border: none;
  }
`;

const StyledDrawer = styled(Drawer)`
  ${ DrawerStyles }
`;

const StyledSwipeableDrawer = styled(SwipeableDrawer)`
  ${ DrawerStyles }
`;

const MenuItem = styled(ListItem)`&& {
  display: flex;
  width: 100%;
  padding: 9px 33px;
  color: #fff;
  align-items: center;
  line-height: 21px;
  font-weight: 300;
  font-family: 'Lato';

  svg {
    margin-right: 12px;
    width: 24px;
  }
}`;

const Section = styled.div`
  padding: 0;
    
  .selected {
    ${ MenuItem } {
      font-weight: 600;
    }
  }
`;

const StyledGameLogo = styled(GameLogo)`
  width: 120px;
  height: 100px;
  margin: 60px auto;
  max-width: 100%;
`;

interface ISidebarProps {
  sidebarOpen: boolean;
  isMobile: boolean;
  toggleDrawer: () => void;
}

interface IMenuItem {
  icon?: JSX.Element;
  title: string;
  to: string;
}

const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

export const Sidebar: FC<ISidebarProps> = ({ sidebarOpen, isMobile, toggleDrawer }) => {
  const primaryMenu: IMenuItem[] = [{
    icon : <IconDashboard/>,
    title: 'Game',
    to   : `/${ EAppModule.Game }`
  }, {
    icon : <IconActivity/>,
    title: 'Settings',
    to   : '/settings'
  }, {
    icon : <IconFriends/>,
    title: 'How to Play',
    to   : '/rules'
  }];

  const secondaryMenu: IMenuItem[] = [{
    title: 'Help',
    to   : '/help'
  }, {
    title: 'Add Users',
    to   : '/add-users'
  }, {
    title: 'Manage users',
    to   : '/manage-users'
  }];

  const onItemSelected = useCallback(() => {
    if (isMobile) {
      toggleDrawer();
    }
  }, [isMobile, toggleDrawer]);

  const SidebarContent = () => (
    <Wrapper> <SidebarHeader>
      { isMobile ? (
        <IconButton
          color="inherit"
          onClick={ toggleDrawer }
        >
          <IconClose/>
        </IconButton>
      ) : (<StyledGameLogo/>) }
    </SidebarHeader>

      <Section>
        { primaryMenu.map(({ to, title, icon }, index) => (
          <NavLink
            to={ to }
            key={ index }
            activeClassName="selected"
            onClick={ onItemSelected }
          >
            <MenuItem button>
              { icon } { title }
            </MenuItem>
          </NavLink>
        )) }
      </Section>

      <Separator/>

      <Section>
        { secondaryMenu.map(({ to, title }, index) => (
          <NavLink
            key={ index }
            to={ to }
            activeClassName="selected"
            onClick={ onItemSelected }
          >
            <MenuItem button>
              { title }
            </MenuItem>
          </NavLink>
        )) }
      </Section>
    </Wrapper>
  );

  return isMobile ? (
    <StyledSwipeableDrawer
      anchor="left"
      open={ sidebarOpen }
      onOpen={ toggleDrawer }
      onClose={ toggleDrawer }
      disableDiscovery={ iOS }
      disableBackdropTransition={ !iOS }
    >
      <SidebarContent/>
    </StyledSwipeableDrawer>
  ) : (
           <StyledDrawer
             open={ sidebarOpen }
             variant="persistent"
             anchor="left"
           >
             <SidebarContent/>
           </StyledDrawer>
         );
};
