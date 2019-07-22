import * as React from 'react';
import IPlace from './../../interfaces/IPlace';
import CONFIG from '../../config';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import AAA from './../../services/classes/aaa/index';
const settings = {
  textColor: '#ffffff',
  height: 24,
  width: 24,
  fontSize: 11,
  fontWeight: 400,
  fontFamily:
    'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif',
  radius: 0,
};

export interface IPlaceViewProps {
  borderRadius?: string;
  place: IPlace;
  size: any;
  style?: React.CSSProperties;
  className?: string;
  avatar: boolean;
  name?: boolean;
  id: boolean;
  onClick?: (place: IPlace) => void;
  classes: any;
}

export interface IPlaceViewStates {}

class PlaceView extends React.Component<IPlaceViewProps, IPlaceViewStates> {
  clickHandler = () => {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(this.props.place);
    }
  };
  render() {
    let { borderRadius, place, size, style, className, avatar, name, id, classes } = this.props;
    let placeAvatar;
    if (size === 64) {
      placeAvatar = true;
    }
    size = size.toString(10) + 'px';

    const ImageHolder: React.CSSProperties = {
      width: size,
      height: size,
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
      flex: 'none',
      borderRadius: borderRadius,
      alignSelf: 'center',
    };

    const innerStyle = {
      lineHeight: size,
      display: 'flex',
      borderRadius: borderRadius,
    };

    const imageStyle = {
      display: 'flex',
      borderRadius: borderRadius,
      margin: '0!important',
      width: size,
      height: size,
    };

    const textStyle: React.CSSProperties = {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '133px',
      fontSize: '14px',
      lineHeight: '19px',
      color: 'black',
      paddingLeft: '8px',
    };

    const textIdStyle: React.CSSProperties = {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '133px',
      fontSize: '12px',
      lineHeight: '17px',
      color: 'rgba(0,0,0,.48)',
      paddingLeft: '8px',
    };

    if (size) {
      imageStyle.width = settings.width = size;
      imageStyle.height = settings.height = size;
    }

    let imgDOM,
      nameDOM,
      idDOM,
      classList = [className, classes.PlaveView];
    let placeName = `${place.name}`;

    if (avatar) {
      if (placeAvatar) {
        let src = place.picture.x64
          ? `${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${
              place.picture.x64
            }`
          : '/images/absents_place.svg';
        imgDOM = <img className="PlaceView--img" style={imageStyle} src={src} alt={place.name} />;
      } else {
        let src = place.picture.x32
          ? `${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${
              place.picture.x32
            }`
          : '/images/absents_place.svg';
        imgDOM = <img className="PlaceView--img" style={imageStyle} src={src} alt={place.name} />;
      }
    }

    if (name) {
      nameDOM = <span style={textStyle}>{placeName}</span>;
    }

    if (id) {
      idDOM = <span style={textIdStyle}>{`${place._id}`}</span>;
    }

    return (
      <div
        aria-label={placeName}
        className={classList.join(' ')}
        style={style}
        onClick={this.clickHandler}
      >
        <div className={classes.inner} style={innerStyle}>
          <div className={placeAvatar ? '' : 'place-avatar-border'} style={ImageHolder}>
            {avatar && imgDOM}
          </div>
          <div className={classes.plaveViewDetail}>
            {name && nameDOM}
            {id && idDOM}
          </div>
        </div>
      </div>
    );
  }
}
export default withStyles((theme: Theme) =>
  createStyles({
    PlaveView: {
      margin: '0 4px',
    },
    plaveViewDetail: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
    },
  })
)(PlaceView);
