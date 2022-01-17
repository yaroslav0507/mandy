import React, { ReactNode, useEffect, useState } from 'react';
import styled, { css }                           from 'styled-components';
import { debounce }                              from '../shared/functions';
import { Header }                                from './Header';
import { Sidebar }                               from './Sidebar';

const hideSidebarScreenWidth = 1280;
const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  || window.innerWidth <= hideSidebarScreenWidth;

const Wrapper = styled.div`
  flex-grow: 1;
  height: calc(100vh - env(safe-area-inset-top, 0));
`;

const AppFrame = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  position: relative;
`;

const MainContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;
  position: relative;
  overflow-y: auto;
  padding: 93px 16px 16px;
  color: #fff;
  background-color: #202227;

  ${ ({ isDesktop, leftDrawerOpen, theme }: any) =>
  isDesktop && css`
      transition: ${ theme.transitions.create('all', {
    easing  : leftDrawerOpen
              ? theme.transitions.easing.easeOut
              : theme.transitions.easing.sharp,
    duration: leftDrawerOpen
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
  }) };

  ${ leftDrawerOpen && css`
      margin-left: 0;
    ` };
  ` };

  ${ ({ theme: { breakpoints, spacing } }) => css`
    ${ breakpoints.up('sm') } {
      padding-left: ${ spacing(3) }px;
      padding-right: ${ spacing(3) }px;
    } ;
  ` }
` as any;

interface ILayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const [drawerOpened, setDrawerOpened] = useState(!isMobile());

  const toggleLeftDrawerState = () => {
    setDrawerOpened(!drawerOpened);
  };

  const handleSidebarCheck = debounce((isDrawerOpened: boolean) => {
    if (window.innerWidth <= hideSidebarScreenWidth) {
      if (isDrawerOpened) {
        setDrawerOpened(false);
      }
    } else {
      setDrawerOpened(true);
    }
  }, 300);

  useEffect(() => {
    if (!isMobile()) {
      handleSidebarCheck(drawerOpened);
      window.addEventListener('resize', () => handleSidebarCheck(drawerOpened));
    }

    return () => {
      if (!isMobile()) {
        window.removeEventListener('resize', () => handleSidebarCheck(drawerOpened));
      }
    };
  }, [window.innerWidth]);

  return (
    <Wrapper>
      <AppFrame>
        <Header
          isMobile={ isMobile() }
          sidebarOpen={ drawerOpened }
          toggleDrawer={ toggleLeftDrawerState }
        />

        <Sidebar
          isMobile={ isMobile() }
          sidebarOpen={ drawerOpened }
          toggleDrawer={ toggleLeftDrawerState }
        />

        <MainContent
          isDesktop={ !isMobile() }
          leftDrawerOpen={ drawerOpened }
        >
          { children }
        </MainContent>
      </AppFrame>
    </Wrapper>
  );
};
