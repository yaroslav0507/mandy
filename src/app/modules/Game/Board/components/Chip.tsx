import styled, { css, keyframes } from 'styled-components';
import React, { FC, useMemo }     from 'react';

interface IChipWrapperProps {
  x: number;
  y: number;
  size: number;
  label?: string;
  margin?: string | number;
  color?: string;
  selected?: boolean;
  relative?: boolean;
  locked?: boolean;
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
    transform: scale(1.1);
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
  box-shadow: 0 0 5px #000000a8;
  
  ${ breakpoints.up('md') } {
    width: 70%;
    height: 70%;
    border-width: 3px;
  }
` }`;

export const ChipWrapper = styled.div<IChipWrapperProps>`${ ({ size, relative, margin = 0, selected, x, y, locked }) => css`
  width: ${ size }px;
  height: ${ size }px;
  position: ${ relative ? 'relative' : 'absolute' };
  transition: ease .3s all;
  margin: ${ margin };
  ${ (x || y) && `
    transform: translate(${ x * size }px, ${ y * size }px);
  ` }
  
  &:hover {
    cursor: pointer;
  
    ${ ChipCircle } {
      box-shadow: 0 0 0 3px ${ locked ? '#0000003b' : '#ffffffde' };
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

const ChipLabel  = styled.div<{size: number}>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-family: 'Jost';
  font-weight: 700;
  font-size: ${ ({size}) => size / 3 }px;
  color: #44484e;
  text-shadow: 0 1px 0 #ffffff85;
  opacity: .3;
`;

export const Chip: FC<IChipWrapperProps> = ({
  color,
  selected,
  relative,
  size,
  margin = 0,
  label,
  x,
  y,
  onClick,
  locked
}) => useMemo(() => (
  <ChipWrapper
    size={ size }
    color="inherit"
    selected={ selected }
    relative={ relative }
    onClick={ onClick }
    margin={ margin }
    label={ label }
    locked={ locked }
    x={ x }
    y={ y }
  >
    <ChipCircle color={ color }/>
    <ChipLabel size={size}>{label}</ChipLabel>
  </ChipWrapper>
), [x, y, size, margin, color, selected]);
