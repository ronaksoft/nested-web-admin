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
import ReactDOM from 'react-dom';

import _ from 'lodash';
// import FroalaEditor from 'react-froala-wysiwyg';
import {IcoN} from '../../../../components/icon/index';
interface IProps {
    visible: boolean;
    onClose?: () => {};
    message: any;
    messageChange: (message: any) => {};
}

interface IStates {
    visible: boolean;
    subject: string;
    body: string;
}

export default class EditMessageModal extends React.Component <IProps, IStates> {
    accountApi: any;
    searchIt: any;
    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            subject: '',
            body: ''
        };
    }

    componentDidMount() {
        this.setState({
            subject: this.props.message.subject,
            body: this.props.message.body
        });
    }
    componentWillReceiveProps(props: any) {
        this.setState({
            visible: props.visible,
            subject: props.message.subject,
            body: props.message.body
        });
    }

    handleCancel() {
        this.props.onClose();
    }

    saveMessage() {
        const body = ReactDOM.findDOMNode(this.refs.body).innerHTML;
        this.setState({
            body
        });
        this.props.messageChange({
            subject: this.state.subject,
            body
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
            body: e.target.value || '',
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
                width={664}
                onCancel={this.handleCancel.bind(this)}
                visible={this.state.visible}
                footer={modalFooter}
                title='Welcome Message'>
                <div>
                    <Input className='no-style' value={this.state.subject} placeholder='Add a title' onChange={this.changeSubj.bind(this)}/>
                    {/* <Input className='no-style' value={this.state.body} type='textarea' placeholder='Type something...'
                        onChange={this.changeBody.bind(this)}/> */}
                    <div contentEditable={true} ref='body' dangerouslySetInnerHTML={{__html: this.state.body}}/>
                </div>
                {/* <FroalaEditor tag='textarea'/> */}
            </Modal>
        );
    }

}
