import * as React from 'react';
import { EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { stateToHTML } from 'draft-js-export-html';
import MessageApi from '../../api/message/index';
import ICreatePostRequest from '../../interfaces/ICreatePostRequest';
import AttachmentList from './AttachmentList/index';
import CONFIG from '../../config';
import './style.less';
import { RichEditor } from '../Editor/index';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';

interface IProps {
  visible?: boolean;
  onClose?: any;
  target?: string;
  enqueueSnackbar: (
    message: React.ReactNode | string,
    options?: any
  ) => string | number | null | undefined;
  closeSnackbar: () => void;
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

class SendMessageModal extends React.Component<IProps, IStates> {
  private MessageApi: MessageApi = new MessageApi();
  private attachments = React.createRef<AttachmentList>();

  /**
   * @prop attachments
   * @desc Reference of `AttachmentList` component
   * @private
   * @type {AttachmentList}
   * @memberof Compose
   */

  /**
   * @prop file
   * @desc Html input of file type
   * @private
   * @type {HTMLInputElement}
   * @memberof Compose
   */
  private file: HTMLInputElement | null = null;

  /**
   * @prop mediaMode
   * @desc The user can upload an attachment as a file or media. We use this flag
   * to identify which upload button has been clicked.
   * @private
   * @type {boolean}
   * @memberof Compose
   */
  private mediaMode: boolean = false;
  constructor(props: any) {
    super(props);
    this.state = {
      iframe: false,
      sending: false,
      visible: false,
      composeOption: false,
      contentType: 'text/plain',
      target: this.props.target || '',
      iframeUrl: '',
      iframeEnable: CONFIG().IFRAME_ENABLE === 'true',
      subject: '',
      attachments: [],
      body: '',
      editorState: EditorState.createEmpty(),
    };
    this.addAttachment = this.addAttachment.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(editorState: any) {
    this.setState({ editorState });
  }

  componentWillReceiveProps(props: IProps) {
    this.setState({
      iframe: false,
      target: props.target || '',
      visible: !!props.visible,
    });
  }

  handleCancel() {
    this.props.onClose();
  }

  sendMessage = () => {
    let req: ICreatePostRequest;
    if (!this.state.iframe) {
      req = {
        attaches: this.state.attachments.map(i => i.universal_id).join(','),
        body: stateToHTML(this.state.editorState.getCurrentContent()),
        content_type: 'text/html',
        subject: this.state.subject,
        targets: this.state.target,
      };
      if (this.attachments.current && this.attachments.current.isUploading()) {
        this.props.enqueueSnackbar('Upload is in progress', {
          variant: 'error',
        });
        return;
      }
    } else {
      req = {
        iframe_url: this.state.iframeUrl,
        subject: this.state.subject,
        targets: this.state.target,
      };
    }

    this.MessageApi.createPost(req)
      .then((result: any) => {
        this.props.enqueueSnackbar('Sent', {
          variant: 'success',
        });
        this.props.onClose();
        this.setState({
          subject: '',
          attachments: [],
          body: '',
          iframeUrl: '',
          iframe: false,
          editorState: EditorState.createEmpty(),
        });
      })
      .catch((error: any) => {
        console.log(error);
        this.props.enqueueSnackbar("Can'nt send", {
          variant: 'error',
        });
      });
  };

  handleSubjectChange = (e: any) => {
    this.setState({
      subject: e.target.value || '',
    });
  };

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
      case 'blockquote':
        return 'RichEditor-blockquote';
      default:
        return null;
    }
  }

  toggleIframe = () => {
    this.setState({
      iframe: !this.state.iframe,
    });
  };

  isUrlValid(url: string) {
    return url && url.length > 0 && url.indexOf('http') === 0;
  }

  render() {
    const { iframeEnable } = this.state;
    const body = stateToHTML(this.state.editorState.getCurrentContent()).replace('<br>', '');
    const haveContent =
      (!this.state.iframe &&
        (body.length > 7 || this.state.subject.length > 0 || this.state.attachments.length > 0)) ||
      (this.state.iframe && this.isUrlValid(this.state.iframeUrl) && this.state.subject.length > 0);
    let targetName;
    targetName = this.state.target.split(',');
    targetName = targetName.map(str => {
      return "'" + str + "'";
    });
    targetName = targetName.join(', ');
    const lastIndex = targetName.lastIndexOf(',');
    if (lastIndex > -1) {
      targetName = targetName.substr(0, lastIndex) + ' &' + targetName.substr(lastIndex + 1);
    }
    return (
      <Dialog
        className="message-modal"
        // maskClosable={!haveContent}
        open={this.state.visible}
        onClose={this.handleCancel.bind(this)}
        aria-labelledby="simple-dialog-title"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle id="simple-dialog-title">
          {`Send ${this.state.iframe ? 'an iframe' : 'a Message'} to ` + targetName}
        </DialogTitle>
        <DialogContent>
          <div>
            <TextField
              className="no-style"
              value={this.state.subject}
              label="Add a Title..."
              fullWidth={true}
              onChange={this.handleSubjectChange}
            />
            {!this.state.iframe && (
              <RichEditor initialState={EditorState.createEmpty()} onStateChange={this.onChange} />
            )}
          </div>
          {this.state.iframe && (
            <TextField
              className="no-style"
              value={this.state.iframeUrl}
              label="Insert a URL..."
              fullWidth={true}
              onChange={this.handleIframeChange}
            />
          )}
          <AttachmentList
            onItemsChanged={this.handleAttachmentsChange}
            ref={this.attachments}
            items={this.state.attachments}
          />
          {/* hidden input for attachment upload */}
          <input
            ref={this.referenceFile}
            id="myFile"
            type="file"
            onChange={this.upload}
            style={{ display: 'none' }}
          />
        </DialogContent>
        <DialogActions>
          <div className="modal-foot">
            {iframeEnable && (
              <Tooltip placement="top" title="for experts only ( unsecure channel )">
                <Switch
                  checked={this.state.iframe}
                  className="large-switch"
                  onChange={this.toggleIframe}
                  style={{ float: 'left' }}
                />
              </Tooltip>
            )}
            {!this.state.iframe && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  this.addAttachment(true);
                }}
              >
                Add Media
              </Button>
            )}
            {!this.state.iframe && (
              <Button
                variant="contained"
                color="primary"
                className="button-margin"
                onClick={() => {
                  console.log('add file');
                  this.addAttachment(false);
                }}
              >
                Add File
              </Button>
            )}
            <Button
              disabled={!haveContent}
              onClick={this.sendMessage}
              variant="contained"
              color="primary"
            >
              Send
            </Button>
          </div>
        </DialogActions>
        {/* <FroalaEditor tag='textarea'/> */}
      </Dialog>
    );
  }

  /**
   * @func upload
   * @desc Uploads the given file using AttchamnetList component upload method
   * @param {*} e
   * @private
   * @memberof Compose
   */
  private upload = (e: any) => {
    this.attachments.current && this.attachments.current.upload(e, this.mediaMode);
  };

  /**
   * @func referenceFile
   * @desc Keep reference of HtmlInputElement component
   * @private
   * @memberof Compose
   * @param {HTMLInputElement} value
   */
  private referenceFile = (value: HTMLInputElement) => {
    this.file = value;
  };

  /**
   * @func selectFile
   * @desc Opens a file browser to select a file
   * @private
   * @memberof Compose
   * @param {boolean} isMedia
   */
  private selectFile = (isMedia: boolean) => {
    return () => {
      if (this.file) {
        this.file.click();
      }
      this.mediaMode = isMedia;
    };
  };

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
  };

  private addAttachment = (isMedia: boolean) => {
    if (this.file) {
      this.file.click();
    }
    this.mediaMode = isMedia;
  };
}
export default withSnackbar(SendMessageModal);
