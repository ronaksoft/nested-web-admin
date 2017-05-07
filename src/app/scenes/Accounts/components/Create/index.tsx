import * as React from 'react';
import {Modal, Button} from 'antd';
import Form from './Form/index';

interface ICreateProps {
  visible: Boolean;
  handleClose: Handler;
}

interface ICreateState {}

class Create extends React.Component<ICreateProps, ICreateState> {
  // constructor(props: ICreateProps) {}

  render() {
    return (
      <Modal
          visible={this.props.visible}
          title='Create Accounts'
          footer={null}
          onCancel={this.props.handleClose}
        >
          <Form handleClose={this.props.handleClose}/>
        </Modal>
    );
  }
}

export default Create;
