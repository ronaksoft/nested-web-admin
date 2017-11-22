import { link } from 'fs';
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
import SelectLevel from '../SelectLevel/index';
import _ from 'lodash';
import {IcoN} from '../icon/index';

interface IProps {
    place?: IPlace;
    visible?: boolean;
    onClose?: () => {};
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
        this.props.onClose();
        this.setState({
            visible: false,
        });
    }

    render() {
        const sharePostItems = [
            {
              index: 0,
              label: 'manager',
              description: 'Managers Only',
              searchProperty: false,
            },
            {
              index: 1,
              label: 'managerMember',
              description: 'This Place Managers & Members',
              searchProperty: false,
            },
            {
              index: 2,
              label: 'team',
              description: 'All Grand Place Members',
              searchProperty: true,
            },
            {
              index: 3,
              label: 'building',
              description: 'All Company Members',
              searchProperty: true,
            },
            {
              index: 4,
              label: 'atsign',
              description: 'All Company Members + Everyone via Email:',
              searchProperty: true,
            }
        ];
        const createPlaceItems = [
            {
              index: 0,
              label: 'manager',
              description: 'Managers Only',
              searchProperty: false,
            },
            {
              index: 1,
              label: 'managerMember',
              description: 'This Place Managers & Members',
              searchProperty: false,
            }
        ];
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

        const modalFooter = (
            <div className='modal-foot'>
                <Button type=' butn butn-white'>Discard</Button>
                <Button type=' butn butn-green'>Create Place</Button>
            </div>
        );

        return (
            <Modal className='create-place-modal'
                maskClosable={true}
                width={800}
                closable={true}
                onCancel={this.handleCancel.bind(this)}
                visible={true}
                footer={modalFooter}
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
                        <Row className='input-row select-level'>
                            <label>Who can share posts with this Place?</label>
                            <SelectLevel level={0} items={sharePostItems}/>
                        </Row>
                        <Row className='input-row select-level'>
                            <label>Who can create sub-places in this Place?</label>
                            <SelectLevel level={0} items={createPlaceItems}/>
                        </Row>
                        <Row className='input-row select-level'>
                            <label>Who can add member to this Place?</label>
                            <SelectLevel level={0} items={createPlaceItems}/>
                        </Row>
                        <Row className='input-row' gutter={24}>
                            <Col span={12}>
                                <label htmlFor='limitManager'>Max. Managers</label>
                                <Input id='limitManager' size='large' className='nst-input'/>
                            </Col>
                            <Col span={12}>
                                <label htmlFor='limitMember'>Max. Managers</label>
                                <Input id='limitMember' size='large' className='nst-input'/>
                            </Col>
                        </Row>
                        <Row className='input-row' gutter={24}>
                            <Col span={12}>
                                <label htmlFor='limitSubPlaces'>Max. Sub-Places</label>
                                <Input id='limitSubPlaces' size='large' className='nst-input'/>
                            </Col>
                            <Col span={12}>
                                <label htmlFor='limitStorage'>Max. Storage</label>
                                <Input id='limitStorage' size='large' className='nst-input'/>
                            </Col>
                        </Row>
                    </Col>
                    <Col className='place-members' span={8}>
                        <h3>Members</h3>
                        <ul>
                            <li className='addMemberItem'>
                                <IcoN size={16} name={'cross16'}/>
                                Add member...
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Modal>
        );
    }

}
