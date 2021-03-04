import React, { FC }   from 'react';
import styled, { css } from 'styled-components';

const legendColor = '#2bb36f';
const legendWidth = 5;

const commonPseudoElementProps = (breakpoints: { up: (size: string) => string }) => `
    content: '';
    position: absolute;
    border: solid black;
    border-width: 0 ${ legendWidth - 2 }px ${ legendWidth - 2 }px 0;
    border-radius: 0 ${ legendWidth }px;
    border-color: ${ legendColor };
    display: inline-block;
    padding: 4px;
    z-index: 1;
    
    ${ breakpoints.up('md') } {
      border-width: 0 ${ legendWidth }px ${ legendWidth }px 0;
    }
`;

const Line = styled.div`${ ({ theme: { breakpoints } }: any) => css`
  position: absolute;
  width: ${ legendWidth - 2 }px;
  background: linear-gradient(#2e323a, ${ legendColor }, #0f6b5c);
  opacity: .5;
  transition: opacity .3s ease;
  
  &.active {
    opacity: 1;
  }
  
  &:after {
     ${ commonPseudoElementProps(breakpoints) };
     transform: rotate(45deg);
     left: -4px;
     bottom: 0;
  }
  
  ${ breakpoints.up('md') } {
      width: ${ legendWidth }px;
  }
`}`;

const Line2 = styled(Line)`
  transform-origin: top;
  transform: rotate(-90deg);
`;

const ArcWrapper = styled.div`${ ({ color, theme: { breakpoints } }: any) => css`
   position: relative;
   opacity: .5;
   transition: opacity .3s ease;
   
   &.active {
     opacity: 1;
   }
   
   &:before, &:after {
      ${ commonPseudoElementProps(breakpoints) };
   }
   
   &:before {
      transform: rotate(135deg);
      bottom: -4px;
   }
   
   &:after {
      transform: rotate(-135deg);
      top: 0;
      right: -4px;
   }
`}`;

const Arc = styled.div`${ ({ color, theme: { breakpoints } }: any) => css`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  &:after, &:before {
    content: '';
    position: absolute;
    border-radius: 100%;
  }
  
  &:after {
    right: ${legendWidth - 3}px;
    bottom: ${legendWidth - 3}px;
    background: #262a33;
    
    ${ breakpoints.up('md') } {
      right: ${legendWidth - 1}px;
      bottom: ${legendWidth - 1}px;
    }
  }

  &:before {
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #000, ${ legendColor }, #000);
  }
`}`;

const GameBoardLegendQuarter = styled.div<{ index: number }>`${ ({ index }) => css`
  position: absolute;
  width: 50%;
  height: 50%;
  float: left;
  transform-origin: right bottom;
  transform: rotate(${ index * 90 }deg);
` }`;

const GameBoardLegend = styled.div<{ size: number }>`${ ({ size }) => css`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  color: ${ legendColor };
  
  ${ Line }  {
    height: ${ size * 2 }px;
    top: ${ size * 1.5 }px;
    left: ${ size * 4.5 }px;
  }
  
  ${ Line2 } {
    height: ${ size * 2 }px;
    left: ${ size * 1.5 }px;
    top: ${ size * 4.5 }px;
  }
  
  ${ ArcWrapper } {
    margin: ${ size * 1.5 }px;
    width: ${ size * 2 }px;
    height: ${ size * 2 }px;
    
    ${ Arc } {
      &:after, &:before {
        width: ${ size * 4 }px;
        height: ${ size * 4 }px;
      }
    }
  }
` }`;

export const Legend: FC<{ size: number }> = ({ size }) => (
  <GameBoardLegend size={ size }>
    { ['a', 'b', 'c', 'd'].map((sector: string, index: number) => (
      <GameBoardLegendQuarter
        key={ index }
        index={ index }
      >
        <Line/>
        <ArcWrapper>
          <Arc/>
        </ArcWrapper>
        <Line2/>
      </GameBoardLegendQuarter>
    )) }
  </GameBoardLegend>
);
