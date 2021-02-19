import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MenuBook from '@material-ui/icons/MenuBook';
import LocalLibrary from '@material-ui/icons/LocalLibrary';
import { useHistory, useLocation } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  navigation: {
    background: 'transparent',
  },
  bottomNavigation: {
    color: '#fff7',
    '&.Mui-selected': {
      color: '#fff',
    },
  },
}));

const Header: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const history = useHistory();
  const location = useLocation();

  const goToBooks = useCallback(() => {
    history.push('/');
  }, [history]);

  const goToAuthors = useCallback(() => {
    history.push('/authors');
  }, [history]);

  useEffect(() => {
    setValue(location.pathname.startsWith('/author') ? 1 : 0);
  }, [location]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Library
          </Typography>
          <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            showLabels
            className={classes.navigation}
          >
            <BottomNavigationAction
              label="Livros"
              icon={<MenuBook />}
              classes={{
                root: classes.bottomNavigation,
              }}
              onClick={goToBooks}
            />
            <BottomNavigationAction
              label="Autores"
              icon={<LocalLibrary />}
              classes={{
                root: classes.bottomNavigation,
              }}
              onClick={goToAuthors}
            />
          </BottomNavigation>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
