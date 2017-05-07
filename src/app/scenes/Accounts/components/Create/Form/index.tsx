import * as React from 'react';
import {Modal, Button} from 'antd';

interface IFormProps {
  handleClose: Handler;
}

interface IFormState {

}

class Form extends React.Component<IFormProps, IFormState> {
  constructor(props: IFormProps) {
    this.state = {};
  }

  render() {
    return (
      <div>
        <Button onClick={this.props.handleClose}>Close me</Button>
      </div>
    );
  }
}

export default Form;
