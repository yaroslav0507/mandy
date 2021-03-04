import styled, { css, keyframes } from 'styled-components';

interface IChipWrapperProps {
  color: string;
  selected: boolean;
  size: number;
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

export const Chip = styled.div`${ ({ color, theme: { breakpoints } }: any) => css`
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
  animation: ${movement} .5s linear 1;
  
  ${ breakpoints.up('md') } {
    width: 70%;
    height: 70%;
    border-width: 3px;
  }
`}`;

export const ChipWrapper = styled.div<IChipWrapperProps>`${ ({ size, color, selected }) => css`
  width: ${size}px;
  height: ${size}px;
  position: absolute;
  transition: ease .3s all;

  ${Chip} {
    background-color: ${color};
  }
  
  &:hover {
    cursor: pointer;
  
    ${ Chip } {
      box-shadow: 0 0 0 3px #ffffffde;
    }
  }
  
  ${selected && css`
    z-index: 1;

    ${ Chip } {
      box-shadow: 0 0 0 3px #ffffffde;
      animation: ${bounce} 2s linear infinite, ${movement} .3s linear 1;
    }
  `}
`}`;
