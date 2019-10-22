import * as React from 'react';
import './style.scss';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';

import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { RichEditor } from '../../../../components/Editor/index';

interface IProps {
  visible: boolean;
  onClose?: () => void;
  message: any;
  messageChange: (message: any) => void;
}

interface IStates {
  visible: boolean;
  subject: string;
  body: string;
  initialEditorState: any;
  editorState: any;
}

export default class EditMessageModal extends React.Component<IProps, IStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      subject: '',
      body: '',
      initialEditorState: EditorState.createEmpty(),
      editorState: EditorState.createEmpty(),
    };
  }

  componentDidMount() {
    this.setState({
      subject: this.props.message.subject,
      body: this.props.message.body,
    });
  }
  componentWillReceiveProps(props: any) {
    let initialEditorState = this.state.initialEditorState;
    try {
      if (props.message.body) {
        initialEditorState = EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(props.message.body).contentBlocks,
            convertFromHTML(props.message.body).entityMap
          )
        );
      }
    } catch (error) {}
    this.setState({
      visible: props.visible,
      subject: props.message.subject,
      body: props.message.body,
      initialEditorState,
    });
  }

  handleCancel = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  saveMessage = () => {
    const body = stateToHTML(this.state.editorState.getCurrentContent());
    this.setState({
      body,
    });
    this.props.messageChange({
      subject: this.state.subject,
      body,
    });
    this.handleCancel();
  };

  changeSubj = (e: any) => {
    this.setState({
      subject: e.target.value || '',
    });
  };

  onChange = (editorState: any) => {
    this.setState({ editorState });
  };

  render() {
    return (
      <Dialog
        onClose={this.handleCancel}
        open={this.state.visible}
        aria-labelledby="simple-dialog-title"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle id="simple-dialog-title">Welcome Message</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              label="Add a title"
              fullWidth={true}
              value={this.state.subject}
              onChange={this.changeSubj}
            />
            <RichEditor
              initialState={this.state.initialEditorState}
              onStateChange={this.onChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <div className="modal-foot">
            <Button
              onClick={this.handleCancel}
              className="button-margin"
              variant="outlined"
              color="secondary"
            >
              Close
            </Button>
            <Button variant="contained" color="primary" onClick={this.saveMessage}>
              Save
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    );
  }
}
