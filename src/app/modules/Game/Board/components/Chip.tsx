import styled, { css, keyframes } from 'styled-components';
import React, { FC }              from 'react';

interface IChipWrapperProps {
  x: number;
  y: number;
  size: number;
  color?: string;
  selected: boolean;
  relative?: boolean;
  onClick?: () => void;
}

const bounce = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const movement = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
`;

export const ChipCircle = styled.div`${ ({ color, theme: { breakpoints } }: any) => css`
  width: 80%;
  height: 80%;
  border-radius: 100%;
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: solid;
  border-color: #00000030;
  border-width: 2px;
  transition: ease .5s all;
  animation: ${ movement } .5s linear 1;
  background-color: ${ color };
  
  ${ breakpoints.up('md') } {
    width: 70%;
    height: 70%;
    border-width: 3px;
  }
` }`;

export const ChipWrapper = styled.div<IChipWrapperProps>`${ ({ size, relative, selected, x, y }) => css`
  width: ${ size }px;
  height: ${ size }px;
  position: ${ relative ? 'relative' : 'absolute' };
  transition: ease .3s all;
  ${ (x || y) && `
    transform: translate(${ x * size }px, ${ y * size }px);
  ` }
  
  &:hover {
    cursor: pointer;
  
    ${ ChipCircle } {
      box-shadow: 0 0 0 3px #ffffffde;
    }
  }
  
  ${ selected && css`
    z-index: 1;

    ${ ChipCircle } {
      box-shadow: 0 0 0 3px #ffffffde;
      animation: ${ bounce } 2s linear infinite, ${ movement } .3s linear 1;
    }
  ` }
` }`;

export const Chip: FC<IChipWrapperProps> = ({
                                              color,
                                              selected,
                                              relative,
                                              size,
                                              x,
                                              y,
                                              onClick
                                            }) => (
  <ChipWrapper
    size={ size }
    color="inherit"
    selected={ selected }
    relative={ relative }
    x={ x }
    y={ y }
    onClick={ onClick }
  >
    <ChipCircle
      color={ color }
      key={ x + y }
    />
  </ChipWrapper>
);
