import styled, { css } from 'styled-components';

export const Field = styled.div<{ empty: boolean; highlighted: boolean; occupied: boolean; }>`
  position: relative;
  transition: background-color .3s ease;
  
  ${ (props) => !props.empty && css`
    background-color: #44484f;
    box-shadow: 0 0 10px #0000006e;
    
    &:after {
      box-shadow: inset 0 0 0px 1px #39e991;
    }
    
    &:hover {
      cursor: pointer;
      background-color: #1f2229;
    }
  `};
  
  ${ (props) => !props.empty && css`
    
  `};
  
  ${ (props) => props.highlighted && css`
    background-color: #1f2229;
  `};
  
  ${ (props) => props.occupied && css`
    background-color: #44484e75;
  `};
  
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;
