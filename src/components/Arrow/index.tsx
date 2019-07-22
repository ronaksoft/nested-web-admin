/**
 * @file component/Avatar/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Represents the Arrow component for easy rotation
 *              Documented by:          robzizo
 *              Date of documentation:  2017-11-20
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import { IcoN } from '../icon/index';

interface IArrowProps {
  rotate: string;
  size?: number;
  onClick: (f: boolean, el: HTMLDivElement | null) => void;
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
  private element = React.createRef<HTMLDivElement>();

  constructor(props: any) {
    super(props);
    this.state = {
      rotate: parseInt(this.props.rotate, 10),
    };
  }

  public componentWillReceiveProps(newProps: any) {
    this.setState({
      rotate: parseInt(newProps.rotate, 10),
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
      transform: `rotateZ(${this.state.rotate}deg)`,
      transformOrigin: 'center center',
    };

    const click = (event: any) => {
      event.stopPropagation();
      let open = false;
      if (this.state.rotate === 0) {
        this.setState({
          rotate: 180,
        });
        open = false;
      } else {
        this.setState({
          rotate: 0,
        });
        open = true;
      }
      this.props.onClick(open, this.element.current);
    };

    return (
      <div ref={this.element} className="arrow" style={styles} onClick={click}>
        <IcoN size={16} name="arrow16" />
      </div>
    );
  }
}
