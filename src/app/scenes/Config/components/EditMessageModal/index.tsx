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

import {Editor, EditorState, RichUtils, convertFromHTML, ContentState} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {RichEditor} from '../../../../components/Editor/index';

import 'draft-js/dist/Draft.css';
import _ from 'lodash';
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
    initialEditorState: any;
    editorState: any;
}

export default class EditMessageModal extends React.Component <IProps, IStates> {
    accountApi: any;
    searchIt: any;
    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            subject: '',
            body: '',
            initialEditorState: EditorState.createEmpty(),
            editorState: EditorState.createEmpty()
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
            body: props.message.body,
            initialEditorState: EditorState.createWithContent(ContentState.createFromBlockArray(
                convertFromHTML(props.message.body).contentBlocks,
                convertFromHTML(props.message.body).entityMap
            ))
        });
    }

    handleCancel() {
        this.props.onClose();
    }

    saveMessage() {
        // const body = ReactDOM.findDOMNode(this.refs.body).innerHTML;
        const body = stateToHTML(this.state.editorState.getCurrentContent());
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

    onChange = (editorState: any) => {
        this.setState({editorState});
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
                maskClosable={false}
                width={664}
                onCancel={this.handleCancel.bind(this)}
                visible={this.state.visible}
                footer={modalFooter}
                title='Welcome Message'>
                <div>
                    <Input className='no-style' value={this.state.subject} placeholder='Add a title' onChange={this.changeSubj.bind(this)}/>
                    {/* <div contentEditable={true} ref='body' dangerouslySetInnerHTML={{__html: this.state.body}}/> */}
                    <RichEditor initialState={this.state.initialEditorState} onStateChange={this.onChange}/>
                </div>
            </Modal>
        );
    }

}
