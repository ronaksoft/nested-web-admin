import * as React from 'react';
import {Modal, Button, Row, Col, Card, Icon, notification, Form, Switch, Input} from 'antd';
import _ from 'lodash';
import AppApi from '../../../api/app/index';

interface ICreateProps {
    visible: Boolean;
    handleClose: () => {};
    handleCreate: (data: any) => {};
    form: any;
}

interface ICreateState {
}

class Create extends React.Component<ICreateProps, ICreateState> {
    AppApi: any;
    renderedRows = [];
    rowsRefs = {};

    constructor(props: ICreateProps) {
        super(props);
        this.state = {
            accounts: [],
            sendSms: true
        };
        this.AppApi = new AppApi();
    }

    checkIdAvailable = (rule: any, value: string, callback: any) => {
        // callback();
        this.AppApi.search({
            keywoard: value,
        }).then((apps) => {
            callback();
            if (apps[0]._id === value) {
                callback(new Error('Not available!'));
            } else {
                callback();
            }
        })
        .catch(() => {
            callback(new Error('Not available!'));
        });
    }

    checkIdAvailableDebounce: () => void = _.debounce(this.checkIdAvailable, 512);

    isUrlValid(rule: any, value: string, callback: any) {
        if (value.length > 0) {
            if (value.indexOf('http') === 0) {
                callback();
            } else {
                callback(new Error('Invalid!'));
            }
        } else {
            return callback();
        }
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
                                    this.checkIdAvailableDebounce
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
                                    },
                                    this.isUrlValid
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
                                rules: [
                                    this.isUrlValid
                                ]
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                        <label>Thumbnail url:</label>
                        <Form.Item>
                            {getFieldDecorator('thumbnailUrl', {
                                rules: [
                                    this.isUrlValid
                                ]
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
