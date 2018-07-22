import * as React from 'react';
import {Editor, EditorState, RichUtils, convertFromHTML} from 'draft-js';
import './style.less';
import addLinkPlugin from './plugins/addLinkPlugin';
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

  focus = () => this.refs.editor.focus();

  onChange = (editorState) => {
    this.setState({editorState});
    this.props.onStateChange(editorState);
  }

  handleKeyCommand = (command) => this._handleKeyCommand(command);

  onTab = (e) => this._onTab(e);

  toggleBlockType = (type) => this._toggleBlockType(type);

  toggleInlineStyle = (style) => {
    console.log(style);
    if ('LINK' === style) {
      const editorState = this.state.editorState;
      const selection = editorState.getSelection();
      const link = window.prompt('Paste the link -');
      if (!link) {
        this.onChange(RichUtils.toggleLink(editorState, selection, null));
        return 'handled';
      }
      const content = editorState.getCurrentContent();
      const contentWithEntity = content.createEntity('LINK', 'MUTABLE', { url: link });
      const newEditorState = EditorState.push(editorState, contentWithEntity, 'create-entity');
      const entityKey = contentWithEntity.getLastCreatedEntityKey();
      this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey));
    } else {
      this._toggleInlineStyle(style);
    }
  }

  _handleKeyCommand(command: any) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e: any) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType(blockType: any) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle: any) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render() {
    const {editorState} = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className='RichEditor-root'>
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder='Write something...'
            ref='editor'
            plugins={[addLinkPlugin]}
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block: any) {
  console.log('block', block, block.getType());
  switch (block.getType()) {
    case 'left':
      return 'align-left';
    case 'center':
      return 'align-center';
    case 'right':
      return 'align-right';
    case 'unstyled':
      return 'unstyled';
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}
interface IStyleButtonProps {
  onToggle: (v: any) => {};
  style: any;
  active: boolean;
  label: any;
}

interface IStyleButtonStates {
  editorState: any;
}
class StyleButton extends React.Component<IStyleButtonProps, IStyleButtonStates> {
  onToggle = (e) => {
    e.preventDefault();
    this.props.onToggle(this.props.style);
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
  {label: 'Align Left', style: 'alignleft'},
  {label: 'Align Center', style: 'aligncenter'},
  {label: 'Align Right', style: 'alignright'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className='RichEditor-controls'>
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
  {label: 'Link', style: 'LINK'},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className='RichEditor-controls'>
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};
