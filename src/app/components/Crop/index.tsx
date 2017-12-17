import * as React from 'react';
import {Modal, Row, Col, Icon, Button, message, Form, Input, Select, notification, Upload} from 'antd';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';

import _ from 'lodash';
import {IcoN} from '../icon/index';

interface IProps {
    avatar: any;
    onCropped: (file: any) => {};
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
            crop: {
                x: 20,
                y: 20,
                aspect: 1,
                keepSelection : true
              },
              visible: false,
              maxHeight: window.innerHeight - 200,
              base64: '',
              file: ''
        };
    }

    onCropComplete = () => {
        // console.log('onCropComplete, pixelCrop:', crop, pixelCrop, this.props.avatar);
        var imgDom = $('.ReactCrop__image')[0];
        this.getCroppedImg(imgDom, this.state.crop, 'pic.jpg').then(file => {
            if (file) {
                this.props.onCropped(file);
                this.handleCancel();
            }
        });
    }

    componentWillReceiveProps (props: any) {
        console.log(props, this.props);
        let name;
        if(!this.props.avatar) {
            name = '';
        } else {
            name = this.props.avatar.name;
        }
        if(props.avatar && props.avatar.name && props.avatar.name !== name) {
            const file = props.avatar;
            const imageType = /^image\//;

            if (!file || !imageType.test(file.type)) {
                return;
            }
            const reader = new FileReader();

            reader.onload = (e2) => {
                this.setState({
                    base64: e2.target.result,
                    file: props.avatar,
                    visible: true,
                });
            };
            reader.readAsDataURL(file);
        }
    }

    onCropChange = (crop) => {
        this.setState({ crop });
    }

    onImageLoaded = (image) => {
        this.setState({
          crop: makeAspectCrop({
            x: 0,
            y: 0,
            aspect: 1,
            width: 50,
          }, image.naturalWidth / image.naturalHeight),
          image,
        });
    }

    getCroppedImg = (image: any, pixelCrop: any, fileName: string) => {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        );
        // as Base64 string
        // const base64Image = canvas.toDataURL('image/jpeg');
        // as a blob
        return new Promise((resolve, reject) => {
            canvas.toBlob(file => {
                file.name = fileName;
                return resolve(file);
            }, 'image/jpeg');
        });
    }

    handleCancel () {
        this.setState({
            visible: false
        });
    }

    render() {
        const src = _.isString(this.state.base64) ? this.state.base64 : '';
        const modalFooter = (
            <div className='modal-foot'>
                <Button
                    type=' butn butn-white'
                    onClick={this
                        .handleCancel
                        .bind(this)}>Discard</Button>
                <Button
                    type=' butn butn-green'
                    onClick={this
                        .onCropComplete
                        .bind(this)}>Done</Button>
            </div>
        );
        return (
            <Modal
                    className='crop-modal nst-modal'
                    maskClosable={true}
                    width={800}
                    closable={true}
                    onCancel={this.handleCancel.bind(this)}
                    visible={this.state.visible}
                    footer={modalFooter}
                    title='Crop Image'>
                <ReactCrop src={src}
                    onImageLoaded={this.onImageLoaded.bind(this)}
                    onChange={this.onCropChange.bind(this)}
                    {...this.state}
                />
            </Modal>
        );
    }

}
