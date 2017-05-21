import * as React from 'react';
import {Row, Col, Input, Icon, Button, Form} from 'antd';
import _ from 'lodash';
import IAccount from '../../../../IAccount';
import PacketState from '../../../../PacketState';

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
          },
          pass: {
            value: props.pass
          }
        };
      }
    })((props: any) => {
      const { getFieldDecorator } = props.form;
      const disabled = this.state.packet.state === PacketState.Success || this.state.packet.state === PacketState.Pending;
      const pending = this.state.packet.state === PacketState.Pending;
      const success = this.state.packet.state === PacketState.Success;
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
                      disabled={disabled}
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
                      disabled={disabled}
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
                      disabled={disabled}
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
                      disabled={disabled}
                />
              )}

            </Form.Item>
            <Form.Item>
              {getFieldDecorator('pass', {
                rules: [
                  {
                    required: true,
                    message: 'Password is required!'
                  },
                  {
                    min: 6,
                    message: 'Password must be at least 6 characters.'
                  }
                ]
              })(
                <Input
                      placeholder='Doe'
                      disabled={disabled}
                />
              )}

            </Form.Item>
            <Form.Item>
              {
                !(pending || success) &&
                <Button shape='circle' type='delete-row' icon='delete' size='large' onClick={() => this.props.onRemove(this.state.packet)}/>
              }
              {
                pending &&
                <Icon type='loading'/>
              }
              {
                success &&
                <Icon type='check-circle-o' className='account-success-icon'/>
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

  componentDidMount() {
    if (this.state.packet.state !== PacketState.New) {
      this.form.validateFields((errors, values) => {
        const errors = _(errors).map((value, key) => value.errors).flatten().value();
        if (_.size(errors) > 0) {
          this.state.packet.state = PacketState.Invalid;
        }
      });
    }
  }
}

export default Form.create()(InputRow);
