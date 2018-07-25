import * as React from 'react';
import {Editor} from 'react-draft-wysiwyg';
import './style.less';

interface IProps {
  initialState: any;
  onStateChange: (s: any) => void;
}

interface IStates {
  editorState: any;
}
export class RichEditor extends React.Component <IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this.state = {editorState: this.props.initialState};
  }

  onChange = (editorState) => {
    this.setState({editorState});
    this.props.onStateChange(editorState);
  }

  render() {
    const {editorState} = this.state;

    return (
      <Editor
        editorState={editorState}
        toolbarClassName='toolbarClassName'
        wrapperClassName='wrapperClassName'
        editorClassName='editorClassName'
        onEditorStateChange={this.onChange}
      />
    );
  }
}
