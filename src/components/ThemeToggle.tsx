import React from 'react';
import styled from 'styled-components';

interface ThemeToggleProps {
  toggleTheme: () => void;
  isDarkTheme: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ toggleTheme, isDarkTheme }) => {
  return (
    <ToggleButton onClick={toggleTheme}>
      {isDarkTheme ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M12 1V3" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M12 21V23" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M4.22 4.22L5.64 5.64" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M18.36 18.36L19.78 19.78" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M1 12H3" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M21 12H23" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M4.22 19.78L5.64 18.36" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M18.36 5.64L19.78 4.22" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M21 12.79C20.8427 14.4922 20.2037 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0794 20.7461C8.41082 20.3741 6.88787 19.5345 5.67516 18.3218C4.46246 17.1091 3.62288 15.5861 3.25091 13.9175C2.87894 12.2489 2.98968 10.509 3.57046 8.90123C4.15123 7.29345 5.17786 5.88435 6.53023 4.83878C7.8826 3.79321 9.50481 3.15424 11.207 3M21 12.79C21 11.9584 20.8548 11.1346 20.5731 10.3562C20.2915 9.57785 19.8783 8.85842 19.357 8.2294C18.8358 7.60039 18.216 7.07231 17.5258 6.67111C16.8355 6.26992 16.0873 6.00247 15.312 5.884C14.5366 5.76552 13.7468 5.7939 12.9831 5.96752C12.2194 6.14114 11.4968 6.45669 10.854 6.89608C10.2112 7.33547 9.6608 7.89093 9.2321 8.53328C8.8034 9.17564 8.5051 9.89347 8.354 10.647M21 21L3 3L21 21Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      )}
    </ToggleButton>
  );
};

const ToggleButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.accent};
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    color: ${({ theme }) => theme.accentLight};
    background-color: ${({ theme }) => theme.background};
  }
`;

export default ThemeToggle; 