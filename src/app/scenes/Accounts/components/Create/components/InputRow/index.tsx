import * as React from 'react';
import {Row, Col, Input, Icon, Button, Form} from 'antd';
import IAccount from '/src/app/common/index';
import PacketState from '/src/app/common/packet/PacketState';
import _ from 'lodash';

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
  }

  handleFormChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.account, ...changedFields },
    });
  }

  saveForm = (form) => this.form = form;

  render() {
    const CreateForm = Form.create({
      onFieldsChange: () => {
        const model = this.form.getFieldsValue();
        const errors = this.form.getFieldsError();
        this.props.onChange(this.state.packet.key, model, errors);
      },
      mapPropsToFields: (props: any) => {
        return {
          _id: {
            value: props._id
          },
          fname: {
            value: props._fname
          },
          lname: {
            value: props._lname
          },
          phone: {
            value: props.phone
          }
        };
      }
    })((props: any) => {
      const { getFieldDecorator } = props.form;
      return (
        <Form layout='inline' className='account-row'>
            <Form.Item>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: 'Phone number is required!'
                  }
                ]
              })(
                <Input
                      placeholder='+98 987 6543210'
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('_id', {
                rules: [
                  {
                    required: true,
                    message: 'User ID is required!'
                  },
                  {
                    min: 5,
                    message: 'The user ID is too short!'
                  }
                ]
              })(
                <Input
                      placeholder='john-doe'
                />
              )}

            </Form.Item>
            <Form.Item>
              {getFieldDecorator('fname', {
                rules: [
                  {
                    required: true,
                    message: 'First name is required!'
                  }
                ]
              })(
                <Input
                      placeholder='John'
                />
              )}

            </Form.Item>
            <Form.Item>
              {getFieldDecorator('lname', {
                rules: [
                  {
                    required: true,
                    message: 'Last name is required!'
                  }
                ]
              })(
                <Input
                      placeholder='Doe'
                />
              )}

            </Form.Item>
            <Form.Item>
              {
                this.state.packet.state === PacketState.New &&
                <Button shape='circle' type='delete-row' icon='delete' size='large' onClick={() => this.props.onRemove(this.state.packet)}/>
              }
              {
                this.state.packet.state === PacketState.Pending &&
                <Icon type='loading'/>
              }
              {
                this.state.packet.state === PacketState.Success &&
                <Icon type='check-circle-o' className='account-success-icon'/>
              }
              {
                this.state.packet.state === PacketState.Failure &&
                <Icon type='close-circle-o' className='account-failure-icon' />
              }
              {
                this.state.packet.state === PacketState.Invalid &&
                <Icon type='exclamation-circle-o' className='account-failure-icon' />
              }
            </Form.Item>
        </Form>
      );
    });

    return (
        <Row>
          <Col span={24}>
              <CreateForm ref={this.saveForm} {...this.state.packet.model} onChange={this.handleFormChange} />
          </Col>
        </Row>
    );
  }
}

export default Form.create()(InputRow);
