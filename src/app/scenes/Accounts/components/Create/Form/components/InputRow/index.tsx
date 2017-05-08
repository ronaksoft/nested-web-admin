import * as React from 'react';
import {Row, Col, Input, Icon, Button} from 'antd';

interface IInputRowProps {
  account: IAccount;
  onRemove: Handler;
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
          <Col span={22}>
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
          </Col>
          <Col span={2}>
            <Row>
              <Col span={24}>
                <Button shape='circle' icon='delete' size='large' onClick={() => this.props.onRemove(this.props.account)}/>
              </Col>
            </Row>
          </Col>
        </Row>
    );
  }
}

export default InputRow;
