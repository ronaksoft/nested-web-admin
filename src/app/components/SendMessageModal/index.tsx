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
    Switch,
    notification,
    Upload,
    Tooltip
} from 'antd';
import ReactDOM from 'react-dom';
import {EditorState} from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'draft-js/dist/Draft.css';
import {stateToHTML} from 'draft-js-export-html';
import MessageApi from '../../api/message/index';
import AttachmentList from './AttachmentList/index';
import _ from 'lodash';
// import FroalaEditor from 'react-froala-wysiwyg';
import {IcoN} from '../icon/index';
import CONFIG from 'src/app/config';
import './style.less';
import {RichEditor} from '../Editor/index';
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
    iframe: boolean;
    subject: string;
    target: string;
    iframeUrl: string;
    body: string;
    attachments: IAttachment[];
    editorState: any;
    contentType: string;
    unselectSelectedRecipient?: number;
    composeOption: boolean;
    iframeEnable: boolean;
}

export default class SendMessageModal extends React.Component <IProps, IStates> {
    MessageApi: any;
    constructor(props: any) {
        super(props);
        this.state = {
            iframe: false,
            sending: false,
            visible: false,
            composeOption: false,
            contentType: 'text/plain',
            target: this.props.target,
            iframeUrl: '',
            iframeEnable: (CONFIG().IFRAME_ENABLE === 'true'),
            subject: '',
            attachments: [],
            body: '',
            editorState: EditorState.createEmpty(),
        };
        this.addAttachment = this.addAttachment.bind(this);
        this.onChange = this.onChange.bind(this);
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
            iframe: false,
            target: props.target,
        });
    }

    handleCancel() {
        this.props.onClose();
    }

    sendMessage = () => {
        let req;
        if ( !this.state.iframe ) {
            req = {
                subject: this.state.subject,
                targets: this.state.target,
                body: stateToHTML(this.state.editorState.getCurrentContent()),
                attaches: this.state.attachments.map((i) => i.universal_id).join(','),
                content_type: 'text/html'
            };
            if (this.attachments.isUploading()) {
                return message.error('Upload is in progress');
            }
        } else {
            req = {
                iframe_url: this.state.iframeUrl,
                targets: this.state.target,
                subject: this.state.subject,
            };
        }

        this.MessageApi.createPost(req).then((result) => {
            message.success('Sent');
            this.props.onClose();
            this.setState({
                subject: '',
                attachments: [],
                body: '',
                iframeUrl: '',
                iframe: false,
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

    handleIframeChange(e: any) {
        this.setState({
            iframeUrl: e.target.value || '',
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

    toggleIframe = () => {
        this.setState({
            iframe: !this.state.iframe,
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

    isUrlValid(url: string) {
        return url && url.length > 0 && url.indexOf('http') === 0;
    }

    render() {
        const {iframeEnable} = this.state;
        var body = stateToHTML(this.state.editorState.getCurrentContent()).replace('<br>', '');
        const haveContent = (!this.state.iframe && (body.length > 7 || this.state.subject.length > 0 || this.state.attachments.length > 0)) || (this.state.iframe && this.isUrlValid(this.state.iframeUrl) && this.state.subject.length > 0);
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
                {true &&
                <Tooltip placement='top' title='for experts only ( unsecure channel )'>
                    <Switch defaultChecked={false} checked={this.state.iframe} className='large-switch'
                        checkedChildren='iframe' unCheckedChildren='iframe'
                        onChange={this.toggleIframe} style={{float: 'left'}}/>
                </Tooltip>}
                {!this.state.iframe && <Button
                    type=' butn secondary'
                    onClick={() => {
                        this.addAttachment(true);
                    }}>Add Media</Button>}
                {!this.state.iframe && <Button
                    type=' butn secondary'
                    onClick={() => {
                        console.log('add file');
                        this.addAttachment(false);
                    }}>Add File</Button>}
                <Button
                    type=' butn butn-green' disabled={!haveContent}
                    onClick={this.sendMessage}>Send</Button>
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
                title={`Send ${this.state.iframe ? 'an iframe' : 'a Message'} to ` + targetName}>
                 <div>
                    <Input className='no-style' value={this.state.subject}
                        placeholder='Add a Title...' onChange={this.handleSubjectChange.bind(this)}/>
                        {!this.state.iframe &&
                            <RichEditor initialState={EditorState.createEmpty()} onStateChange={this.onChange}/>
                        }
                </div>
                {this.state.iframe && <Input className='no-style' value={this.state.iframeUrl}
                        placeholder='Insert a URL...' onChange={this.handleIframeChange.bind(this)}/>}
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
