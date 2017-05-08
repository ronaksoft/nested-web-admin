import * as React from 'react';
import {Row, Col, Input} from 'antd';

interface IInputRowProps {
  account: IAccount;
}

interface IInputRowState {

}

class InputRow extends React.Component<IInputRowProps, IInputRowState> {
  constructor(props: IInputRowProps) {
    this.state = {
    };
  }

  render() {
    return (
        <Row>
          <Col span={6}>
            <Input
                  defaultValue={this.props.account.phone}
                  placeholder='+98 987 6543210'
            />
          </Col>
          <Col span={6}>
            <Input
                  defaultValue={this.props.account._id}
                  placeholder='Username'
            />
          </Col>
          <Col span={6}>
            <Input
                  defaultValue={this.props.account.fname}
                  placeholder='John'
            />
          </Col>
          <Col span={6}>
            <Input
                  defaultValue={this.props.account.lname}
                  placeholder='Doe'
            />
          </Col>
        </Row>
    );
  }
}

export default InputRow;
