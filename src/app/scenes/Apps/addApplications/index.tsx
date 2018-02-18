import * as React from 'react';
import {Modal, Button, Row, Col, Card, Icon, notification, Form, Switch, Input} from 'antd';
import _ from 'lodash';

interface ICreateProps {
    visible: Boolean;
    handleClose: () => {};
    handleCreate: (data: any) => {};
    form: any;
}

interface ICreateState {
}

class Create extends React.Component<ICreateProps, ICreateState> {

    checkPhoneAvailableDebounce: () => void = _.debounce(this.checkPhoneAvailable, 512);
    renderedRows = [];
    rowsRefs = {};

    constructor(props: ICreateProps) {
        super(props);
        this.state = {
            accounts: [],
            sendSms: true
        };
    }

    checkPhoneAvailable(rule: any, value: string, callback: any) {
        callback();
        // let accountApi = new AccountApi();
        // accountApi.phoneAvailable({phone: value})
        //     .then((isAvailable) => {
        //         if (isAvailable) {
        //             callback();
        //         } else {
        //             callback(new Error('Not available!'));
        //         }
        //     })
        //     .catch(() => {
        //         callback(new Error('Not available!'));
        //     });
    }

    initModal() {
        this.renderedRows = [];
        this.rowsRefs = {};
        this.setState({
            accounts: [],
        });
    }

    private handleClose = () => {
        this.props.handleClose();
    }

    private create = () => this.props.handleCreate(this.props.form.getFieldsValue());

    render() {
        const {getFieldDecorator} = this.props.form;
        const modalFooter = (
            <div>
                <div className='filler'></div>
                <Button type=' butn butn-white' size='large' onClick={this.handleClose}>Discard</Button>
                <Button type=' butn butn-green' size='large' onClick={this.create}>
                        Create
                </Button>
            </div>
        );
        return (
            <Modal
                visible={this.props.visible}
                title='Create Applications'
                width={960}
                footer={modalFooter}
                className='create-apps'
                afterClose={this.initModal.bind(this)}
                onCancel={this.handleClose}>
                <div>
                    <Form>
                        {/* onChange={self.fromChange.bind(self)}> */}
                        <label>ID:</label>
                        <Form.Item>
                            {getFieldDecorator('id', {
                                validateFirst: false,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Id is required!'
                                    },
                                    this.checkPhoneAvailableDebounce
                                ]
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                        <label>Name:</label>
                        <Form.Item>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'App name is required!'
                                    }
                                ]
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                        <label>Homepage:</label>
                        <Form.Item>
                            {getFieldDecorator('homepage', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'homepage is required!'
                                    }
                                ]
                            })(
                                <Input
                                    placeholder='https://myapp.nested.me/'
                                />
                            )}
                        </Form.Item>
                        <label>Developer:</label>
                        <Form.Item>
                            {getFieldDecorator('developer', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'developer is required!'
                                    }
                                ]
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                        <label>Logo url:</label>
                        <Form.Item>
                            {getFieldDecorator('logoUrl', {
                                rules: []
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                        <label>Thumbnail url:</label>
                        <Form.Item>
                            {getFieldDecorator('thumbnailUrl', {
                                rules: []
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default Form.create()(Create);
