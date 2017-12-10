import {link} from 'fs';
import * as React from 'react';
import _ from 'lodash';
import PlaceApi from '../../api/place/index';
import IPlace from '../../api/place/interfaces/IPlace';
import {
    Modal,
    Row,
    Col,
    Icon,
    Button,
    message,
    Form,
    Input,
    Select,
    notification,
    Upload
} from 'antd';

let Option = Select.Option;
import PlaceAvatar from './../PlaceAvatar/index';
import AccountApi from '../../api/account/account';
import IUser from '../../api/account/interfaces/IUser';
import AAA from '../../services/classes/aaa/index';
import CONFIG from 'src/app/config';
import C_PLACE_POST_POLICY from '../../api/consts/CPlacePostPolicy';
import SelectLevel from '../SelectLevel/index';
import AddMemberModal from '../AddMember/index';
import _ from 'lodash';
import {IcoN} from '../icon/index';
import IPlaceCreateRequest from '../../api/place/interfaces/IPlaceCreateRequest';
import UserAvatar from '../avatar/index';

interface IProps {
    place?: IPlace;
    visible?: boolean;
    grandPlaceId?: string;
    onClose?: (v: boolean) => {};
    onChange?: (place: IPlace) => {};
}

interface IStates {
    visible: boolean;
    visibleAddMemberModal: boolean;
    place: IPlace;
    model: any;
    token: string;
    idValidation: any;
    formValid: boolean;
    showError: boolean;
    uploadPercent: number;
    imageIsUploading: boolean;
    grandPlaceId: string;
}


export default class CreatePlaceModal extends React.Component<IProps, IStates> {
    currentUser: IUser;
    accountApi: any;
    placeApi: any;
    placeIdRegex: any;
    checkId: any;

    constructor(props: any) {
        super(props);
        this.placeIdRegex = new RegExp('^[A-Za-z][A-Za-z0-9-]*$');
        this.checkId = _.debounce(this.checkIdAvailability, 512);
        this.state = {
            visible: false,
            uploadPercent: 0,
            visibleAddMemberModal: false,
            model: {
                id: '',
                name: '',
                description: '',
                picture: '',
                pictureData: '',
                addPostPolicy: C_PLACE_POST_POLICY.MANAGER,
                placeSearchPolicy: false,
                addPlacePolicy: C_PLACE_POST_POLICY.MANAGER,
                addMemberPolicy: C_PLACE_POST_POLICY.MANAGER,
                managerLimit: 10,
                memberLimit: 10,
                subPlaceLimit: 10,
                storageLimit: 10,
                members: [],
            },
            idValidation: {
                valid: false,
                reason: 0
            },
            formValid: false,
            showError: false,
            imageIsUploading: false,
            grandPlaceId: this.props.grandPlaceId,
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
        this.currentUser = AAA
            .getInstance()
            .getUser();
    }

    componentWillReceiveProps(props: any) {
        console.log(props);
        this.setState({
            visible: props.visible,
            grandPlaceId: props.grandPlaceId,
        });
    }

    componentDidMount() {
        this.accountApi = new AccountApi();
        this.placeApi = new PlaceApi();
        if (this.props.place) {
            this.setState({
                visible: this.props.visible,
                grandPlaceId: this.props.grandPlaceId,
            });
        }
        this.loadUploadToken();
    }

    handleCancel() {
        this
            .props
            .onClose();
        this.setState({visible: false});
    }

    loadUploadToken() {
        this
            .accountApi
            .getUploadToken()
            .then((result) => {
                this.setState({token: result.token});
            }, (error) => {
                this.setState({token: null});
            });
    }

    getPostPolicyItem() {
        let placeId = this.state
            ? this.state.model.id
            : '';
        if (placeId !== '') {
            placeId = placeId + '@' + CONFIG().DOMAIN;
        }
        const sharePostItems = [
            {
                index: C_PLACE_POST_POLICY.MANAGER,
                label: 'manager',
                description: 'Managers Only',
                searchProperty: false
            }, {
                index: C_PLACE_POST_POLICY.MANGER_MEMBER,
                label: 'managerMember',
                description: 'This Place Managers & Members',
                searchProperty: false
            }, {
                index: C_PLACE_POST_POLICY.TEAM,
                label: 'team',
                description: 'All Grand Place Members',
                searchProperty: true
            }, {
                index: C_PLACE_POST_POLICY.COMPANY,
                label: 'building',
                description: 'All Company Members',
                searchProperty: true
            }, {
                index: C_PLACE_POST_POLICY.EMAIL,
                label: 'atsign',
                description: `All Company Members + Everyone via Email: <br> <a href="mailto:${placeId}">${placeId}</a>`,
                searchProperty: true,
                searchText: 'Searchable for Company Accounts'
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
                searchProperty: false
            }, {
                index: C_PLACE_POST_POLICY.MANGER_MEMBER,
                label: 'managerMember',
                description: 'This Place Managers & Members',
                searchProperty: false
            }
        ];
        return createPlaceItems;
    }

    updateModel(params: any, callback?: any) {
        const model = this.state.model;
        _.forEach(params, (val, index) => {
            model[index] = val;
        });
        this.setState({model: model}, () => {
            if (_.isFunction(callback)) {
                callback();
            }
        });
    }

    extractNumber(text: any) {
        return parseInt(text.replace(/[^0-9]/g, ''), 0);
    }

    updatePlaceId(event: any) {
        const id = event.currentTarget.value;
        this.checkId(id);
        this.updateModel({
            id: id,
        });
    }

    updatePlaceName(event: any) {
        const name = event.currentTarget.value;
        const id = this.generateId(name);
        this.updateModel({
            name: name,
            id: id,
        }, () => {
            this.checkId(this.state.model.id);
        });
    }

    updatePlaceDescription(event: any) {
        this.updateModel({
            description: event.currentTarget.value,
        });
    }

    updatePlacePostPolicy(index: any) {
        this.updateModel({addPostPolicy: index});
    }

    updatePlaceSearchPolicy(check: any) {
        this.updateModel({placeSearchPolicy: check});
    }

    updatePlaceCreateSubPlacePolicy(index: any) {
        this.updateModel({addPlacePolicy: index});
    }

    updatePlaceAddMemberPolicy(index: any) {
        this.updateModel({addMemberPolicy: index});
    }

    updatePlaceMangerLimit(event: any) {
        this.updateModel({
            managerLimit: this.extractNumber(event.currentTarget.value)
        });
    }

    updatePlaceMemberLimit(event: any) {
        this.updateModel({
            memberLimit: this.extractNumber(event.currentTarget.value)
        });
    }

    updatePlaceSubPlaceLimit(event: any) {
        this.updateModel({
            subPlaceLimit: this.extractNumber(event.currentTarget.value)
        });
    }

    updatePlaceStorageLimit(event: any) {
        this.updateModel({
            storageLimit: this.extractNumber(event.currentTarget.value)
        });
    }

    pictureChange(info: any) {
        if (info.event && info.event.percent) {
            this.setState({
                uploadPercent: parseInt(info.event.percent.toFixed(2)),
            });
        }
        if (info.file.status === 'done') {
            this.updateModel({
                picture: info.file.response.data[0].universal_id,
                pictureData: info.file.response.data[0].thumbs
            });
            this.setState({
                uploadPercent: 0,
                imageIsUploading: false,
            });
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    beforeUpload() {
        this.setState({
            uploadPercent: 0,
            imageIsUploading: true,
        });
        if (!this.state.token) {
            notification.error({message: 'Error', description: 'We are not able to upload the picture.'});
            return false;
        }
    }

    toggleAddMemberModal() {
        this.setState({
            visibleAddMemberModal: !this.state.visibleAddMemberModal
        });
    }

    addMembers(members: any) {
        let currentMembers = this.state.model.members;
        const list = _.differenceBy(members, currentMembers, '_id');
        currentMembers = currentMembers.concat(list);
        const adminCount = _.filter(currentMembers, (item) => {
            return item.admin === true;
        }).length;
        if (currentMembers.length > 0 && adminCount === 0) {
            currentMembers[0].admin = true;
        }
        if (currentMembers.length > this.state.model.memberLimit) {
            message.warning(`You cannot have more than ${this.state.model.memberLimit} members`);
            return;
        }
        this.updateModel({
            members: currentMembers,
        });
    }

    generateId(name: string) {
        let camelCaseName = _.camelCase(name);
        // only accepts en numbers and alphabets
        if (this.placeIdRegex.test(camelCaseName)) {
            return _.kebabCase(name.substr(0, 36));
        } else {
            return '';
        }
    }

    checkIdAvailability(id: string) {
        id = id.toLowerCase();
        if (this.placeIdRegex.test(id) && id.length > 2) {
            if (this.state.grandPlaceId !== '') {
                id = this.state.grandPlaceId + '.' + id;
            }
            this.placeApi.isIdAvailable(id).then((data) => {
                if (data.err_code) {
                    this.setState({
                        idValidation: {
                            valid: false,
                            reason: 2
                        },
                    });
                } else {
                    this.setState({
                        idValidation: {
                            valid: true,
                            reason: 0
                        },
                    });
                }
            }).catch(() => {
                this.setState({
                    idValidation: {
                        valid: false,
                        reason: 2
                    },
                });
            });
        } else {
            this.setState({
                idValidation: {
                    valid: false,
                    reason: 1
                },
            });
        }
    }

    discard() {
        this.props.onClose(true);
    }

    getAddPostPolicy(policy: any) {
        let addPost: any;
        let receptive: any;
        switch (policy) {
            case C_PLACE_POST_POLICY.MANAGER:
                addPost = 'off';
                receptive = 'creators';
                break;
            case C_PLACE_POST_POLICY.MANGER_MEMBER:
                addPost = 'off';
                receptive = 'everyone';
                break;
            case C_PLACE_POST_POLICY.TEAM:
                addPost = 'internal';
                receptive = 'everyone';
                break;
            case C_PLACE_POST_POLICY.COMPANY:
                addPost = 'external';
                receptive = 'everyone';
                break;
            case C_PLACE_POST_POLICY.EMAIL:
                addPost = 'external';
                receptive = 'everyone';
                break;
            default:
                addPost = 'off';
                receptive = 'creators';
                break;
        }
        return {
            addPost: addPost,
            receptive: receptive,
        };
    }

    validate() {
        const model = this.state.model;
        if (this.state.imageIsUploading) {
            message.warning('Wait till image uploads completely!');
            return false;
        } else if (_.trim(model.name).length === 0) {
            message.warning('Choose a name!');
            return false;
        } else if (model.id > 3) {
            message.warning('Id must be more than 3 characters!');
            return false;
        } else if (!this.state.idValidation.valid) {
            message.warning('Id is not valid!');
            return false;
        }
        return true;
    }

    create() {
        if (!this.validate()) {
            return;
        }
        let model = this.state.model;
        const addPostPolicy = this.getAddPostPolicy(model.addPostPolicy);
        if (this.state.grandPlaceId !== '') {
            model.id = this.state.grandPlaceId + '.' + model.id;
        }
        let params: IPlaceCreateRequest = {
            place_id: model.id,
            place_name: model.name,
            place_description: model.description,
            picture: model.pictureData,
            policy: {
                add_post: addPostPolicy.addPost,
                add_place: model.addPlacePolicy,
                add_member: model.addMemberPolicy,
            },
            privacy: {
                locked: true,
                search: model.placeSearchPolicy,
                receptive: addPostPolicy.receptive,
            },
        };
        let members = _.map(this.state.model.members, (user) => {
            return user._id;
        }).join(',');

        let promise;
        if (this.state.grandPlaceId === '') {
            promise = this.placeApi.placeCreate(params);
        } else {
            promise = this.placeApi.placeSubCreate(params);
        }
        let placeId = '';
        promise.then((data) => {
            placeId = data._id;
            const promises = [];
            promises.push(
                this.placeApi.placeAddMember({
                    place_id: placeId,
                    account_id: members
                })
            );
            if (this.state.grandPlaceId === '') {
                promises.push(
                    this.placeApi.placeLimitEdit({
                        place_id: placeId,
                        limits: {
                            key_holders: model.managerLimit,
                            creators: model.memberLimit,
                            size: model.storageLimit,
                            childs: model.subPlaceLimit,
                        }
                    })
                );
            }
            Promise.all(promises).then((data) => {
                const admins = _.map(_.filter(model.members, (item: any) => {
                    return item.admin === true;
                }), (item: any) => {
                    return item._id;
                });
                if (admins.length > 0) {
                    const adminPromises = [];
                    _.forEach(admins, (item: string) => {
                        adminPromises.push(this.placeApi.promoteMember({
                            place_id: placeId,
                            account_id: item,
                        }));
                    });
                    Promise.all(adminPromises).then((data) => {
                        message.success('Place successfully created!');
                        this.props.onClose(true);
                    });
                } else {
                    message.success('Place successfully created!');
                    this.props.onClose(true);
                }
            });
        });
    }

    toggleAdmin(user: any) {
        const index = _.findIndex(this.state.model.members, {
            '_id': user._id,
        });
        if (index > -1) {
            let members = JSON.parse(JSON.stringify(this.state.model.members));
            members[index].admin = !members[index].admin;
            const adminCount = _.filter(members, (item) => {
                return item.admin === true;
            }).length;
            if (adminCount > this.state.model.managerLimit) {
                message.warning(`You cannot have more than ${this.state.model.memberLimit} admins`);
                return;
            }
            this.updateModel({
                members: members,
            });
        }
    }

    removeMember(user: any) {
        const index = _.findIndex(this.state.model.members, {
            '_id': user._id,
        });
        if (index > -1) {
            const members = this.state.model.members;
            members.splice(index, 1);
            this.updateModel({
                members: members,
            });
        }
    }

    getMembersItems() {
        var list = this.state.model.members.map((u: any) => {
            return (
                <li key={u._id} className={'nst-opacity-hover-parent'}>
                    <Row type='flex' align='middle'>
                        <UserAvatar user={u} borderRadius={'16'} size={24} avatar></UserAvatar>
                        <UserAvatar user={u} name size={22} className='uname'></UserAvatar>
                        <span className={['nst-opacity-hover', 'fill-force'].join(' ')} onClick={this.removeMember.bind(this, u)}>
                            <IcoN size={16 } name={'bin16'}/>
                        </span>
                        <span className={['nst-opacity-hover', (u.admin ? 'no-hover': '')].join(' ')} onClick={this.toggleAdmin.bind(this, u)}>
                            <IcoN size={24} name={u.admin ? 'crown24' : 'crownWire24'}/>
                        </span>
                    </Row>
                </li>
            );
        });
        return (
            <ul>
                {list}
                <li
                    key='addmember'
                    className='addMemberItem'
                    onClick={this
                        .toggleAddMemberModal
                        .bind(this)}>
                    <IcoN size={16} name={'cross16'}/>
                    Add member...
                </li>
            </ul>
        );
    }

    removePhoto(e: any) {
        // todo remove photo from model
        e.preventDefault();
        e.stopPropagation();
        this.updateModel({
            picture: '',
            pictureData: ''
        });
    }

    render() {
        const sharePostItems = this.getPostPolicyItem();
        const createPlaceItems = this.getPolicyItem();
        const credentials = AAA
            .getInstance()
            .getCredentials();
        const uploadUrl = `${CONFIG().STORE.URL}/upload/place_pic/${credentials.sk}/${this.state.token}`;

        const modalFooter = (
            <div className='modal-foot'>
                <Button
                    type=' butn butn-white'
                    onClick={this
                        .discard
                        .bind(this)}>Discard</Button>
                <Button
                    type=' butn butn-green'
                    onClick={this
                        .create
                        .bind(this)}>Create Place</Button>
            </div>
        );

        let model = this.state.model;
        return (
            <Modal
                className='create-place-modal'
                maskClosable={true}
                width={800}
                closable={true}
                onCancel={this
                    .handleCancel
                    .bind(this)}
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
                                onChange={this
                                    .pictureChange
                                    .bind(this)}
                                beforeUpload={this
                                    .beforeUpload
                                    .bind(this)}>
                                <Button type=' butn secondary'>
                                    Upload a Photo
                                </Button>
                                {model.pictureData && (
                                    <Button type=' butn butn-red secondary' onClick={this.removePhoto.bind(this)}>
                                        Remove Photo
                                    </Button>)}
                                {(this.state.uploadPercent < 100 && this.state.uploadPercent > 0) &&
                                <div className='progress-bar' style={{width: this.state.uploadPercent + '%'}}/>
                                }
                            </Upload>
                        </Row>
                        <Row className='input-row'>
                            <label htmlFor='name'>Name</label>
                            <Input
                                id='name'
                                size='large'
                                className='nst-input'
                                value={model.name}
                                onChange={this
                                    .updatePlaceName
                                    .bind(this)}/>
                        </Row>
                        <Row className='input-row'>
                            <label htmlFor='placeId'>Place ID</label>
                            <Input id='placeId' size='large'
                                   className={['nst-input', (!this.state.idValidation.valid && this.state.idValidation.reason !== 0) ? 'error' : ''].join(' ')}
                                   value={model.id}
                                   onChange={this.updatePlaceId.bind(this)}/>
                            {(!this.state.idValidation.valid && this.state.idValidation.reason === 1) && <p className='nst-error'>Id Invalid</p>}
                            {(!this.state.idValidation.valid && this.state.idValidation.reason === 2) && <p className='nst-error'>Already Exist</p>}
                            <p>Place will be identified by this unique address: grand-place.choosen-id You can't change
                                this afterwards, so choose wisely!</p>
                        </Row>
                        <Row className='input-row'>
                            <label htmlFor='description'>Description</label>
                            <Input id='description' size='large' className='nst-input' value={model.description}
                                   onChange={this.updatePlaceDescription.bind(this)}/>
                        </Row>
                        <Row className='input-row select-level'>
                            <label>Who can share posts with this Place?</label>
                            <SelectLevel
                                index={model.addPostPolicy}
                                searchable={model.placeSearchPolicy}
                                items={sharePostItems}
                                onChangeLevel={this
                                    .updatePlacePostPolicy
                                    .bind(this)}
                                onChangeSearch={this.updatePlaceSearchPolicy.bind(this)}
                            />
                        </Row>
                        <Row className='input-row select-level'>
                            <label>Who can create sub-places in this Place?</label>
                            <SelectLevel
                                index={model.addPlacePlicy}
                                items={createPlaceItems}
                                onChangeLevel={this
                                    .updatePlaceCreateSubPlacePolicy
                                    .bind(this)}/>
                        </Row>
                        <Row className='input-row select-level'>
                            <label>Who can add member to this Place?</label>
                            <SelectLevel
                                index={model.addMemberPolicy}
                                items={createPlaceItems}
                                onChangeLevel={this
                                    .updatePlaceAddMemberPolicy
                                    .bind(this)}/>
                        </Row>
                        <Row className='input-row' gutter={24}>
                            <Col span={12}>
                                <label htmlFor='limitManager'>Max. Managers</label>
                                <Input
                                    id='limitManager'
                                    size='large'
                                    className='nst-input'
                                    value={model.managerLimit}
                                    onChange={this
                                        .updatePlaceMangerLimit
                                        .bind(this)}/>
                            </Col>
                            <Col span={12}>
                                <label htmlFor='limitMember'>Max. Members</label>
                                <Input
                                    id='limitMember'
                                    size='large'
                                    className='nst-input'
                                    value={model.memberLimit}
                                    onChange={this
                                        .updatePlaceMemberLimit
                                        .bind(this)}/>
                            </Col>
                        </Row>
                        <Row className='input-row' gutter={24}>
                            <Col span={12}>
                                <label htmlFor='limitSubPlaces'>Max. Sub-Places</label>
                                <Input
                                    id='limitSubPlaces'
                                    size='large'
                                    className='nst-input'
                                    value={model.subPlaceLimit}
                                    onChange={this
                                        .updatePlaceSubPlaceLimit
                                        .bind(this)}/>
                            </Col>
                            <Col span={12}>
                                <label htmlFor='limitStorage'>Max. Storage</label>
                                <Input
                                    id='limitStorage'
                                    size='large'
                                    className='nst-input'
                                    value={model.storageLimit}
                                    onChange={this
                                        .updatePlaceStorageLimit
                                        .bind(this)}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col className='place-members' span={8}>
                        <h3>Members</h3>
                        {this.getMembersItems()}
                    </Col>
                </Row>
                <AddMemberModal
                    members={this.state.model.members}
                    addMembers={this.addMembers.bind(this)}
                    onClose={this.toggleAddMemberModal.bind(this)}
                    visible={this.state.visibleAddMemberModal}/>
            </Modal>
        );
    }

}
