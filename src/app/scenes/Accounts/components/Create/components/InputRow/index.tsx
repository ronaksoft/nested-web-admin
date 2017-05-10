import * as React from 'react';
import {Row, Col, Input, Icon, Button} from 'antd';
import IAccount from '/src/app/common/index';
import PacketState from '/src/app/common/packet/PacketState';

interface IInputRowProps {
  account: Packet<IAccount>;
  onRemove: Handler;
  onChange: Handler;
}

interface IInputRowState {
  packet: Packet<IAccount>;
}

class InputRow extends React.Component<IInputRowProps, IInputRowState> {
  constructor(props: IInputRowProps) {
    this.state = {
      packet: props.account
    };

    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleFnameChange = this.handleFnameChange.bind(this);
    this.handleLnameChange = this.handleLnameChange.bind(this);
  }

  handlePhoneChange (event: event) {
    this.state.packet.model.phone = event.target.value;
    this.setState({
      model: this.state.packet.model
    });

    this.props.onChange(this.state.packet.model);
  }

  handleFnameChange (event: event) {
    this.state.packet.model.fname = event.target.value;
    this.setState({
      model: this.state.packet.model
    });

    this.props.onChange(this.state.packet.model);
  }

  handleLnameChange (event: event) {
    this.state.packet.model.lname = event.target.value;
    this.setState({
      model: this.state.packet.model
    });

    this.props.onChange(this.state.packet.model);
  }

  handleUsernameChange (event: event) {
    this.state.packet.model._id = event.target.value;
    this.setState({
      model: this.state.packet.model
    });

    this.props.onChange(this.state.packet.model);
  }

  render() {
    return (
        <Row className='account-row'>
          <Col span={22}>
            <Row gutter={8}>
              <Col span={6}>
                <Input
                      value={this.state.packet.model.phone}
                      placeholder='+98 987 6543210'
                      onChange={this.handlePhoneChange}
                />
              </Col>
              <Col span={6}>
                <Input
                      value={this.state.packet.model._id}
                      placeholder='john-doe'
                      onChange={this.handleUsernameChange}
                />
              </Col>
              <Col span={6}>
                <Input
                      value={this.state.packet.model.fname}
                      placeholder='John'
                      onChange={this.handleFnameChange}
                />
              </Col>
              <Col span={6}>
                <Input
                      value={this.state.packet.model.lname}
                      placeholder='Doe'
                      onChange={this.handleLnameChange}
                />
              </Col>
            </Row>
          </Col>
          <Col span={2}>
            <Row>
              <Col span={24} className='acc-btn'>
                {
                  this.state.packet.state === PacketState.New &&
                  <Button shape='circle' icon='delete' size='large' onClick={() => this.props.onRemove(this.state.packet)}/>
                }
                {
                  this.state.packet.state === PacketState.Pending &&
                  <Button shape='circle' size='large' loading/>
                }
                {
                  this.state.packet.state === PacketState.Success &&
                  <Icon type='check-circle-o' className='account-success-icon'/>
                }
                {
                  this.state.packet.state === PacketState.Failure &&
                  <Icon type='close-circle-o' className='account-failure-icon' />
                }

              </Col>
            </Row>
          </Col>
        </Row>
    );
  }
}

export default InputRow;
