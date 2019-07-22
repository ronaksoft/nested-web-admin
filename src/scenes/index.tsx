import * as React from 'react';
import log from 'loglevel';

import HeaderComponent from '../components/Header/index';
import SidebarComponent from '../components/Sidebar/index';
import { History } from 'history';

import AAA from '../services/classes/aaa/index';

import AccountApi from '../api/account';
import IUser from '../interfaces/IUser';

import Api from './../api/index';
import SocketState from '../services/classes/socket/states';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Client from '../services/classes/client/index';
import { withSnackbar } from 'notistack';

interface IAppProps {
  classes: any;
  location: any;
  history: History;
  enqueueSnackbar: (
    message: React.ReactNode | string,
    options?: any
  ) => string | number | null | undefined;
  closeSnackbar: () => void;
}

interface IAppState {
  isReady: boolean;
}

class App extends React.Component<IAppProps, IAppState> {
  public state = {
    isReady: false,
  };

  private api: Api = Api.getInstance();
  private hideDisconnected: string = '';

  public componentDidMount() {
    const accountApi = new AccountApi();
    const aaa = AAA.getInstance();
    const credential = aaa.getCredentials();
    const user = aaa.getUser();

    if (!credential.sk || !credential.ss) {
      aaa.setIsUnAthenticated();
      this.props.history.push('/signin');
      return;
    }

    if (!user) {
      const did = Client.getDid();
      const dt = Client.getDt();
      accountApi
        .sessionRecall({
          _ss: credential.ss,
          _sk: credential.sk,
          _did: did,
          _os: 'android',
          _dt: dt,
        })
        .then((user: IUser) => {
          if (user && user.authority && user.authority.admin) {
            aaa.setUser(user);
            this.setState({
              isReady: true,
            });
            Client.setDid(did);
            Client.setDt(dt);
          } else {
            aaa.setIsUnAthenticated();
            this.props.history.push('/403');
          }
        })
        .catch((err: any) => {
          aaa.setIsUnAthenticated();
          this.props.history.push('/signin');
        });
    } else {
      this.setState({
        isReady: true,
      });
    }

    this.api.getServer().onConnectionStateChange((state: SocketState) => {
      if (state === SocketState.OPEN) {
        this.props.closeSnackbar();
      }

      if (state === SocketState.CLOSED) {
        this.props.enqueueSnackbar('Reconnecting...', {
          variant: 'warning',
          persist: true,
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
      }
    });
    log.setLevel(0);
  }

  public render() {
    const { children, classes } = this.props;
    return (
      <div className={classes.mainContainer}>
        {this.state.isReady && (
          <>
            <SidebarComponent location={this.props.location.pathname} />
            <div className={classes.container}>
              <HeaderComponent history={this.props.history} />
              <main>{children}</main>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default withStyles((theme: Theme) =>
  createStyles({
    mainContainer: {
      display: 'flex',
    },
    container: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      paddingLeft: '104px',
      paddingRight: '24px',
    },
  })
)(withSnackbar(App));
