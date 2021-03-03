import styled, { css } from 'styled-components';

export const Field = styled.div<{ empty: boolean; selected: boolean; withChip: boolean }>`
  position: relative;
  transition: background-color .3s ease;
  
  ${ (props) => !props.empty && css`
    background-color: #44484f;
    box-shadow: 0 0 10px #0000006e;
    
    &:after {
      box-shadow: inset 0 0 0px 1px #39e991;
    }
  ` };
  
  ${ (props) => (!props.empty || props.withChip) && css`
    &:hover {
      cursor: pointer;
      background-color: #1f2229;
    }
  ` };
  
  ${ (props) => props.selected && css`
    background-color: #1f2229;
  ` };
  
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;
