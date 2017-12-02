import * as React from 'react';
import IPlace from './../../api/place/interfaces/IPlace';
import CONFIG from 'src/app/config';
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


export interface IPlaceViewProps {
    borderRadius : string;
    place : IPlace;
    size : any;
    style: string;
    className: string;
    avatar : boolean;
    name : boolean;
    id : boolean;
}

export interface IPlaceViewStates {}

class PlaceView extends React.Component<IPlaceViewProps, IPlaceViewStates> {
  render() {
    let {
      borderRadius,
      place,
      size,
      style,
      className,
      avatar,
      name,
      id
    } = this.props;
    let placeAvatar;
    if (size === 64) { placeAvatar = true; }
    size = size.toString(10) + 'px';

    const ImageHolder = {
      width: size,
      height: size,
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
      flex: 'none',
      borderRadius : borderRadius,
      alignSelf: 'center',
    };

    const innerStyle = {
      lineHeight: size,
      display: 'flex',
      borderRadius : borderRadius
    };

    const imageStyle = {
      display: 'flex',
      borderRadius : borderRadius,
      margin: '0!important',
      width: size,
      height: size,
    };

    const textStyle = {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '135px',
      fontSize: '14px',
      lineHeight: '19px',
      color: 'black',
      paddingLeft: '8px'
    };

    const textIdStyle = {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '135px',
      fontSize: '12px',
      lineHeight: '17px',
      color: 'rgba(0,0,0,.48)',
      paddingLeft: '8px'
    };

    if (size) {
      imageStyle.width = settings.width = size;
      imageStyle.height = settings.height = size;
    }

    let imgDOM, nameDOM, idDOM, classes = [className, 'PlaveView'];
    let placeName = `${place.name}`;

    if (avatar) {
      if ( placeAvatar ) {
        let src = place.picture.x64 ? `${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${place.picture.x64}` : './../../../style/images/absents_place.svg';
        imgDOM = <img className='PlaceView--img' style={imageStyle} src={src}  alt={place.name} />;
      } else {
        let src = place.picture.x32 ? `${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${place.picture.x32}` : './../../../style/images/absents_place.svg';
        imgDOM = <img className='PlaceView--img' style={imageStyle} src={src}  alt={place.name} />;
      }

    }

    if ( name ) {
      nameDOM = <span style={textStyle}>{placeName}</span>;
    }

    if ( id ) {
      idDOM = <span style={textIdStyle}>{`${place._id}`}</span>;
    }





    return (
      <div aria-label={placeName} className={classes.join(' ')} style={style}>
        <div className='PlaceView--inner' style={innerStyle}>
          <div className={placeAvatar ? '' : 'ImageHolder-place'} style={ImageHolder}>
            {avatar && imgDOM}
          </div>
          <div className='PlaveView-detail'>
            {name && nameDOM}
            {id && idDOM}
          </div>
        </div>
      </div>
    );
  }
}
export default PlaceView;
