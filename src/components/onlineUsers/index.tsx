import * as React from 'react';
import SystemApi from '../../api/system/index';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import ReloadIcon from '@material-ui/icons/Refresh';
import Loading from '../Loading';

interface IOnlineUsersProps {}

interface IOnlineUsersState {
  onlineUsers: any[];
  loading: boolean;
  reloadLoop: boolean;
}

class OnlineUsers extends React.Component<IOnlineUsersProps, IOnlineUsersState> {
  private inteval: any;
  private SystemApi: SystemApi = new SystemApi();
  constructor(props: IOnlineUsersProps) {
    super(props);

    this.state = {
      loading: true,
      reloadLoop: false,
      onlineUsers: [],
    };
  }

  componentDidMount() {
    this.GetOnlines();
  }

  componentWillUnmount() {
    if (this.state.reloadLoop) {
      clearInterval(this.inteval);
    }
  }

  reload = () => {
    this.setState(
      {
        reloadLoop: !this.state.reloadLoop,
      },
      () => {
        if (this.state.reloadLoop) {
          this.GetOnlines();
          this.inteval = setInterval(() => {
            this.GetOnlines();
          }, 8000);
        } else {
          clearInterval(this.inteval);
        }
      }
    );
  };

  // componentWillReceiveProps(newProps: IOnlineUsersProps) {
  // }

  GetOnlines() {
    this.SystemApi.getOnlineUsers()
      .then((result: any) => {
        this.setState({
          onlineUsers: result,
          loading: false,
        });
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  }

  render() {
    const { onlineUsers } = this.state;
    const onlineUsersDom = onlineUsers.map((bundle, ind) => {
      const accountsDom = bundle.accounts.map((account: any) => {
        return <li key={account}>{account}</li>;
      });
      return (
        <ul key={ind}>
          <li key={0}>{bundle.bundle_id} :</li>
          {accountsDom}
        </ul>
      );
    });
    return (
      <Paper className="chart-card online-users-card">
        <Loading active={this.state.loading} position="absolute" />
        <div className="card-head">
          <h2>Online Users</h2>
          <Tooltip placement="top" title={this.state.reloadLoop ? 'Auto Reloading' : 'Reload'}>
            <div
              className={['_df', '_cp', this.state.reloadLoop ? 'reloading' : ''].join(' ')}
              onClick={this.reload}
            >
              <ReloadIcon />
            </div>
          </Tooltip>
        </div>
        <div className="card-body">{onlineUsers.length > 0 && onlineUsersDom}</div>
      </Paper>
    );
  }
}

export default OnlineUsers;
