import { CircularProgress }         from '@material-ui/core';
import React, { ComponentType, FC } from 'react';
import styled                       from 'styled-components';

export interface IWithLoaderProps {
  loading?: boolean;
}

const LoaderWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const Loader: FC = () => (
  <LoaderWrapper>
    <CircularProgress/>
  </LoaderWrapper>
);

export const withLoader = <P extends IWithLoaderProps>(
  Component: ComponentType<IWithLoaderProps>
): FC<P> => {
  return function WithLoader({loading, ...props}: IWithLoaderProps) {
    return loading ? <Loader/> : <Component {...props} />;
  };
};
