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

export const Chip = styled.div`
  width: 70%;
  height: 70%;
  border-radius: 100%;
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: 3px solid #00000030;
  transition: ease .3s all;
`;

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
    ${ Chip } {
      box-shadow: 0 0 0 3px #ffffffde;
      animation: ${bounce} 2s linear infinite;
    }
  `}
`}`;
