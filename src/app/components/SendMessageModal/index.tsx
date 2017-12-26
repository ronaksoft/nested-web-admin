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
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {stateToHTML} from 'draft-js-export-html';
import MessageApi from '../../api/message/index';
import AttachmentList from './AttachmentList/index';
import _ from 'lodash';
// import FroalaEditor from 'react-froala-wysiwyg';
import {IcoN} from '../icon/index';
interface IProps {
    visible?: boolean;
    onClose?: any;
    target?: string;
}
interface IThumbnails {
    org: string;
    pre: string;
    x32: string;
    x64: string;
    x128: string;
  }
interface IAttachment {
    expiration_timestamp: number;
    name: string;
    size: number;
    thumbs: IThumbnails;
    type: string;
    universal_id: string;
  }
interface IStates {
    sending: boolean;
    visible: boolean;
    subject: string;
    target: string;
    body: string;
    attachments: IAttachment[];
    editorState: any;
    contentType: string;
    unselectSelectedRecipient?: number;
    composeOption: boolean;
}

export default class SendMessageModal extends React.Component <IProps, IStates> {
    MessageApi: any;
    constructor(props: any) {
        super(props);
        this.state = {
            sending: false,
            contentType: 'text/plain',
            visible: false,
            composeOption: false,
            target: this.props.target,
            subject: '',
            attachments: [],
            body: '',
            editorState: EditorState.createEmpty(),
        };
        this.addAttachment = this.addAttachment.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onTab = this.onTab.bind(this);
        this.toggleBlockType = this.toggleBlockType.bind(this);
        this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    }

    handleKeyCommand(command: any, editorState: any) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
          this.onChange(newState);
          return true;
        }
        return false;
    }

    toggleBlockType(blockType: any) {
        this.onChange(
          RichUtils.toggleBlockType(
            this.state.editorState,
            blockType
          )
        );
    }

    toggleInlineStyle(inlineStyle: any) {
        this.onChange(
          RichUtils.toggleInlineStyle(
            this.state.editorState,
            inlineStyle
          )
        );
    }

    onTab(e: any) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    onChange(editorState: any) {
        this.setState({editorState});
    }

    componentDidMount() {
        this.MessageApi = new MessageApi();
    }

    componentWillReceiveProps(props: IProps) {
        this.setState({
            visible: props.visible,
            target: props.target,
        });
    }

    handleCancel() {
        this.props.onClose();
    }

    sendMessage = (msg: any) => {
        const req = {
            subject: this.state.subject,
            targets: this.state.target,
            body: stateToHTML(this.state.editorState.getCurrentContent()),
            attaches: this.state.attachments.map((i) => i.universal_id).join(','),
            content_type: 'text/html'
        };

        if (this.attachments.isUploading()) {
            return message.error('Upload is in progress');
        }

        this.MessageApi.createPost(req).then((result) => {
            message.success('Sent');
            this.props.onClose();
            this.setState({
                subject: '',
                attachments: [],
                body: '',
                editorState: EditorState.createEmpty(),
            });
        }).catch((error) => {
            console.log(error);
            message.error('Can\'nt send');
        });
    }

    private addAttachment = (isMedia: boolean) => {
        this.file.click();
        this.mediaMode = isMedia;
    }

    /**
     * @prop attachments
     * @desc Reference of `AttachmentList` component
     * @private
     * @type {AttachmentList}
     * @memberof Compose
     */
    private attachments: AttachmentList;

    handleSubjectChange(e: any) {
        this.setState({
            subject: e.target.value || '',
        });
    }

    changeBody(e: any) {
        this.setState({
            body: e.target.value || '',
        });
    }

    getBlockStyle(block: any) {
        switch (block.getType()) {
          case 'blockquote': return 'RichEditor-blockquote';
          default: return null;
        }
    }

    /**
     * @func upload
     * @desc Uploads the given file using AttchamnetList component upload method
     * @param {*} e
     * @private
     * @memberof Compose
     */
    private upload = (e: any) => {
        this.attachments.upload(e, this.mediaMode);
    }

    /**
     * @prop file
     * @desc Html input of file type
     * @private
     * @type {HTMLInputElement}
     * @memberof Compose
     */
    private file: HTMLInputElement;

    /**
     * @prop mediaMode
     * @desc The user can upload an attachment as a file or media. We use this flag
     * to identify which upload button has been clicked.
     * @private
     * @type {boolean}
     * @memberof Compose
     */
    private mediaMode: boolean;

    /**
     * @func referenceFile
     * @desc Keep reference of HtmlInputElement component
     * @private
     * @memberof Compose
     * @param {HTMLInputElement} value
     */
    private referenceFile = (value: HTMLInputElement) => {
        this.file = value;
    }

    /**
     * @func selectFile
     * @desc Opens a file browser to select a file
     * @private
     * @memberof Compose
     * @param {boolean} isMedia
     */
    private selectFile = (isMedia: boolean) => {
        return () => {
            this.file.click();
            this.mediaMode = isMedia;
        };
    }

    /**
     * @func handleAttachmentsChange
     * @desc Updates the component state with a new list of attachments
     * @private
     * @memberof Compose
     * @param {IAttachment[]} items
     */
    private handleAttachmentsChange = (items: IAttachment[]) => {
        this.setState({
        attachments: items,
        });
    }

    /**
     * @func referenceAttachments
     * @desc Keeps reference of AttachmentList component
     * @private
     * @memberof Compose
     * @param {AttachmentList} value
     */
    private referenceAttachments = (value: AttachmentList) => {
        this.attachments = value;
    }

    render() {
        var body = stateToHTML(this.state.editorState.getCurrentContent()).replace('<br>', '');
        const haveContent = body.length > 7 || this.state.subject.length > 0 || this.state.attachments.length > 0;
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
                    type=' butn secondary'
                    onClick={() => {
                        this.addAttachment(true);
                    }}>Add Media</Button>
                <Button
                    type=' butn secondary'
                    onClick={() => {
                        console.log('add file');
                        this.addAttachment(false);
                    }}>Add File</Button>
                <Button
                    type=' butn butn-green' disabled={!haveContent}
                    onClick={this.sendMessage.bind(this)}>Send</Button>
            </div>
        );
        let targetName;
        targetName = this.state.target.split(',');
        targetName = targetName.map((str) => {
            return '\'' + str + '\'';
        });
        targetName = targetName.join(', ');
        const lastIndex = targetName.lastIndexOf(',');
        if (lastIndex > -1) {
            targetName = targetName.substr(0, lastIndex) + ' &' + targetName.substr(lastIndex + 1);
        }
        return (
            <Modal
                className='message-modal'
                maskClosable={!haveContent}
                width={664}
                onCancel={this.handleCancel.bind(this)}
                visible={this.state.visible}
                footer={modalFooter}
                title={'Send a Message to ' + targetName}>
                <div>
                    <Input className='no-style' value={this.state.subject}
                        placeholder='Add a Title...' onChange={this.handleSubjectChange.bind(this)}/>
                    <Editor
                        blockStyleFn={this.getBlockStyle}
                        customStyleMap={styleMap}
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        onTab={this.onTab}
                        placeholder='Write something...'
                        ref='editor'
                        spellCheck={true}
                    />
                    {/* <Input className='no-style' value={this.state.body} type='textarea' placeholder='Type something...'
                        onChange={this.changeBody.bind(this)}/> */}
                </div>
                <AttachmentList
                    onItemsChanged={this.handleAttachmentsChange}
                    ref={this.referenceAttachments}
                    items={this.state.attachments}
                />
                {/* hidden input for attachment upload */}
                <input ref={this.referenceFile} id='myFile' type='file' onChange={this.upload} style={{display: 'none'}}/>
                {/* <FroalaEditor tag='textarea'/> */}
            </Modal>
        );
    }

}