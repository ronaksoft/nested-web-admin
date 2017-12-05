import * as React from 'react';
import {
    Modal,
    Row,
    Col,
    Icon,
    Button,
    message,
    Form,
    Input,
    Select,
    notification,
    Upload
} from 'antd';

// import  './../../components/froala/froala_editor.pkgd.min.js';
// import FroalaEditor from 'react-froala-wysiwyg';
import _ from 'lodash';
import {IcoN} from '../../../../components/icon/index';

interface IProps {
    visible: boolean;
    onClose?: () => {};
    messageChange: (message: any) => {};
}

interface IStates {
    visible: boolean;
    subject: string;
    message: string;
}

export default class EditMessageModal extends React.Component <IProps, IStates> {
    accountApi: any;
    searchIt: any;
    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            subject: '',
            message: ''
        };
    }

    componentWillReceiveProps(props: any) {
        this.setState({
            visible: props.visible,
        });
    }

    handleCancel() {
        this.props.onClose();
    }

    saveMessage() {
        this.props.messageChange({
            subject: this.state.subject,
            body: this.state.message
        });
        this.props.onClose();
    }

    changeSubj (e: any) {
        this.setState({
            subject: e.target.value || '',
        });
    }

    changeBody (e: any) {
        this.setState({
            message: e.target.value || '',
        });
    }

    render() {

        const modalFooter = (
            <div className='modal-foot'>
                <Button
                    type=' butn butn-green full-width'
                    onClick={this.saveMessage.bind(this)}>Save</Button>
            </div>
        );
        return (
            <Modal
                className='message-modal'
                maskClosable={true}
                width={480}
                onCancel={this.handleCancel.bind(this)}
                visible={this.state.visible}
                footer={modalFooter}
                title='Welcome Message'>
                <div>
                    <Input className='no-style' value={this.state.subject} placeholder='Add a title' onChange={this.changeSubj.bind(this)}/>
                    <Input className='no-style' value={this.state.message} type='textarea' placeholder='Type something...'
                        onChange={this.changeBody.bind(this)}/>
                </div>
            </Modal>
        );
    }

}