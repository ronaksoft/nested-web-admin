import * as React from 'react';
import {Menu, Dropdown, Button, Icon} from 'antd';
import Create from '../Create/index';

interface IOptionsProps {

}

interface IOptionsState {
  showCreate: Boolean;
}

export default class Options extends React.Component<IOptionsProps, IOptionsState> {
  constructor(props: IOptionsProps) {
    super(props);

    this.state = {
      showCreate: false
    };

    this.openCreate = this.openCreate.bind(this);
    this.closeCreate = this.closeCreate.bind(this);
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

    return (
      <div>
        <Button.Group size='large'>
          <Button type=' butn butn-green secondary' onClick={this.openCreate}>Create Accounts</Button>
          {/*<Button type='default'>*/}
            {/*<Icon type='setting' />*/}
          {/*</Button>*/}
        </Button.Group>
        <Create visible={this.state.showCreate} handleClose={this.closeCreate}/>
      </div>
    );
  }
}
