import * as React from 'react';

interface IProps {
  active: boolean;
  size?: string;
  position?: string;
}

interface IState {
  active: boolean;
}

/**
 * renders the Loading element
 * @class Loading
 * @extends {React.Component<IProps, IState>}
 */
export default class Loading extends React.Component<IProps, IState> {

  /**
   * Constructor
   * Creates an instance of Loading.
   * @param {IProps} props
   * @memberof Loading
   */
  constructor(props: any) {
    super(props);

    /**
     * read the data from props and set to the state
     * @type {object}
     * @property {boolean} active show condition for element
     */
    this.state = {
      active : this.props.active,
    };
  }

  /**
   * updats the state object when the parent changes the props
   * @param {IProps} newProps
   * @memberof Loading
   */
  public componentWillReceiveProps(newProps: IProps) {

    /**
     * read the data from props and set to the state
     * @type {object}
     * @property {boolean} active show condition for element
     */
    this.setState({
      active: newProps.active,
    });
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof Loading
   */
  public render() {
    return (
      <div>
        {this.state.active && <div className={['nst-loading', this.props.size || '', this.props.position || ''].join(' ')}>
          {/* chck the visibility condition for rendering */}
        </div>}
      </div>
    );
  }
}
