import * as React from 'react';
import {Menu, Dropdown, Button, Icon, Tooltip} from 'antd';
import Create from '../Create/index';
import moment from 'moment';

import SystemApi from '../../../../api/system/index';

interface IOptionsProps {
  changeData: any;
}

interface IOptionsState {
  showCreate: Boolean;
  licenseMaxUsers: number;
  accounts: number;
}

export default class Options extends React.Component<IOptionsProps, IOptionsState> {
  SystemApi: any;
  constructor(props: IOptionsProps) {
    super(props);

    this.state = {
      licenseMaxUsers: 0,
      showCreate: false,
      accounts: 0,
    };

    this.openCreate = this.openCreate.bind(this);
    this.closeCreate = this.closeCreate.bind(this);
  }

  componentDidMount() {
    this.SystemApi = new SystemApi();
    this.initiate();
  }

  componentWillReceiveProps() {
    this.initiate();
  }

  initiate() {

    this.GetLicense();
    this.GetData();
  }

  GetLicense() {
    this.SystemApi.getLicense().then((result) => {
        this.setState({
            licenseMaxUsers: result.license.max_active_users,
        });
    }).catch((error) => {
        console.log('error', error);
    });
  }

  GetData() {
    this.SystemApi.getSystemCounters().then((result) => {
      this.setState({
          accounts: result.enabled_accounts
      });
    }).catch((error) => {
        console.log('error', error);
    });
  }

  openCreate () {
    this.setState({ showCreate: true });
  }

  closeCreate () {
    this.setState({ showCreate: false });
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item key='create-account'>
          <a onClick={this.openCreate}>Create Account</a>
        </Menu.Item>
      </Menu>
    );
    const cantCreate = this.state.accounts >= this.state.licenseMaxUsers;
    return (
      <div>
        <Button.Group size='large'>
          {!cantCreate && <Button type=' butn butn-green secondary' onClick={this.openCreate}>Create Accounts</Button>}
          {cantCreate && (
            <Tooltip placement='top' title='You have reached maximum nested license active user limit.'>
              <Button type=' butn butn-green secondary' onClick={this.openCreate} disabled>Create Accounts</Button>
            </Tooltip>
          )}
          {/*<Button type='default'>*/}
            {/*<Icon type='setting' />*/}
          {/*</Button>*/}
        </Button.Group>
        <Create visible={this.state.showCreate} handleClose={this.closeCreate}/>
      </div>
    );
  }
}
