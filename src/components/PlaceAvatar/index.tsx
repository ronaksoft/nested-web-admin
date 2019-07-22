import _ from 'lodash';
import * as React from 'react';
import CONFIG from '../../config';
import AAA from './../../services/classes/aaa/index';

export interface IAvatarProps {
  avatar: any;
}

export interface IAvatarStates {
  src: string;
}

class PlaceAvatar extends React.Component<IAvatarProps, IAvatarStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      src: this.getImage(this.props.avatar),
    };
  }

  public getImage = (avatar: any): string => {
    if (avatar && avatar !== null) {
      if (_.isString(avatar)) {
        return 'data:image/svg+xml;base64,' + avatar;
      } else if (avatar.x64) {
        return `${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${avatar.x64}`;
      } else {
        return `/images/ph_place.png`;
      }
    } else {
      return `/images/ph_place.png`;
    }
  };

  public componentWillReceiveProps(newProps: any) {
    this.setState({
      src: this.getImage(newProps.avatar),
    });
  }

  public render() {
    return <img src={this.state.src} alt="Place Avatar" />;
  }
}

export default PlaceAvatar;
