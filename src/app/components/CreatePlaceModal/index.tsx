import * as React from 'react';
import PlaceApi from '../../api/place/index';
import IPlace from '../../api/place/interfaces/IPlace';
import {Modal, Row, Col, Icon, Button, message, Form, Input, Select, notification, Upload} from 'antd';

let Option = Select.Option;
import PlaceView from './../placeview/index';
import Avatar from './../avatar/index';
import PlaceItem from '../PlaceItem/index';
import UserItem from '../UserItem/index';
import AccountApi from '../../api/account/account';
import View from '../../scenes/Accounts/components/View/index';
import IUser from '../../api/account/interfaces/IUser';
import AAA from '../../services/classes/aaa/index';
import C_PLACE_TYPE from '../../api/consts/CPlaceType';
import EditableFields from './EditableFields';
import _ from 'lodash';

interface IProps {
    place?: IPlace;
    visible?: boolean;
    onClose?: any;
    onChange?: (place: IPlace) => {};
}

interface IStates {
    visible: boolean;
    place?: IPlace;
}


export default class CreatePlaceModal extends React.Component<IProps, IStates> {
    currentUser: IUser;
    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            place: this.props.place,
        };
        this.currentUser = AAA.getInstance().getUser();
    }

    componentWillReceiveProps(props: any) {
        this.setState({
            visible: props.visible,
        });
    }

    componentDidMount() {
        if (this.props.place) {
            this.setState({
                visible: this.props.visible,
            });
        }
    }

    handleCancel() {
        console.log('a');
    }

    render() {
        const props = {
            name: 'file',
            action: '//jsonplaceholder.typicode.com/posts/',
            headers: {
              authorization: 'authorization-text',
            },
            onChange(info: any) {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
            },
        };
        return (
            <Modal className='create-place-modal'
                maskClosable={true}
                width={800}
                closable={true}
                onCancel={this.handleCancel.bind(this)}
                visible={this.state.visible}
                footer={null}
                title='Create a Private Place'>
                <Row>
                    <Col className='place-info' span={16}>
                        <Row className='place-picture' type='flex' align='middle'>
                            <img src=''/>
                            <Upload {...props}>
                                <Button type=' butn secondary'>
                                    Upload a Photo
                                </Button>
                            </Upload>
                        </Row>
                        <Row className='input-row'>
                            <label htmlFor='name'>Name</label>
                            <Input id='name' size='large' className='nst-input'/>
                        </Row>
                        <Row className='input-row'>
                            <label htmlFor='placeId'>Place ID</label>
                            <Input id='placeId' size='large' className='nst-input'/>
                            <p>Place will be identified by this unique address: grand-place.choosen-id You can't change this afterwards, so choose wisely!</p>
                        </Row>
                        <Row className='input-row'>
                            <label htmlFor='description'>Description</label>
                            <Input id='description' size='large' className='nst-input'/>
                        </Row>
                        <Row className='select-level'>
                            <label>Who can share posts with this Place?</label>
                            <SelectLevel levels={5} onChange=''/>
                        </Row>
                    </Col>
                    <Col className='place-members' span={8}>
                        s
                    </Col>
                </Row>
            </Modal>
        );
    }

}
