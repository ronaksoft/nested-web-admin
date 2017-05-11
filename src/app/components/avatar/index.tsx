import * as React from 'react';
import IUser from './../../api/account/interfaces/IUser';
import CONFIG from '/src/app.config';
import AAA from '/src/app/services/classes/aaa/index';


export interface IAvatarProps {
    borderRadius : string;
    user : IUser;
    size : any;
    style: string;
    className: string;
    avatar : boolean;
    name : boolean;
    id : boolean;
}

export interface IAvatarStates {}

class UserAvatar extends React.Component<IAvatarProps, IAvatarStates> {
  render() {
    let {
      borderRadius= '100%',
      user,
      size,
      style,
      className,
      avatar,
      name,
      id
    } = this.props;

    size = size.toString(10) + 'px';

    const imageStyle = {
      display: 'block',
      borderRadius
    };

    const innerStyle = {
      lineHeight: size,
      textAlign: 'center',
      borderRadius
    };

    if (size) {
      imageStyle.width = size;
      imageStyle.height = size;
    }

    let imgDOM, nameDOM, idDOM, classes = [className, 'UserAvatar'];

    if (avatar) {
      if (user.picture) {
        imgDOM = <img className='UserAvatar--img' style={imageStyle} src={`${CONFIG.STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${user.picture.x32}`}  alt={user.name} />;
      } else {
        // iTODO Initails
      }
    }

    if ( name ) {
      nameDOM = <span>{user.name}</span>;
    }

    if ( id ) {
      idDOM = <span>{user._id}</span>;
    }





    return (
      <div aria-label={name} className={classes.join(' ')} style={style}>
        <div className='UserAvatar--inner' style={innerStyle}>
          {avatar && imgDOM}
          {name && nameDOM}
          {id && idDOM}
        </div>
      </div>
    );
  }
}
export default UserAvatar;
