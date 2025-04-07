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
    transition: background-color 0.5s ease, color 0.3s ease;
    overflow-x: hidden;
    background-image: ${({ theme }) => theme.backgroundPattern};
    background-attachment: fixed;
  }

  ::selection {
    background: ${({ theme }) => theme.accent}88;
    color: #ffffff;
  }

  button {
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.3s ease;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  input, button {
    outline: none;
    border: none;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  
  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.accent}66;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.accent};
  }
`; 