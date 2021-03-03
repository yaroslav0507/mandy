import styled, { css } from 'styled-components';
import { Chip }        from './Chip';

export const Field = styled.div<{ empty: boolean; selected: boolean; withChip: boolean }>`
  position: relative;
  
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
      
      ${ Chip } {
        box-shadow: 0 0 0 3px #1f2327;
      }
    }
  ` };
  
  ${ (props) => props.selected && css`
    background-color: #1f2229;
    
    ${ Chip } {
      box-shadow: 0 0 0 3px #ffffffde;
    }
    
    &:hover {
     ${ Chip } {
        box-shadow: 0 0 0 3px #ffffffde;
     }
    }
  ` };
  
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  
  &:hover {
    cursor: pointer;
  }
`;
