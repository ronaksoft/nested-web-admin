import * as React from 'react';
import {Row, Col, Input, Icon, Button} from 'antd';

interface IInputRowProps {
  account: IAccount;
  onRemove: Handler;
  onChange: Handler;
}

interface IInputRowState {
  model: IAccount;
}

class InputRow extends React.Component<IInputRowProps, IInputRowState> {
  constructor(props: IInputRowProps) {
    this.state = {
      model: props.account
    };

    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleFnameChange = this.handleFnameChange.bind(this);
    this.handleLnameChange = this.handleLnameChange.bind(this);
  }

  handlePhoneChange (event: event) {
    this.state.model.phone = event.target.value;
    this.setState({
      model: this.state.model
    });

    this.props.onChange(this.state.model);
  }

  handleFnameChange (event: event) {
    this.state.model.fname = event.target.value;
    this.setState({
      model: this.state.model
    });

    this.props.onChange(this.state.model);
  }

  handleLnameChange (event: event) {
    this.state.model.lname = event.target.value;
    this.setState({
      model: this.state.model
    });

    this.props.onChange(this.state.model);
  }

  handleUsernameChange (event: event) {
    this.state.model._id = event.target.value;
    this.setState({
      model: this.state.model
    });

    this.props.onChange(this.state.model);
  }

  render() {
    return (
        <Row>
          <Col span={22}>
            <Row>
              <Col span={6}>
                <Input
                      value={this.state.model.phone}
                      placeholder='+98 987 6543210'
                      onChange={this.handlePhoneChange}
                />
              </Col>
              <Col span={6}>
                <Input
                      value={this.state.model._id}
                      placeholder='john-doe'
                      onChange={this.handleUsernameChange}
                />
              </Col>
              <Col span={6}>
                <Input
                      value={this.state.model.fname}
                      placeholder='John'
                      onChange={this.handleFnameChange}
                />
              </Col>
              <Col span={6}>
                <Input
                      value={this.state.model.lname}
                      placeholder='Doe'
                      onChange={this.handleLnameChange}
                />
              </Col>
            </Row>
          </Col>
          <Col span={2}>
            <Row>
              <Col span={24}>
                <Button shape='circle' icon='delete' size='large' onClick={() => this.props.onRemove(this.state.model)}/>
              </Col>
            </Row>
          </Col>
        </Row>
    );
  }
}

export default InputRow;
