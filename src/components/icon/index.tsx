/**
 * @file component/Icons/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Represents the Icons component. Component gets the
 *              requiered data from its parent.
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-23
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import './icons.less';
import Icons from './nst-icons';

interface IOptionsMenuProps {
  name: string;
  size: number;
}

/**
 * Components icon for render in different components.
 * @class IcoN
 * @extends {React.Component<IOptionsMenuProps, any>}
 */
class IcoN extends React.Component<IOptionsMenuProps, any> {
  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof IcoN
   */
  public render() {
    /**
     * @namespace
     * className - css classname related to the size of icon
     */
    const className = 's' + this.props.size;
    return (
      <i
        dangerouslySetInnerHTML={{ __html: Icons[this.props.size] + Icons[this.props.name] }}
        className={className}
      />
    );
  }
}

export { IcoN };
