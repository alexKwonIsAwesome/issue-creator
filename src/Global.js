import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Noto Sans KR', sans-serif;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html, body {
    margin: 0px;
    padding: 0px;
    height: 100%;
  }

  #root {
    height: 100%;
  }

  a {
    text-decoration: none;
  }
`;

export default GlobalStyle;
