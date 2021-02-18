import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core/styles';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#004b50',
    },
  },
});
theme = responsiveFontSizes(theme);

const Layout: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default Layout;
