import * as React from 'react';
import PlaceApi from '../../api/place/index';
import IPlace from '../../api/place/interfaces/IPlace';
import {Modal, Row, Col, Icon, Button, message, Form, Input, Select, notification, Upload} from 'antd';
import reqwest from 'reqwest';

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
import {IcoN} from '../icon/index';
import MoreOption from '../Filter/MoreOption';
import UserAvatar from '../avatar/index';
import PlacePolicy from '../PlacePolicy/index';
import RelatedChartCards from '../ChartCard/RelatedChartCards';
import ReportType from '../../api/report/ReportType';
import MeasureType from '../ChartCard/MeasureType';
import TimePeriod from '../ChartCard/TimePeriod';
import SelectLevel from '../SelectLevel/index';
import C_PLACE_POST_POLICY from '../../api/consts/CPlacePostPolicy';
import CONFIG from 'src/app/config';
import PlaceAvatar from '../PlaceAvatar/index';
import IPlaceCreateRequest from '../../api/place/interfaces/IPlaceCreateRequest';
import AddMemberModal from '../AddMember/index';
import NstCrop from '../Crop/index';
import $ from 'jquery';

interface IProps {
    place?: IPlace;
    visible?: boolean;
    onClose?: any;
    onChange: (place: IPlace) => {};
}

interface IStates {
    editTarget: EditableFields | null;
    visible: boolean;
    visibleAddMemberModal: boolean;
    place?: IPlace;
    members?: any;
    chosen ?: IUser;
    viewAccount: boolean;
    creators: Array<string>;
    isGrandPlace: boolean;
    showEdit: boolean;
    updateProgress: boolean;
    imageIsUploading: boolean;
    editMode: boolean;
    reportTab: boolean;
    sidebarTab: number;
    uploadPercent: number;
    token: string;
    model: any;
    pickedImage: any;
}


export default class PlaceModal extends React.Component<IProps, IStates> {
    currentUser: IUser;
    accountApi: any;
    placeApi: any;
    updated: boolean;

    constructor(props: any) {
        super(props);
        this.state = {
            visibleAddMemberModal: false,
            uploadPercent: 0,
            sidebarTab: 0,
            updateProgress: false,
            showEdit: false,
            visible: false,
            place: this.props.place,
            members: [],
            reportTab: false,
            editMode: false,
            viewAccount: false,
            pickedImage: null,
            token: '',
            creators: this.props.place.creators,
            isGrandPlace: true,
            model: this.getModelFromProps(this.props),
            imageIsUploading: false,
        };
        this.changeSidebarTab = this.changeSidebarTab.bind(this);
        this.toggleReportTab = this.toggleReportTab.bind(this);
        this.currentUser = AAA.getInstance().getUser();
        this.updated = false;
    }

    getModelFromProps(props: any) {
        return {
            id: props.place._id,
            name: props.place.name,
            description: props.place.description,
            picture: '',
            pictureData: props.place.picture,
            addPostPolicy: this.transformAddPostPolicy(props.place.policy.add_post, props.place.privacy.receptive),
            placeSearchPolicy: props.place.privacy.search,
            addPlacePolicy: props.place.policy.add_place,
            addMemberPolicy: props.place.policy.add_member,
            managerLimit: props.place.limits.creators,
            memberLimit: props.place.limits.key_holders,
            subPlaceLimit: props.place.limits.childs,
            storageLimit: props.place.limits.size/(1024*1024),
            members: [],
        };
    }

    componentWillReceiveProps(props: any) {
        this.setState({
            place: props.place,
            creators: props.place.creators,
            visible: props.visible,
            model: this.getModelFromProps(props),
        });
        this.fetchUsers();
        this.updated = false;
    }

    fetchUsers() {
        let placeApi = new PlaceApi();
        placeApi.getPlaceListMemebers({
            place_id: this.props.place._id
        }).then((accounts) => {
            const admins = _.map(this.state.place.creators, (item) => {
                return {_id: item};
            });
            let managers = _.intersectionBy(accounts, admins, '_id');
            managers = _.map(managers, (item) => {
                return _.merge(item, {
                    admin: true,
                });
            });
            let members = _.differenceBy(accounts, admins, '_id');
            members = _.map(members, (item) => {
                return _.merge(item, {
                    admin: false,
                });
            });
            accounts = _.concat(managers, members);
            this.setState({
                members: accounts,
            });
            this.updateModel({
                members: accounts,
            });
        });
    }

    componentDidMount() {
        this.accountApi = new AccountApi();
        this.placeApi = new PlaceApi();
        if (this.props.place) {
            this.setState({
                place: this.props.place,
                creators: this.props.place.creators,
                visible: this.props.visible,
            });
        }
        this.fetchUsers();
        this.loadUploadToken();
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

    onCloseView() {
        this.setState({chosen: null, viewAccount: false, visible: true});
    }

    handleChange(account: IUser) {
        const accounts = _.clone(this.state.members);
        const index = _.findIndex(accounts, {_id: account._id});
        if (index === -1) {
            return;
        }

        accounts.splice(index, 1, account);
        this.setState({
            members: accounts
        });
    }


    handleCancel() {
        if (this.updated) {
            this.broadcastUpdate();
        }
        this.setState({
            visible: false,
        });
        if (this.props.onClose && typeof this.props.onClose === 'function') {
            this.props.onClose();
        }
    }

    applyChanges(form: any) {
        form.validateFields((error: any, values) => {
            const errors = _(error).map((value, key) => value.errors).flatten().value();
            if (_.size(errors) > 0) {
                return;
            }

            const changedProps = _.mapValues(values, (value, key) => {
                return value;
            });

            let editedPlace = _.clone(this.state.place);

            this.setState({
                updateProgress: true,
                place: _.merge(editedPlace, changedProps)
            });


            let limits = {
                place_id: this.props.place._id,
            };

            _.forEach(changedProps.limits, (val, key) => {
                limits[`limits.${key}`] = parseInt(val, 0);
            });



            this.placeApi.placeLimitEdit(limits).then((result) => {
                this.setState({
                    updateProgress: false,
                    showEdit: false,
                });
                if (this.props.onChange) {
                    this.props.onChange(editedPlace);
                }
            }, (error) => {
                this.setState({
                    updateProgress: false
                });
                notification.error({
                    message: 'Update Error',
                    description: 'We were not able to update the field!'
                });
            });
        });
    }

    saveForm = (form) => this.form = form;

    /**
     * convert byte to gig
     * @param {number} size
     */
    convertSize(size: number): number {
        return size / 1073741824;
    }

    changeSidebarTab(sidebarTab: number) {
        this.setState({
            sidebarTab
        });
    }

    toggleEditMode(editMode: boolean) {
        this.setState({
            editMode: editMode || !this.state.editMode,
        });
    }

    toggleReportTab(reportTab: boolean) {
        this.setState({
            reportTab: !this.state.reportTab,
        });
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

    toggleAdmin(user: any) {
        const index = _.findIndex(this.state.model.members, {
            '_id': user._id,
        });
        let members = JSON.parse(JSON.stringify(this.state.model.members));
        if (!_.some(this.state.members, {_id: user._id})) {
            if (index > -1) {
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
        } else {
            if (!this.state.model.members[index].admin) {
                members[index].admin = true;
                this.placeApi.promoteMember({
                    place_id: this.state.model.id,
                    account_id: user._id,
                }).then(() => {
                    this.updated = true;
                    this.updateModel({
                        members: members,
                    });
                });
            } else {
                members[index].admin = false;
                this.placeApi.demoteMember({
                    place_id: this.state.model.id,
                    account_id: user._id,
                }).then(() => {
                    this.updated = true;
                    this.updateModel({
                        members: members,
                    });
                });
            }
        }
    }

    removeMember(user: any) {
        const index = _.findIndex(this.state.model.members, {
            '_id': user._id,
        });
        let members = this.state.model.members;
        if (!_.some(this.state.members, {_id: user._id})) {
            members.splice(index, 1);
            this.updateModel({
                members: members,
            });
        } else {
            this.placeApi.removeMember({
                place_id: this.state.model.id,
                account_id: user._id,
            }).then(() => {
                this.updated = true;
                members.splice(index, 1);
                this.updateModel({
                    members: members,
                });
            });
        }
    }

    clearForm() {
        // this.form.resetFields();
        this.resetModel();
        this.toggleEditMode(false);
    }

    broadcastUpdate() {
        const event = new Event('place_updated');
        window.dispatchEvent(event);
        console.log('place_updated');
    }

    updateForm() {
        if (!this.validate()) {
            return;
        }
        const model = this.state.model;
        const addPostPolicy = this.getAddPostPolicy(model.addPostPolicy);
        const params: IPlaceCreateRequest = {
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
            limits: {
                key_holders: model.managerLimit,
                creators: model.memberLimit,
                size: model.storageLimit*(1024*1024),
                childs: model.subPlaceLimit,
            }
        };
        const newMembers = _.differenceBy(model.members, this.state.members, '_id');
        let members = _.map(newMembers, (user) => {
            return user._id;
        }).join(',');
        this.placeApi.placeَUpdate(params).then((data) => {
            this.toggleEditMode(false);
            this.importToModel();
            message.success('Place updated!');
            if (model.picture === '-') {
                this.placeApi.setPicture({
                    place_id: model.id,
                }).then(() => {
                    console.log('picture removed');
                });
            } else if (model.picture !== null && model.picture !== '') {
                this.placeApi.setPicture({
                    place_id: model.id,
                    universal_id: model.picture,
                }).then(() => {
                    console.log('picture added');
                });
            }
            if (newMembers.length > 0) {
                this.placeApi.placeAddMember({
                    place_id: model.id,
                    account_id: members
                }).then((data) => {
                    message.success('New Members have been added!');
                    this.updated = true;
                    const admins = _.map(_.filter(newMembers, (item: any) => {
                        return item.admin === true;
                    }), (item: any) => {
                        return item._id;
                    });
                    if (admins.length > 0) {
                        const adminPromises = [];
                        _.forEach(admins, (item: string) => {
                            adminPromises.push(this.placeApi.promoteMember({
                                place_id: model.id,
                                account_id: item,
                            }));
                        });
                        Promise.all(adminPromises).then((data) => {
                            message.success('New Managers have been added!');
                        });
                    }
                });
            }
        });
    }

    resetModel() {
        this.updateModel({
            name: this.state.place.name,
            description: this.state.place.description,
            picture: '',
            pictureData: this.state.place.picture,
            addPostPolicy: this.transformAddPostPolicy(this.state.place.policy.add_post, this.state.place.privacy.receptive),
            placeSearchPolicy: this.state.place.privacy.search,
            addPlacePolicy: this.state.place.policy.add_place,
            addMemberPolicy: this.state.place.policy.add_member,
            managerLimit: this.state.place.limits.creators,
            memberLimit: this.state.place.limits.key_holders,
            subPlaceLimit: this.state.place.limits.childs,
            storageLimit: this.state.place.limits.size/(1024*1024),
            members: this.state.members,
        });
    }

    importToModel() {
        const model = this.state.model;
        const addPostPolicy = this.getAddPostPolicy(model.addPostPolicy);
        let place: IPlace = this.state.place;
        place.name = model.name;
        place.description = model.description;
        place.picture = model.pictureData;
        place.policy.add_post = addPostPolicy.addPost;
        place.policy.add_place = model.addPlacePolicy;
        place.policy.add_member = model.addMemberPolicy;
        place.privacy.search = model.placeSearchPolicy;
        place.privacy.search = addPostPolicy.receptive;
        place.limits.creators = model.managerLimit;
        place.limits.key_holders = model.memberLimit;
        place.limits.childs = model.subPlaceLimit;
        place.limits.size = model.storageLimit;
        this.setState({
            place: place,
            members: model.members,
        });

    }

    getMembersItems() {
        var list = this.state.model.members.map((u: any) => {
            return (
                <li key={u._id} className={'nst-opacity-hover-parent'}>
                    <Row type='flex' align='middle'>
                        <UserAvatar user={u} borderRadius={'16px'} size={24} avatar></UserAvatar>
                        <UserAvatar user={u} name size={22} className='uname'></UserAvatar>
                        <span className={['nst-opacity-hover', (u.admin ? 'no-hover': '')].join(' ')} onClick={this.toggleAdmin.bind(this, u)}>
                            <IcoN size={24} name={u.admin ? 'crown24' : 'crownWire24'}/>
                        </span>
                        <span className={['nst-opacity-hover', 'fill-force'].join(' ')} onClick={this.removeMember.bind(this, u)}>
                            <IcoN size={16 } name={'bin16'}/>
                        </span>
                    </Row>
                </li>
            );
        });
        return (
            <ul>
                {list}
                {this.state.editMode &&
                <li
                    key='addmember'
                    className='addMemberItem'
                    onClick={this
                        .toggleAddMemberModal
                        .bind(this)}>
                    <IcoN size={16} name={'cross16'}/>
                    Add member...
                </li>}
            </ul>
        );
    }

    getPostPolicyItem() {
        let placeId = this.state
            ? this.state.place._id
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
                index: C_PLACE_POST_POLICY.CREATOR,
                label: 'manager',
                description: 'Managers Only',
                searchProperty: false
            }, {
                index: C_PLACE_POST_POLICY.EVERYONE,
                label: 'managerMember',
                description: 'This Place Managers & Members',
                searchProperty: false
            }
        ];
        return createPlaceItems;
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
        }
        return true;
    }

    transformAddPostPolicy(addPost: any, receptive: any) {
        if (receptive === 'off' && addPost === 'creators') {
            return C_PLACE_POST_POLICY.MANAGER;
        } else if (receptive === 'off' && addPost === 'everyone') {
            return C_PLACE_POST_POLICY.MANGER_MEMBER;
        } else if (receptive === 'internal' && addPost === 'everyone') {
            return C_PLACE_POST_POLICY.TEAM;
        } else if (receptive === 'external' && addPost === 'everyone') {
            return C_PLACE_POST_POLICY.COMPANY;
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

    onCropped(file: any) {
        console.log('onCropped file', file);
        // el.onclick();
        const formData = new FormData();
        formData.append('files[]', file);
        const credentials = AAA.getInstance().getCredentials();
        const input = $('[accept="image/*"]');
        console.log(input);
        // input.files = [];
        // input.files[0] = file;
        // you can use any AJAX library you like
        reqwest({
          url: `${CONFIG().STORE.URL}/upload/place_pic/${credentials.sk}/${this.state.token}`,
          method: 'post',
          data: formData,
          success: () => {
            console.log(arguments);
            message.success('upload successfully.');
          },
          error: () => {
            message.error('upload failed.');
          },
        });
    }

    removePhoto(e: any) {
        e.preventDefault();
        e.stopPropagation();
        this.updateModel({
            pictureData: '',
            picture: '-',
        });
    }

    uploadPhotoButton(e: any) {
        // e.preventDefault();
        e.stopPropagation();
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

    updatePlaceName(event: any) {
        const name = event.currentTarget.value;
        this.updateModel({
            name: name,
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

    pickFile(e: any) {
        const file = e.target.files.item(0);
        const imageType = /^image\//;

        if (!file || !imageType.test(file.type)) {
            return;
        }
        console.log(file);
        this.setState({
            pickedImage: file
        });
        // const reader = new FileReader();

        // reader.onload = (e2) => {
        //     this.setState({
        //         pickedImage: file
        //     });
        // };

        // reader.readAsDataURL(file);
    }

    render() {
        const {place, editMode, model} = this.state;
        const isPersonal = place.type === C_PLACE_TYPE[C_PLACE_TYPE.personal];
        const sharePostItems = this.getPostPolicyItem();
        const createPlaceItems = this.getPolicyItem();
        const credentials = AAA
        .getInstance()
        .getCredentials();
        const uploadUrl = `${CONFIG().STORE.URL}/upload/place_pic/${credentials.sk}/${this.state.token}`;
        console.log(uploadUrl);
        const iconStyle = {
            width: '16px',
            height: '16px',
            verticalAlign: 'middle'
        };
        let lockedIcon, lockedTxt, reciveIcon, reciveTxt, searchableIcon, searchableTxt;
        const placeClone = _.clone(this.state.place);

        const EditForm = Form.create({
            mapPropsToFields: (props: any) => {
                return {
                    fname: {
                        value: props.fname
                    },
                    lname: {
                        value: props.lname
                    },
                    phone: {
                        value: props.phone
                    },
                    dob: {
                        value: props.dob ? moment(props.dob, this.DATE_FORMAT) : null
                    },
                    email: {
                        value: props.email
                    }
                };
            }
        })((props: any) => {
            const {getFieldDecorator} = props.form;
            return (
                <Form onSubmit={() => this.applyChanges(this.form)}>
                    {
                        this.state.editTarget === EditableFields.creators &&
                        <Form.Item label='Maximum Number of Managers '>
                            {getFieldDecorator('limits.creators', {
                                initialValue: this.state.place.limits.creators,
                                rules: [{required: true, message: 'Maximum number of Managers is required!'}],
                            })(
                                <Input placeholder='3'/>
                            )}
                        </Form.Item>
                    }
                    {
                        this.state.editTarget === EditableFields.key_holders &&
                        <Form.Item label='Maximum Number of Members'>
                            {getFieldDecorator('limits.key_holders', {
                                initialValue: this.state.place.limits.key_holders,
                                rules: [{required: true, message: 'Maximum number of Members is required!'}],
                            })(
                                <Input placeholder='250'/>
                            )}
                        </Form.Item>
                    }
                    {
                        this.state.editTarget === EditableFields.childs &&
                        <Form.Item label='Maximum Number of Children'>
                            {getFieldDecorator('limits.childs', {
                                initialValue: this.state.place.limits.childs,
                                rules: [{required: true, message: 'Maximum number of Children is required!'}],
                            })(
                                <Input placeholder='10'/>
                            )}
                        </Form.Item>
                    }
                    {
                        this.state.editTarget === EditableFields.size &&
                        <Form.Item label='Place Storage Size'>
                            {getFieldDecorator('limits.size', {
                                initialValue: this.state.place.limits.size,
                                rules: [{required: true, message: 'Place storage size is required!'}],
                            })(
                                <Select>
                                    <Option value={0}>Unlimited</Option>
                                    <Option value={536870912}>500 MB</Option>
                                    <Option value={1073741824}>1 GB</Option>
                                    <Option value={2147483648}>2 GB</Option>
                                    <Option value={5368709120}>5 GB</Option>
                                    <Option value={5368709120 * 2}>10 GB</Option>
                                    <Option value={5368709120 * 4}>20 GB</Option>
                                    <Option value={5368709120 * 10}>50 GB</Option>
                                </Select>
                            )}
                        </Form.Item>
                    }
                </Form>
            );
        });

        const items = [
            {
                key: 'forcepassword',
                name: 'Force Change Password',
                icon: 'lock16',
            },
        ];

        if (this.state.reportTab) {
            const header = (
                <Row className='modal-head reports-head' type='flex' align='middle'>
                    {/* Top bar */}
                    <div className='modal-close' onClick={this.toggleReportTab}>
                        <IcoN size={24} name={'back24'}/>
                    </div>
                    <h3>Reports</h3>
                    <div className='filler'></div>
                </Row>
            );
        } else {
            const header = (
                <Row className='modal-head' type='flex' align='middle'>
                    {/* Top bar */}
                    <div className='modal-close' onClick={this.handleCancel.bind(this)}>
                        <IcoN size={24} name={'xcross24'}/>
                    </div>
                    <h3>Place Info</h3>
                    <div className='filler'></div>
                    {(!editMode && !isPersonal) && (
                        <Row className='account-control' type='flex' align='middle' onClick={this.toggleEditMode.bind(this)}>
                            <IcoN size={16} name={'pencil16'}/>
                            <span>Edit</span>
                        </Row>
                    )}
                    {!editMode && (
                        <Row className='account-control' type='flex' align='middle' onClick={this.toggleReportTab}>
                            <IcoN size={16} name={'chart16'}/>
                            <span>Reports</span>
                        </Row>
                    )}
                    {!editMode && (
                        <Row className='account-control' type='flex' align='middle'>
                            <IcoN size={16} name={'compose16'}/>
                            <span>Send a Message</span>
                        </Row>
                    )}
                    {editMode && (
                        <Button onClick={this.clearForm.bind(this)}
                            type=' butn butn-white'>Discard</Button>
                    )}
                    {editMode && (
                        <Button
                            onClick={this.updateForm.bind(this)}
                            type=' butn butn-green'>Save Changes</Button>
                    )}
                </Row>
            );
        }
        console.log(model.pictureData);
        return (
            <div>
                {
                    this.state.viewAccount &&
                    <View account={this.state.chosen} visible={this.state.viewAccount}
                          onChange={this.handleChange.bind(this)}
                          onClose={this.onCloseView.bind(this)}/>
                }
                {place &&
                <Modal
                       className={['place-modal', 'modal-template', 'nst-modal',
                       editMode ? 'edit-mode' : '',
                       this.state.reportTab ? 'report-mode' : ''].join(' ')}
                       maskClosable={true}
                       width={800}
                       closable={true}
                       onCancel={this.handleCancel.bind(this)}
                       visible={this.state.visible}
                       footer={null}
                       title={header}>
                    {!this.state.reportTab && <Row gutter={16} type='flex'>
                        <Col span={16}>
                            <div className='modal-body'>
                                {!this.state.editMode && <Row type='flex'>
                                    <div className='place-pic'>
                                        <PlaceView className='placemodal' avatar size={64} place={place}/>
                                    </div>
                                    <div className='Place-Des'>
                                        <h2>{place.name}</h2>
                                        <h3>{place._id}</h3>
                                        <hr/>
                                        <p>
                                            {place.description}
                                        </p>
                                        <label>
                                            Share Post Policy
                                        </label>
                                        <span className='label-value'>
                                            <PlacePolicy place={place} text={true} receptive={true}/>
                                        </span>
                                        {!isPersonal &&
                                        <label>
                                            Create Sub-Place Policy
                                        </label>}
                                        {!isPersonal &&
                                        <span className='label-value'>
                                            <PlacePolicy place={place} text={true} create={true}/>
                                        </span>}
                                        {!isPersonal &&
                                        <label>
                                            Add Member Policy
                                        </label>}
                                        {!isPersonal &&
                                        <span className='label-value'>
                                            <PlacePolicy place={place} text={true} add={true}/>
                                        </span>}
                                        {!isPersonal && <Row className='info-row' gutter={24}>
                                            <Col span={12}>
                                                <label>Max. Managers</label>
                                                <span className='label-value power'>
                                                {place.counters.creators}
                                                </span>
                                                <span className='label-value not-assigned'>
                                                    /{model.managerLimit}
                                                </span>
                                            </Col>
                                            <Col span={12}>
                                                <label>Max. Members</label>
                                                <span className='label-value power'>
                                                    {place.counters.key_holders}
                                                </span>
                                                <span className='label-value not-assigned'>
                                                    /{model.memberLimit}
                                                </span>
                                            </Col>
                                        </Row>}
                                        <Row className='info-row' gutter={24}>
                                            <Col span={12}>
                                                <label>Max. Sub-Places</label>
                                                <span className='label-value power'>
                                                    {place.counters.childs}
                                                </span>
                                                <span className='label-value not-assigned'>
                                                    /{model.subPlaceLimit}
                                                </span>
                                            </Col>
                                            <Col span={12}>
                                                <label>Storage</label>
                                                <span className='label-value power'>
                                                    {this.convertSize(place.counters.size).toFixed(3) }
                                                </span>
                                                <span className='label-value not-assigned'>
                                                    /
                                                    {model.storageLimit === 0 && '∞'}
                                                    {model.storageLimit > 0 && model.storageLimit + ' MB'}
                                                </span>
                                            </Col>
                                        </Row>
                                    </div>
                                </Row>}
                                {this.state.editMode &&
                                        <Row>
                                            <Row className='place-picture' type='flex' align='middle'>
                                                <PlaceAvatar avatar={model.pictureData}/>
                                                <input onChange={this.pickFile.bind(this)} style={{display: 'none'}} id='file' type='file'/>
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
                                                        {/* <button type='butn secondary'>
                                                            Upload a Photo
                                                        </button> */}
                                                    <label onClick={this.uploadPhotoButton.bind(this)} className='butn secondary' htmlFor='file'><span>Upload a Photo</span></label>
                                                    {model.pictureData && (
                                                        <Button type=' butn butn-red secondary' onClick={this.removePhoto.bind(this)}>
                                                            Remove Photo
                                                        </Button>)}
                                                    {(this.state.uploadPercent < 100 && this.state.uploadPercent > 0) &&
                                                    <div className='progress-bar' style={{width: this.state.uploadPercent + '%'}}/>
                                                    }
                                                </Upload>
                                                <NstCrop avatar={this.state.pickedImage}
                                                    onCropped={this.onCropped.bind(this)}/>
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
                                                    index={model.addPlacePolicy}
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
                                        </Row>
                                }
                            </div>
                        </Col>
                        {/* <Col span={8} className='modal-sidebar'>
                            {!isPersonal && <Row type='flex' className='box-tab'>
                                <span onClick={() => this.changeSidebarTab(0)}
                                    className={this.state.sidebarTab === 0 ? 'active' : ''}>Members</span>
                                <span onClick={() => this.changeSidebarTab(1)}
                                    className={this.state.sidebarTab === 1 ? 'active' : ''}>Sub-places</span>
                            </Row>}
                            {(this.state.sidebarTab === 0 && !isPersonal) && <div className='place-members'>
                                {this.getMembersItems()}
                            </div>}
                            {(this.state.sidebarTab === 1 || isPersonal) && <div className='place-members'>
                                place subplaces
                            </div>}
                        </Col> */}
                        <Col span={8} className='modal-sidebar'>
                        <span>Members</span>
                            <div className='place-members'>
                                {this.getMembersItems()}
                            </div>
                        </Col>
                    </Row>}
                    {this.state.reportTab &&
                        <div className='reports'>
                            <RelatedChartCards
                                title={['Posts', 'Comments']}
                                direction='vertical'
                                params={{id: place._id}}
                                dataType={[[ReportType.PlacePost],[ReportType.PlaceComment]]}
                                syncId='place'
                                color={['#e74c3c', '#f1c40f']}
                                measure={[MeasureType.NUMBER, MeasureType.NUMBER]}/>
                        </div>
                    }
                    <Row>
                        <Modal
                            key={this.props.place._id}
                            title='Edit'
                            width={360}
                            visible={this.state.showEdit}
                            onOk={this.saveEditForm}
                            onCancel={() => this.setState({showEdit: false})}
                            footer={[
                                <Button key='cancel' size='large'
                                        onClick={() => this.setState({showEdit: false})}>Cancel</Button>,
                                <Button key='submit' type='primary' size='large' loading={this.state.updateProgress}
                                        onClick={() => this.applyChanges(this.form)}>Save</Button>,
                            ]}
                        >
                            <EditForm ref={this.saveForm} {...placeClone} />
                        </Modal>
                    </Row>
                    <AddMemberModal
                        members={this.state.model.members}
                        addMembers={this.addMembers.bind(this)}
                        onClose={this.toggleAddMemberModal.bind(this)}
                        visible={this.state.visibleAddMemberModal}/>
                </Modal>
                }
            </div>
        );
    }

}
