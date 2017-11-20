/**
 * @file component/Icons/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Represents the Arrow component for easy rotation
 *              Documented by:          robzizo
 *              Date of documentation:  2017-11-20
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import {IcoN} from '../icon/index';

interface IArrowProps {
  rotate?: string;
  size?: number;
}
interface IArrowStats {
  rotate: number;
}

/**
 * Arrow for render in different components.
 * @class Arrow
 * @extends {React.Component<IOptionsMenuProps, any>}
 */
export default class Arrow extends React.Component<IArrowProps, IArrowStats> {

  constructor(props: any) {
    super(props);
    console.log(this.props.rotate);
    this.state = {
      rotate : 0,
    };
  }

  componentWillReceiveProps() {
    this.setState({
      rotate : parseInt(this.props.rotate, 10),
    });
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof Arrow
   */
  public render() {
    const styles = {
      transformOrigin: 'center center',
      transform: `rotateZ(${this.state.rotate}deg)`,
    };

    return (
      <div style={styles}>
        <IcoN size={16} name='arrow16'/>
      </div>
    );
  }
}

