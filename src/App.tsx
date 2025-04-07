import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import Home from './pages/Home';

const App: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  // Aplicar classe ao body para ajudar com alguns estilos CSS
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkTheme]);

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Home toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
    </ThemeProvider>
  );
};

export default App; 