import { Tab, Tabs }                                                     from '@material-ui/core';
import React, { ChangeEvent, FC, memo, ReactNode, useCallback, useMemo } from 'react';
import { useHistory, useLocation }                                       from 'react-router-dom';
import styled                                                            from 'styled-components';

// HiddenTab is used to prevent console error when
// current route doesn't match any of the tabs values
const HiddenTab = styled(Tab)`&& {
  display: none;
}`;

export interface IRouterDrivenTab {
  link: string;
  label: ReactNode;
  icon?: JSX.Element;
  color?: string;
  component: JSX.Element;
  onClose?: (link: string) => void;
}

interface IRouterDrivenTabsProps {
  tabs: IRouterDrivenTab[];
  baseURL: string;
}

export const RouterDrivenTabsBase: FC<IRouterDrivenTabsProps> = ({
                                                                   tabs,
                                                                   baseURL,
                                                                 }) => {
  const { push } = useHistory();
  const { pathname } = useLocation();
  const page = pathname.replace(`${ baseURL }/`, '');

  const currentTab = useMemo(
    () => tabs.find(tab => tab.link === page),
    [page, tabs]
  );

  const handleChangeTab = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-types
    (_event: ChangeEvent<{}>, tabLink: string) => {
      push(`${ baseURL }/${ tabLink }`);
    },
    [baseURL, push]
  );

  const a11yProps = useCallback(
    (tabLink: string) => ({
      id             : `tab-${ tabLink }`,
      'aria-controls': `tabpanel-${ tabLink }`,
    }),
    []
  );

  return (
    <>
      <Tabs
        value={ currentTab ? page : '' }
        onChange={ handleChangeTab }
        variant="scrollable"
        centered={ false }
        scrollButtons="on"
        TabIndicatorProps={ {
          style: {
            height: '3px'
          }
        } }
      >
        <HiddenTab value=""/>

        { tabs.map(
          (tab, index) =>
            <Tab
              { ...a11yProps(tab.link) }
              key={ `${ tab.link }-${ index }` }
              icon={ tab.icon }
              value={ tab.link }
              label={ tab.label }
            />
        ) }
      </Tabs>

      { currentTab?.component }
    </>
  );
};

export const RouterDrivenTabs = memo(RouterDrivenTabsBase);
