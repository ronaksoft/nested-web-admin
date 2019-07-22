import * as React from 'react';
import _ from 'lodash';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import './crop.scss';

interface IProps {
  avatar: any;
  onCropped: (file: any) => void;
}

interface IStates {
  base64: string;
  crop: any;
  visible: boolean;
  file: any;
  maxHeight: number;
}

export default class NstCrop extends React.Component<IProps, IStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      base64: '',
      crop: {
        aspect: 1,
        keepSelection: true,
        x: 20,
        y: 20,
      },
      file: '',
      maxHeight: window.innerHeight - 200,
      visible: false,
    };
  }

  onCropComplete = () => {
    const imgDom = document.querySelector('.ReactCrop__image');
    this.getCroppedImg(imgDom, this.state.crop).then(file => {
      console.log(file);
      if (file) {
        this.props.onCropped(file);
        this.handleCancel();
      }
    });
  };

  componentWillReceiveProps(props: any) {
    let name;
    if (!this.props.avatar) {
      name = '';
    } else {
      name = this.props.avatar.name;
    }
    if (props.avatar && props.avatar.name && props.avatar.name !== name) {
      const file = props.avatar;
      const imageType = /^image\//;

      if (!file || !imageType.test(file.type)) {
        return;
      }
      const reader = new FileReader();

      reader.onload = (e2: Event) => {
        this.setState({
          base64: reader.result ? reader.result.toString() : '',
          file: props.avatar,
          visible: true,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onCropChange = (crop: any) => {
    this.setState({ crop });
  };

  onImageLoaded = (image: any) => {
    this.setState({
      crop: makeAspectCrop(
        {
          x: 0,
          y: 0,
          aspect: 1,
          width: 50,
        },
        image.naturalWidth,
        image.naturalHeight
      ),
    });
  };

  getCroppedImg = (image: any, pixelCrop: any, fileName: string = 'pic.jpg') => {
    const canvas = document.createElement('canvas');
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    canvas.width = (pixelCrop.width * naturalWidth) / 100;
    canvas.height = (pixelCrop.height * naturalHeight) / 100;
    const ctx = canvas.getContext('2d');

    image.style.width = naturalWidth;
    image.style.height = naturalHeight;
    if (ctx) {
      ctx.drawImage(
        image,
        (pixelCrop.x * naturalWidth) / 100,
        (pixelCrop.y * naturalHeight) / 100,
        (pixelCrop.width * naturalWidth) / 100,
        (pixelCrop.height * naturalHeight) / 100,
        0,
        0,
        (pixelCrop.width * naturalWidth) / 100,
        (pixelCrop.height * naturalHeight) / 100
      );
    }
    document.body.appendChild(canvas);
    return new Promise((resolve, reject) => {
      canvas.toBlob((file: any) => {
        file.name = fileName;
        return resolve(file);
      }, 'image/jpeg');
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const src = _.isString(this.state.base64) ? this.state.base64 : '';
    return (
      <Dialog
        className="crop-modal nst-modal"
        open={this.state.visible}
        onClose={this.handleCancel}
        maxWidth="lg"
      >
        <DialogTitle>Crop Image</DialogTitle>
        <DialogContent>
          <ReactCrop
            src={src}
            onImageLoaded={this.onImageLoaded}
            onChange={this.onCropChange}
            {...this.state}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={this.handleCancel}>
            Discard
          </Button>
          <Button variant="contained" color="primary" onClick={this.onCropComplete}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
