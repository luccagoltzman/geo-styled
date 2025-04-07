import { createGlobalStyle } from 'styled-components';
import { ThemeType } from './theme';

export const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: 'Inter', sans-serif;
    transition: all 0.3s ease-in-out;
  }

  button {
    cursor: pointer;
    font-family: 'Inter', sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  input, button {
    outline: none;
    border: none;
  }
`; 