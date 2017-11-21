/**
 * @file component/SelectLevel/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description multi level selector
 *              Documented by:          robzizo
 *              Date of documentation:  2017-11-23
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as console from 'console';
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
export default class SelectLevel extends React.Component<IArrowProps, IArrowStats> {

  constructor(props: any) {
    super(props);
    this.state = {
      rotate : 0,
    };
  }

  componentWillReceiveProps() {
    this.setState({
      rotate : parseInt(this.props.rotate, 10),
    });
  }

  switchLevel() {
    console.log('aaa');
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
      <div>
        <div className=''>
          <div>
            <IcoN size={24} name={'manager24'}/>
          </div>
          <hr className='margin'/>
          <hr/>
          <hr className='margin' />
          <div>
            <IcoN size={24} name={'manager-member'}/>
          </div>
          <hr className='margin'/>
          <hr/>
          <hr className='margin' />
          <div>
            <IcoN size={24} name={'manager-member'}/>
          </div>
          <hr className='margin'/>
          <hr/>
          <hr className='margin' />
          <div>
            <IcoN size={24} name={'manager-member'}/>
          </div>
          <hr className='margin'/>
          <hr/>
          <hr className='margin' />
          <div>
            <IcoN size={24} name={'manager-member'}/>
          </div>
          <div className='active-border' />
          <div className='receive-arrow' />
        </div>
        <div className='_fw receive-option-detail'>
          <h4 className='_fw _tac' ng-if='level == NST_PLACE_POLICY_OPTION.MANAGERS'><translate> Managers</translate></h4>
          <h4 className='_fw _tac' ng-if='level == NST_PLACE_POLICY_OPTION.MEMBERS'><translate> Managers and Members</translate></h4>
          <h4 className='_fw _tac' ng-if='level == NST_PLACE_POLICY_OPTION.TEAMMATES'><translate> Members</translate></h4>
          <h4 className='_fw _tac' ng-if='level == NST_PLACE_POLICY_OPTION.EVERYONE'><translate>Everyone</translate></h4>
          <div className='_difh _fw _aic' ng-if='level == NST_PLACE_POLICY_OPTION.TEAMMATES || level == NST_PLACE_POLICY_OPTION.EVERYONE'>
            <p className='_df _fw'><translate>Show in their search results?</translate></p>
            <div className='_df _fn'>
              <div className='place-switch'>
                <input type='checkbox' name='checkbox_id' id='Searchable' data-ng-model='searchable' ng-change='searchableChanged(searchable);' />
                <label htmlFor='Searchable'>
                  <b><translate>Yes</translate></b>
                  <div className='circle' switch-drag='Searchhable' />
                </label>
                <label htmlFor='Searchable'>
                  <b><translate>No</translate></b>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

