import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './scenes/';
import * as serviceWorker from './serviceWorker';
import { createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import red from '@material-ui/core/colors/red';
import { SnackbarProvider } from 'notistack';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Accounts from './scenes/accounts/index';
import Apps from './scenes/apps/index';
import Charts from './scenes/charts/index';
import Config from './scenes/config/index';
import Dashboard from './scenes/dashboard/index';
import DefaultPlaces from './scenes/places/Default/index';
import Places from './scenes/places/index';
import SignInPage from './scenes/static-pages/scense/signin/index';
import Stats from './scenes/stats/index';
import NotFoundPage from './scenes/static-pages/scense/404/index';
import ForbiddenPage from './scenes/static-pages/scense/403/index';

const theme = createMuiTheme({
  overrides: {
    MuiTab: {
      wrapper: {
        flexDirection: 'row',
        width: 'auto',
        '& > *:first-child': {
          marginBottom: '0!important',
          marginRight: '6px',
        },
      },
      labelIcon: {
        minHeight: '48px',
      },
    },
  },
  palette: {
    primary: {
      main: '#00b45a',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00b45a',
      light: '#00b45a',
      dark: '#fff',
      contrastText: '#fff',
    },
    error: {
      main: red.A400,
      light: red.A400,
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    background: {
      // default: '#fff',
      default: '#ebf0ed',
    },
    text: {
      primary: '#323d47',
      secondary: '#323d47',
    },
  },
});
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <SnackbarProvider maxSnack={5}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route
            exact={true}
            path={['/dashboard', '/']}
            render={props => (
              <App {...props}>
                <Dashboard />
              </App>
            )}
          />
          <Route
            exact={true}
            path="/accounts"
            render={props => (
              <App {...props}>
                <Accounts />
              </App>
            )}
          />
          <Route
            exact={true}
            path="/places"
            render={props => (
              <App {...props}>
                <Places />
              </App>
            )}
          />
          <Route
            exact={true}
            path="/config"
            render={props => (
              <App {...props}>
                <Config />
              </App>
            )}
          />
          <Route
            exact={true}
            path="/charts"
            render={props => (
              <App {...props}>
                <Charts />
              </App>
            )}
          />
          <Route
            exact={true}
            path="/stats"
            render={props => (
              <App {...props}>
                <Stats />
              </App>
            )}
          />
          <Route
            exact={true}
            path="/apps"
            render={props => (
              <App {...props}>
                <Apps />
              </App>
            )}
          />
          <Route
            exact={true}
            path="/default_places"
            render={props => (
              <App {...props}>
                <DefaultPlaces />
              </App>
            )}
          />
          <Route exact={true} path="/signin" component={SignInPage} />
          <Route exact={true} path="/403" component={ForbiddenPage} />
          <Route exact={true} path="/404" component={NotFoundPage} />
          <Route component={() => <Redirect to="/404" />} />
        </Switch>
      </Router>
    </SnackbarProvider>
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
