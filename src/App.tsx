import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import Home from './pages/Home';

const App: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Home toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
    </ThemeProvider>
  );
};

export default App; 