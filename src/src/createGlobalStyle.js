import { createGlobalStyle } from 'styled-components'

import bootstrapCss from '../../node_modules/bootstrap/dist/css/bootstrap.css'
import reactDatepickerCss from '../../node_modules/react-datepicker/dist/react-datepicker.css'
import fontAwesomeCss from '../../node_modules/font-awesome/css/font-awesome.css'

export default () => createGlobalStyle`
  ${bootstrapCss}
  ${reactDatepickerCss}
  ${fontAwesomeCss}
  
  body {
    position: relative;
    overflow-y: hidden;
    font-family: Arial, Helvetica, Helvetica Neue;
    font-size: 12px !important;
  }

  .navbar {
    border-radius: 0;
  }

  .control-label {
    color: #757575;
    font-size: 11px;
    font-weight: 500;
    margin-bottom: -2px;
  }

  /* optimize spacing of vertical radios */
  .control-label ~ .radio {
    margin-top: 7px;
  }
  .radio + .radio {
    margin-top: -8px;
    margin-bottom: 0;
  }
  /* make sure radio label is horizontally even with input */
  .radio > label > input[type='radio'] {
    margin-top: 2px;
  }

  .form-control {
    font-size: 12px !important;
  }

  .form-group {
    margin-bottom: 2px;
  }

  .verticalRadioDiv .radio {
    margin-top: 0;
    margin-bottom: -2px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }

  textarea {
    resize: vertical;
    overflow-y: scroll;
  }

  textarea::-webkit-scrollbar {
    display: none;
  }

  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 2px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }

  ::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0);
  }

  /**
  * need to apply this here because
  * this div (button) is built by bootstrap
  */
  #field-filter-dropdown {
    border-radius: 0;
  }

  @media print {
    /**
    * ensure html and body
    * have no margins, no padding,
    * grow and overflow as needed
    */
    html,
    body {
      margin: 0 !important;
      padding: 0 !important;
      height: auto !important;
      overflow: visible !important;
    } /*
    * {
      transition: none !important;
    }*/
  }

  /* SplitPane */

  .SplitPane.vertical {
    height: calc(100vh - 58px) !important;
  }

  @media print {
    #root {
      page-break-after: avoid !important;
      page-break-before: avoid !important;
    }

    .SplitPane.vertical {
      height: auto !important;
      page-break-after: avoid !important;
      page-break-before: avoid !important;
    }

    .Pane.Pane1 {
      display: none;
      width: 0;
      page-break-after: avoid !important;
      page-break-inside: avoid !important;
      page-break-before: avoid !important;
    }

    .Pane.Pane2 {
      page-break-after: avoid !important;
      page-break-before: avoid !important;
    }
  }

  .Resizer {
    background: #000;
    opacity: 0.2;
    z-index: 1;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }

  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }

  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }

  .Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
  }

  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }

  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }
  resizer.disabled {
    cursor: not-allowed;
  }
  resizer.disabled:hover {
    border-color: transparent;
  }

  /* dont make email-links blue */
  a {
    color: #333;
  }
`
