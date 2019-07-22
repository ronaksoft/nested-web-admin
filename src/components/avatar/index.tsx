import * as React from 'react';

import AAA from './../../services/classes/aaa/index';
import CONFIG from '../../config';
import IUser from './../../interfaces/IUser';
import AccountApi from '../../api/account';

const settings = {
  fontFamily:
    'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif',
  fontSize: 11,
  fontWeight: 400,
  height: 24,
  radius: 0,
  textColor: '#ffffff',
  width: 24,
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
  '#607D8B',
];
const textAtts = {
  dy: '0.35em',
  fill: settings.textColor,
  'font-family': settings.fontFamily,
  'pointer-events': 'auto',
  'text-anchor': 'middle',
  x: '50%',
  y: '50%',
};
const svgAtts = {
  height: settings.height,
  'pointer-events': 'none',
  width: settings.width,
  xmlns: 'http://www.w3.org/2000/svg',
};

export interface IAvatarProps {
  borderRadius?: string;
  user: IUser | string;
  size?: any;
  style?: any;
  className?: string;
  avatar?: boolean;
  name?: boolean;
  id?: boolean;
}

export interface IAvatarStates {
  user: IUser | null;
}

class UserAvatar extends React.Component<IAvatarProps, IAvatarStates> {
  private accountApi: AccountApi = new AccountApi();

  constructor(props) {
    super(props);
    this.state = {
      user: typeof props.user === 'string' ? null : props.user,
    };
  }

  componentDidMount() {
    if (typeof this.props.user === 'string') {
      this.accountApi
        .accountGet({
          account_id: this.props.user,
        })
        .then((user: IUser) => {
          this.setState({ user });
        });
    } else {
      this.setState({ user: this.props.user });
    }
  }

  componentWillReceiveProps(nProps) {
    if (typeof nProps.user === 'string') {
      this.accountApi
        .accountGet({
          account_id: nProps.user,
        })
        .then((user: IUser) => {
          this.setState({ user });
        });
    } else {
      this.setState({ user: nProps.user });
    }
  }

  public render() {
    let { size } = this.props;
    const { borderRadius = '100%', style, className, avatar, name, id } = this.props;
    const { user } = this.state;

    if (!user) {
      return <div />;
    }

    let imageClass;
    if (size) {
      switch (size) {
        case 16:
          imageClass = 'ImageHolder-avatar-16';
          break;
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
    } else {
      size = '0';
    }

    const imageStyle: React.CSSProperties = {
      borderRadius,
      display: 'flex',
      height: size,
      margin: '0!important',
      width: size,
    };

    const innerStyle: React.CSSProperties = {
      borderRadius,
      display: 'flex',
      lineHeight: size,
      textAlign: 'center',
    };

    const ImageHolder: React.CSSProperties = {
      borderRadius,
      display: 'flex',
      flex: 'none',
      height: size,
      justifyContent: 'center',
      position: 'relative',
      width: size,
    };

    const textStyle: React.CSSProperties = {
      color: 'black',
      fontSize: '14px',
      lineHeight: size,
      maxWidth: '133px',
      overflow: 'hidden',
      paddingLeft: '8px',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };

    if (size) {
      imageStyle.width = settings.width = size;
      imageStyle.height = settings.height = size;
    }

    let imgDOM;
    let nameDOM;
    let idDOM;
    const classes = [className, 'UserAvatar'];
    const nameOfUser = `${user.fname} ${user.lname}`;

    let pictureId: string = '';

    if (user.picture) {
      if (this.props.size <= 32) {
        pictureId = user.picture.x32;
      } else if (this.props.size <= 64) {
        pictureId = user.picture.x64;
      } else {
        pictureId = user.picture.x128;
      }
    }

    if (avatar) {
      if (pictureId) {
        imgDOM = (
          <img
            className="UserAvatar--img"
            style={imageStyle}
            src={`${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${pictureId}`}
            alt={user.fullName}
          />
        );
      } else {
        // iTODO Initails
        let abbr;
        let finalColor;
        if (nameOfUser) {
          abbr = nameOfUser
            .split(' ')
            .slice(0, 2)
            .map((item: any) => {
              return item[0];
            })
            .join('');
        } else {
          abbr = 'U';
        }

        const c = abbr.toUpperCase();

        const colorIndex = this.getIndexStr(user._id);
        finalColor = defaultColors[colorIndex];

        const cobj = document.createElement('text');
        for (let k in textAtts) {
          if (k) {
            cobj.setAttribute(k, textAtts[k]);
          }
        }
        cobj.style.fontWeight = '400';
        cobj.style.fontSize = settings.fontSize + 'px';

        cobj.innerHTML = c;

        const svg = document.createElement('svg');
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

        const div = document.createElement('div');
        div.appendChild(svg);

        const svgHtml = window.btoa(unescape(encodeURIComponent(div.innerHTML)));

        const src = 'data:image/svg+xml;base64,' + svgHtml;

        imgDOM = <img className="UserAvatar--img" style={imageStyle} src={src} alt={nameOfUser} />;
      }
    }

    if (name) {
      nameDOM = <span style={textStyle}>{nameOfUser}</span>;
    }

    if (id) {
      idDOM = <span style={textStyle}>{`${user._id}`}</span>;
    }

    return (
      <div className={classes.join(' ')} style={style || {}}>
        <div className="UserAvatar--inner" style={innerStyle}>
          {avatar && (
            <div className={imageClass} style={ImageHolder}>
              {imgDOM}
            </div>
          )}
          {name && nameDOM}
          {id && idDOM}
        </div>
      </div>
    );
  }

  private getIndexStr(username: string) {
    let value = 0;

    for (let i = 0; i < username.length; i++) {
      value += username.charCodeAt(i);
    }
    return this.getInitialValue(value);
  }

  private getInitialValue(value: number): number {
    let sum = 0;

    while (value > 0) {
      sum = sum + (value % 10);
      value = value / 10;
    }

    if (sum < 16) {
      return Math.floor(sum);
    } else {
      return this.getInitialValue(sum);
    }
  }
}
export default UserAvatar;
