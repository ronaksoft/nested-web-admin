import * as React from 'react';
import IUser from './../../api/account/interfaces/IUser';
import CONFIG from '../../../app.config';
import AAA from './../../services/classes/aaa/index';
const settings = {
  textColor: '#ffffff',
  height: 24,
  width: 24,
  fontSize: 11,
  fontWeight: 400,
  fontFamily: 'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif',
  radius: 0
};
const defaultColors = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FF9800',
  '#FF5722',
  '#607D8B'
];
const textAtts = {
  'y': '50%',
  'x': '50%',
  'dy': '0.35em',
  'pointer-events': 'auto',
  'fill': settings.textColor,
  'font-family': settings.fontFamily,
  'text-anchor': 'middle',
};
const svgAtts = {
  'xmlns': 'http://www.w3.org/2000/svg',
  'pointer-events': 'none',
  'width': settings.width,
  'height': settings.height
};

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
  getIndexStr(username : string) {
    let value = 0;

    for (let i = 0; i < username.length; i++) {
      value += username.charCodeAt(i);
    }
    return this.getInitialValue(value);

  }
  getInitialValue(value : number) {
    let sum = 0;

    while (value > 0) {
        sum = sum + value % 10;
        value = value / 10;
    }

    if (sum < 16) {
        return Math.floor(sum);
    } else {
        return this.getInitialValue(sum);
    }
  }
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

    let imageClass;
    switch (size) {
    case 20:
        imageClass = 'ImageHolder-avatar-20';
        break;
    case 24:
        imageClass = 'ImageHolder-avatar-24';
        break;
    case 64:
        imageClass = 'ImageHolder-avatar-64';
        break;
    default:
        imageClass = 'ImageHolder-avatar';
}

    size = size.toString(10) + 'px';


    const imageStyle = {
      display: 'flex',
      borderRadius,
      margin: '0!important',
      width: size,
      height: size
    };

    const innerStyle = {
      lineHeight: size,
      display: 'flex',
      textAlign: 'center',
      borderRadius
    };

    const ImageHolder = {
      width: size,
      height: size,
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
      flex: 'none',
      borderRadius
    };

    const textStyle = {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '135px',
      fontSize: '14px',
      lineHeight: size,
      color: 'black',
      paddingLeft: '8px'
    };

    if (size) {
      imageStyle.width = settings.width = size;
      imageStyle.height = settings.height = size;
    }

    let imgDOM, nameDOM, idDOM, classes = [className, 'UserAvatar'];
    let nameOfUser = `${user.fname} ${user.lname}`;

    let pictureId = null;

    if (this.props.size <= 32) {
      pictureId = user.picture.x32;
    } else if (this.props.size <= 64) {
      pictureId = user.picture.x64;
    } else {
      pictureId = user.picture.x128;
    }

    if (avatar) {
      if (pictureId) {
        imgDOM = <img className='UserAvatar--img' style={imageStyle} src={`${CONFIG.STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${pictureId}`}  alt={user.name} />;
      } else {
        // iTODO Initails
        let abbr, finalColor;
        if ( nameOfUser ) {
          abbr = nameOfUser.split(' ').slice(0, 2).map(function(item : any) {return item[0]; }).join('');
        } else {
          abbr = 'U';
        }

        let c = abbr.toUpperCase();

        let colorIndex = this.getIndexStr(user._id);
        finalColor = defaultColors[colorIndex];


        let cobj = document.createElement('text');
        for ( let k in textAtts) {
          if (k) {
            cobj.setAttribute(k, textAtts[k]);
          }
        }
        cobj.style.fontWeight = 400;
        cobj.style.fontSize = settings.fontSize + 'px';

        cobj.innerHTML = c;

        let svg = document.createElement('svg');
        for (let key in svgAtts) {
          if (key) {
            svg.setAttribute(key, svgAtts[key]);
          }

        }

        svg.style.backgroundColor = finalColor;
        svg.style.width = settings.width + 'px';
        svg.style.height = settings.height + 'px';
        svg.style.borderRadius = settings.radius + 'px';

        svg.appendChild(cobj);

        let div = document.createElement('div');
        div.appendChild(svg);

        let svgHtml = window.btoa(unescape(encodeURIComponent(div.innerHTML)));

        let src = 'data:image/svg+xml;base64,' + svgHtml;


        imgDOM = <img className='UserAvatar--img' style={imageStyle} src={src}  alt={nameOfUser} />;

      }
    }

    if ( name ) {
      nameDOM = <span style={textStyle}>{nameOfUser}</span>;
    }

    if ( id ) {
      idDOM = <span style={textStyle}>{`${user._id}`}</span>;
    }


    return (
      <div aria-label={name} className={classes.join(' ')} style={style}>
        <div className='UserAvatar--inner' style={innerStyle}>
          <div className={imageClass} style={ImageHolder}>
            {avatar && imgDOM}
          </div>
          {name && nameDOM}
          {id && idDOM}
        </div>
      </div>
    );
  }
}
export default UserAvatar;
