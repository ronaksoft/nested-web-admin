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
// import { Editor } from 'react-draft-wysiwyg';
import {stateToHTML} from 'draft-js-export-html';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'draft-js/dist/Draft.css';
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
            editorState: EditorState.createWithContent(ContentState.createFromBlockArray(
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

    changeBody (e: any) {
        this.setState({
            body: e.target.value || '',
        });
    }

    onChange = (editorState: any) => {
        this.setState({editorState});
    }

    render() {
        const styleMap = {
            CODE: {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
              fontSize: 16,
              padding: 2,
            },
        };
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
                    {/* <Input className='no-style' value={this.state.body} type='textarea' placeholder='Type something...'
                        onChange={this.changeBody.bind(this)}/> */}
                    {/* <div contentEditable={true} ref='body' dangerouslySetInnerHTML={{__html: this.state.body}}/> */}
                    {/* <Editor
                        customStyleMap={styleMap}
                        editorState={this.state.editorState}
                        onEditorStateChange={this.onChange}
                        placeholder='Write something...'
                        ref='editor'
                        spellCheck={true}
                    /> */}
                    <Editor
                        customStyleMap={styleMap}
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        placeholder='Write something...'
                        ref='editor'
                        spellCheck={true}
                    />
                </div>
            </Modal>
        );
    }

}
