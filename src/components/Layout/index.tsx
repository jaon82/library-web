import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Header from './Header';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#004b50',
    },
  },
  overrides: {
    MuiTableSortLabel: {
      icon: {
        opacity: 0.1,
      },
    },
  },
});
theme = responsiveFontSizes(theme);

const Layout: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header />
        {children}
      </Container>
    </ThemeProvider>
  );
};

export default Layout;
