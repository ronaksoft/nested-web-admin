/**
 * @file component/PlacePolicy/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Represents the place policy icons.
 *              Documented by:          robzizo
 *              Date of documentation:  2017-11-20
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import {Icon} from 'antd';
import {IcoN} from '../icon/index';
import IPlace from './../../api/place/interfaces/IPlace';
import C_PLACE_RECEPTIVE  from '../../api/consts/CPlaceReceptive';
import C_PLACE_POLICE  from '../../api/consts/CPlacePolicy';
interface IPlacePolicyProps {
  place: IPlace;
  search?: boolean;
  type?: boolean;
  receptive?: boolean;
  text? : boolean;
}

/**
 * icons for place details.
 * @class PlacePolicy
 * @extends {React.Component<IPlacePolicyProps, any>}
 */
export default class PlacePolicy extends React.Component<IPlacePolicyProps, any> {

  constructor(props: any) {
    super(props);
  }

  type(place: IPlace) {
    var icon, text;
    if (place.privacy.locked === true) {
      icon = <IcoN size={16} name={'brickWall16'}/>;
      text = 'Private Place';
    } else {
      icon = <IcoN size={16} name={'window16'}/>;
      text = 'Common Place';
    }
    if (this.props.type) {
      return <div>
        {icon}
        {this.props.text && text}
      </div>;
    } else {
      return <div></div>;
    }
  }

  search(place: IPlace) {
    var icon, text;
    if (place.privacy.search === true) {
      icon = <IcoN size={16} name={'search16'}/>;
      text = 'This place shows in search results.';
    } else {
      icon = <Icon type=' nst-ico ic_non_search_24'/>;
      text = 'This place is not shown in search results.';
    }
    if (this.props.search) {
      return <div>
        {icon}
        {this.props.text && text}
      </div>;
    } else {
      return <div></div>;
    }
  }

  receptive(place: IPlace) {
    var icon, text;
    if (place.privacy.receptive === C_PLACE_RECEPTIVE.external && place.policy.add_post === C_PLACE_POLICE.everyone) {
      icon = <IcoN size={16} name={'earth16'}/>;
      text = 'Everyone can share post.';
    } else if (place.privacy.receptive === C_PLACE_RECEPTIVE.internal && place.policy.add_post === C_PLACE_POLICE.everyone) {
      icon = <IcoN size={16} name={'team16'}/>;
      text = 'All grand-place members can share post';
    } else if (place.privacy.receptive === C_PLACE_RECEPTIVE.off && place.policy.add_post === C_PLACE_POLICE.everyone) {
      icon = <IcoN size={16} name={'manager-member16'}/>;
      text = 'All members of the place could share post.';
    } else if (place.privacy.receptive === C_PLACE_RECEPTIVE.off && place.policy.add_post === C_PLACE_POLICE.everyone) {
      icon = <IcoN size={16} name={'manager16'}/>;
      text = 'Only managers can share post';
    }
    if (this.props.receptive) {
      return <div>
        {icon}
        {this.props.text && text}
      </div>;
    } else {
      return <div></div>;
    }
  }
  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof PlacePolicy
   */
  public render() {

    const place = this.props.place;
    return (
      <div className='policies'>
        {this.type(place)}
        {this.search(place)}
        {this.receptive(place)}
      </div>
    );
  }
}

