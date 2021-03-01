import { createGlobalStyle } from 'styled-components';
import { reset }             from 'styled-reset';
import '../fonts/index.css';
import { theme }             from './theme';

export const BaseStyles = createGlobalStyle`
  ${reset}

  *, *:before, *:after {
    box-sizing: border-box;
  }
  
  body {
    font-family: "Jost", "Roboto", "Helvetica", "Arial", sans-serif;
  }

  a {
    color           : ${theme.colors.darkGrey};
    text-decoration : none;
  }

  a:hover {
    color: ${theme.colors.grey};
  }

  input::-ms-clear,
  input::-ms-reveal {
    display : none;
    height  : 0;
    width   : 0;
  }

  .hidden {
    position : absolute;
    width    : 0;
    height   : 0;
    opacity  : 0;
    padding  : 0;
    margin   : 0;
    border   : none;
    outline  : none;
  }

  .disabled {
    opacity : .7;
    cursor  : default;
  }

  fieldset {
    min-width : 0;
    max-width : 100%;
    width     : 100%;
  }

  *:focus {
    outline: none;
  }

  fieldset:disabled .MuiInput-underline::before {
    border-bottom: none !important;
  }

  .MuiTableRow-head .MuiTableCell-head {
    white-space: pre;
  }

  .MuiPickersDay-dayDisabled {
    opacity: .5;
  }

  .padding-0 {
    padding: 0 !important;
  }

  .not-implemented {
    position : relative;
    z-index  : 1;
  }

  .not-implemented:before {
    content        : '';
    position       : absolute;
    top            : 0;
    left           : 0;
    z-index        : 9999;
    width          : 100%;
    height         : 100%;
    opacity        : .45;
    border-radius  : inherit;
    pointer-events : none;
    background     : repeating-linear-gradient(135deg, #d0d0d0, #d0d0d0 10px, #ffffff00 10px, #ffffff00 20px);
  }

  .not-implemented:after {
    display : block;
    content : "";
    clear   : both;
  }
`;