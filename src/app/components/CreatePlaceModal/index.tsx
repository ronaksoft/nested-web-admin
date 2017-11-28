import {link} from 'fs';
import * as React from 'react';
import _ from 'lodash';
import PlaceApi from '../../api/place/index';
import IPlace from '../../api/place/interfaces/IPlace';
import {Modal, Row, Col, Icon, Button, message, Form, Input, Select, notification, Upload} from 'antd';

let Option = Select.Option;
import PlaceAvatar from './../PlaceAvatar/index';
import AccountApi from '../../api/account/account';
import IUser from '../../api/account/interfaces/IUser';
import AAA from '../../services/classes/aaa/index';
import CONFIG from './../../../app.config';
import C_PLACE_POST_POLICY from '../../api/consts/CPlacePostPolicy';
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
    place: IPlace;
    model: any;
    token: string;
}


export default class CreatePlaceModal extends React.Component<IProps, IStates> {
    currentUser: IUser;
    accountApi: any;

    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            model: {
                id: '',
                name: '',
                description: '',
                picture: '',
                pictureData: '',
                addPostPolicy: C_PLACE_POST_POLICY.MANAGER,
                addPlacePolicy: C_PLACE_POST_POLICY.MANAGER,
                addMemberPolicy: C_PLACE_POST_POLICY.MANAGER,
                managerLimit: 10,
                memberLimit: 10,
                subPlaceLimit: 10,
                storageLimit: 10,
                members: [],
            }
        };
        if (this.props.place) {
            this.state.place = this.props.place;
        }
        /*else {
                   this.state.place = {
                       _id: '',
                       created_on: null,
                       creators: [],
                       description: '',
                       grand_parent_id: '',
                       groups: null,
                       limits: null,
                       name: null,
                       picture: null,
                       policy: {
                           add_post: 'manager',
                       },
                       privacy: null,
                       type: null,
                       unlocked_childs: null,
                       members: [],
                   };
               }*/
        this.currentUser = AAA.getInstance().getUser();
    }

    componentWillReceiveProps(props: any) {
        this.setState({
            visible: props.visible,
        });
    }

    componentDidMount() {
        this.accountApi = new AccountApi();
        if (this.props.place) {
            this.setState({
                visible: this.props.visible,
            });
        }
        this.loadUploadToken();
    }

    handleCancel() {
        this.props.onClose();
        this.setState({
            visible: false,
        });
    }

    loadUploadToken() {
        this.accountApi.getUploadToken().then((result) => {
            this.setState({
                token: result.token
            });
        }, (error) => {
            this.setState({
                token: null
            });
        });
    }

    getPostPolicyItem() {
        let placeId = this.state ? this.state.model.id : '';
        if (placeId !== '') {
            placeId = placeId + '@' + CONFIG.DOMAIN;
        }
        const sharePostItems = [
            {
                index: C_PLACE_POST_POLICY.MANAGER,
                label: 'manager',
                description: 'Managers Only',
                searchProperty: false,
            },
            {
                index: C_PLACE_POST_POLICY.MANGER_MEMBER,
                label: 'managerMember',
                description: 'This Place Managers & Members',
                searchProperty: false,
            },
            {
                index: C_PLACE_POST_POLICY.TEAM,
                label: 'team',
                description: 'All Grand Place Members',
                searchProperty: true,
            },
            {
                index: C_PLACE_POST_POLICY.COMPANY,
                label: 'building',
                description: 'All Company Members',
                searchProperty: true,
            },
            {
                index: C_PLACE_POST_POLICY.EMAIL,
                label: 'atsign',
                description: `All Company Members + Everyone via Email: <br> <a href="mailto:${placeId}">${placeId}</a>`,
                searchProperty: true,
                searchText: 'Searchable for Company Accounts',
            }
        ];
        return sharePostItems;
    }

    getPolicyItem() {
        const createPlaceItems = [
            {
                index: C_PLACE_POST_POLICY.MANAGER,
                label: 'manager',
                description: 'Managers Only',
                searchProperty: false,
            },
            {
                index: C_PLACE_POST_POLICY.MANGER_MEMBER,
                label: 'managerMember',
                description: 'This Place Managers & Members',
                searchProperty: false,
            }
        ];
        return createPlaceItems;
    }

    updateModel(params: any) {
        const model = this.state.model;
        _.forEach(params, (val, index) => {
            model[index] = val;
        });
        this.setState({
            model: model,
        });
    }

    extractNumber(text: any) {
        return parseInt(text.replace(/[^0-9]/g,''), 0);
    }

    updatePlaceId(event: any) {
        this.updateModel({
            id: event.currentTarget.value,
        });
    }

    updatePlaceName(event: any) {
        this.updateModel({
            name: event.currentTarget.value,
        });
    }

    updatePlacePostPolicy(index: any) {
        this.updateModel({
            addPostPolicy: index,
        });
    }

    updatePlaceCreateSubPlacePolicy(index: any) {
        this.updateModel({
            addPlacePolicy: index,
        });
    }

    updatePlaceAddMemberPolicy(index: any) {
        this.updateModel({
            addMemberPolicy: index,
        });
    }

    updatePlaceMangerLimit(event: any) {
        this.updateModel({
            managerLimit: this.extractNumber(event.currentTarget.value),
        });
    }

    updatePlaceMemberLimit(event: any) {
        this.updateModel({
            memberLimit: this.extractNumber(event.currentTarget.value),
        });
    }

    updatePlaceSubPlaceLimit(event: any) {
        this.updateModel({
            subPlaceLimit: this.extractNumber(event.currentTarget.value),
        });
    }

    updatePlaceStorageLimit(event: any) {
        this.updateModel({
            storageLimit: this.extractNumber(event.currentTarget.value),
        });
    }

    pictureChange(info: any) {
        if (info.file.status === 'done') {
            this.updateModel({
                picture: info.file.response.data[0].universal_id,
                pictureData: info.file.response.data[0].thumbs,
            });
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    beforeUpload() {
        if (!this.state.token) {
            notification.error({
                message: 'Error',
                description: 'We are not able to upload the picture.'
            });
            return false;
        }
    }

    discard() {
        this.props.onClose(true);
    }

    create() {
        console.log(this.state.model);
    }

    render() {
        const sharePostItems = this.getPostPolicyItem();
        const createPlaceItems = this.getPolicyItem();
        const credentials = AAA.getInstance().getCredentials();
        const uploadUrl = `${CONFIG.STORE.URL}/upload/place_pic/${credentials.sk}/${this.state.token}`;

        const modalFooter = (
            <div className='modal-foot'>
                <Button type=' butn butn-white' onClick={this.discard.bind(this)}>Discard</Button>
                <Button type=' butn butn-green' onClick={this.create.bind(this)}>Create Place</Button>
            </div>
        );

        let model = this.state.model;
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
                            <PlaceAvatar avatar={model.pictureData}/>
                            <Upload
                                name='avatar'
                                action={uploadUrl}
                                accept={'image/*'}
                                showUploadList={false}
                                onChange={this.pictureChange.bind(this)}
                                beforeUpload={this.beforeUpload.bind(this)}
                            >
                                <Button type=' butn secondary'>
                                    Upload a Photo
                                </Button>
                            </Upload>
                        </Row>
                        <Row className='input-row'>
                            <label htmlFor='name'>Name</label>
                            <Input id='name' size='large' className='nst-input' value={model.name}
                                   onChange={this.updatePlaceName.bind(this)}/>
                        </Row>
                        <Row className='input-row'>
                            <label htmlFor='placeId'>Place ID</label>
                            <Input id='placeId' size='large' className='nst-input' value={model.id}
                                   onChange={this.updatePlaceId.bind(this)}/>
                            <p>Place will be identified by this unique address: grand-place.choosen-id You can't change
                                this afterwards, so choose wisely!</p>
                        </Row>
                        <Row className='input-row'>
                            <label htmlFor='description'>Description</label>
                            <Input id='description' size='large' className='nst-input'/>
                        </Row>
                        <Row className='input-row select-level'>
                            <label>Who can share posts with this Place?</label>
                            <SelectLevel index={model.addPostPolicy} items={sharePostItems}
                                         onChangeLevel={this.updatePlacePostPolicy.bind(this)}/>
                        </Row>
                        <Row className='input-row select-level'>
                            <label>Who can create sub-places in this Place?</label>
                            <SelectLevel index={model.addPlacePlicy} items={createPlaceItems}
                                         onChangeLevel={this.updatePlaceCreateSubPlacePolicy.bind(this)}/>
                        </Row>
                        <Row className='input-row select-level'>
                            <label>Who can add member to this Place?</label>
                            <SelectLevel index={model.addMemberPolicy} items={createPlaceItems}
                                         onChangeLevel={this.updatePlaceAddMemberPolicy.bind(this)}/>
                        </Row>
                        <Row className='input-row' gutter={24}>
                            <Col span={12}>
                                <label htmlFor='limitManager'>Max. Managers</label>
                                <Input id='limitManager' size='large' className='nst-input' value={model.managerLimit} onChange={this.updatePlaceMangerLimit.bind(this)}/>
                            </Col>
                            <Col span={12}>
                                <label htmlFor='limitMember'>Max. Members</label>
                                <Input id='limitMember' size='large' className='nst-input' value={model.memberLimit} onChange={this.updatePlaceMemberLimit.bind(this)}/>
                            </Col>
                        </Row>
                        <Row className='input-row' gutter={24}>
                            <Col span={12}>
                                <label htmlFor='limitSubPlaces'>Max. Sub-Places</label>
                                <Input id='limitSubPlaces' size='large' className='nst-input' value={model.subPlaceLimit} onChange={this.updatePlaceSubPlaceLimit.bind(this)}/>
                            </Col>
                            <Col span={12}>
                                <label htmlFor='limitStorage'>Max. Storage</label>
                                <Input id='limitStorage' size='large' className='nst-input' value={model.storageLimit} onChange={this.updatePlaceStorageLimit.bind(this)}/>
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
