import * as React from 'react';
import md5 from 'md5';
import AAA from './../../../../services/classes/aaa/index';
import AccountApi from './../../../../api/account';
import { History } from 'history';
import Api from './../../../../api/index';
import CONFIG from '../../../../config';
import { Button, TextField, Avatar, Container, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import appLoader from '../../../../components/Loading/app-loading';

import { withSnackbar } from 'notistack';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';

import Client from './../../../../services/classes/client/index';

interface ISignInProps {
  classes: any;
  history: History;
  enqueueSnackbar: (
    message: React.ReactNode | string,
    options?: any
  ) => string | number | null | undefined;
  closeSnackbar: () => void;
}

interface ISignInState {
  username: string;
  password: string;
  error: string;
  disableBtn: boolean;
}

class SignIn extends React.Component<ISignInProps, ISignInState> {
  private accountApi: AccountApi = new AccountApi();
  constructor(props: any) {
    super(props);
    this.state = { username: '', password: '', error: '', disableBtn: false };
  }

  handleSubmit() {
    this.setState({ disableBtn: true, error: '' });
    this.props.closeSnackbar();
    const data = {
      username: this.state.username,
      password: this.state.password,
    };
    const localDomain = localStorage.getItem('nested.server.domain');
    if (data.username.indexOf('@') > -1) {
      const usernameSplits = data.username.split('@');
      const api = Api.getInstance();
      data.username = usernameSplits[0];
      api
        .reconfigEndPoints(usernameSplits[1])
        .then(() => {
          this.login(data, usernameSplits[1]);
        })
        .catch(r => {
          console.log(r);
          this.setState({ error: `Something wen't wrong`, disableBtn: false });
        });
    } else if (localDomain && CONFIG().DOMAIN !== localDomain) {
      const api = Api.getInstance();
      api.reconfigEndPoints(localDomain).then(() => {
        this.login(data, localDomain);
      });
    } else {
      this.login(data, CONFIG().domain);
    }
  }
  componentDidMount(){
    appLoader.hide();
  }

  login = (data: any, domain: string) => {
    const did = Client.getDid();
    const dt = Client.getDt();

    this.accountApi
      .login({
        uid: data.username,
        pass: md5(data.password),
        _did: did,
        _dt: dt,
        _os: 'android',
      })
      .then((data: any) => {
        if (data.account && data.account.admin) {
          AAA.getInstance().setCredentials(data);
          // fixme : data or data.account ?
          AAA.getInstance().setUser(data.account);
          Client.setDid(did);
          Client.setDt(dt);
          this.props.history.push('/dashboard');
          if (domain !== undefined) {
            localStorage.setItem('nested.server.domain', domain);
          }
        } else {
          this.setState({ error: 'You are not administrator', disableBtn: false });
          this.props.enqueueSnackbar('You are not administrator', {
            variant: 'error',
            persist: true,
            preventDuplicate: true,
            anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
          });
        }
      })
      .catch((error: any) => {
        this.props.enqueueSnackbar('Wrong Username or Password', {
          variant: 'warning',
          persist: true,
          preventDuplicate: true,
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        });
        this.setState({ error: 'Wrong Username or Password', disableBtn: false });
      });
  };

  handleChange = (field: 'username' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const state: any = {};
    state[field] = e.currentTarget.value;
    this.setState(state);
  };


  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in to Admin Panel
          </Typography>
          <form
            action="/"
            method="POST"
            onSubmit={e => {
              e.preventDefault();
              this.handleSubmit();
            }}
            className={classes.form}
            noValidate={true}
          >
            <TextField
              variant="outlined"
              margin="normal"
              onChange={this.handleChange('username')}
              required={true}
              fullWidth={true}
              error={this.state.error.length > 0}
              id="username"
              value={this.state.username}
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus={true}
            />
            <TextField
              variant="outlined"
              value={this.state.password}
              margin="normal"
              error={this.state.error.length > 0}
              onChange={this.handleChange('password')}
              required={true}
              fullWidth={true}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth={true}
              variant="contained"
              color="primary"
              disabled={(this.state.password + this.state.username === '') || this.state.disableBtn}
              onClick={e => {
                e.preventDefault();
                this.handleSubmit();
              }}
              className={classes.submit}
            >
              Sign In
            </Button>
            {/* {this.state.error.length > 0 && (
              <Typography className={classes.error}>
                <ErrorIcon className={classes.icon} />
                {this.state.error}
              </Typography>
            )} */}
          </form>
        </div>
      </Container>
    );
  }
}

export default withStyles((theme: Theme) =>
  createStyles({
    '@global': {
      body: {
        // backgroundColor: theme.palette.common.white,
      },
    },
    avatar: {
      backgroundColor: theme.palette.secondary.main,
      margin: theme.spacing(1),
    },
    error: {
      backgroundColor: theme.palette.error.dark,
      borderRadius: '4px',
      color: theme.palette.error.contrastText,
      display: 'flex',
      padding: theme.spacing(1, 0, 1),
    },
    form: {
      // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      width: '100%',
    },
    icon: {
      margin: theme.spacing(0, 1),
    },
    paper: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      marginTop: theme.spacing(8),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
)(withSnackbar(SignIn));
