import * as React from 'react';
import {
    Modal,
    Row,
    Col,
    Spin,
    Button,
    Form,
    Input,
    notification,
    DatePicker,
    Upload,
    Icon,
    message,
    Select,
    Switch,
    Tooltip
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import md5 from 'md5';
import PlaceItem from '../../../../components/PlaceItem/index';
import IPerson from '../../interfaces/IPerson';
import PlaceApi from '../../../../api/place/index';
import AccountApi from '../../../../api/account/account';
import UserAvatar from '../../../../components/avatar/index';
import {IcoN} from '../../../../components/icon/index';
import MoreOption from '../../../../components/Filter/MoreOption';
import EditableFields from './EditableFields';
import CONFIG from 'src/app/config';
import AAA from './../../../../services/classes/aaa/index';
import PlaceModal from '../../../../components/PlaceModal/index';
import IPlace from '../../../../api/place/interfaces/IPlace';
import SendMessageModal from '../../../../components/SendMessageModal/index';
import NstCrop from '../../../../components//Crop/index';

import RelatedChartCards from '../../../../components/ChartCard/RelatedChartCards';
import ReportType from '../../../../api/report/ReportType';
import MeasureType from '../../../../components/ChartCard/MeasureType';
import TimePeriod from '../../../../components/ChartCard/TimePeriod';
interface IViewProps {
    visible: boolean;
    account: IPerson;
    onChange: (user: IPerson) => void;
    onClose: () => void;
}

interface IViewState {
    setEmail: boolean;
    setDateOfBirth: boolean;
    account: IPerson;
    token: string;
    selectedPlace?: IPlace;
    visiblePlaceModal: boolean;
    maskClosable: boolean;
    visible: boolean;
    reportTab: boolean;
    editMode: boolean;
    model: any;
    imageIsUploading: boolean;
    sendMessageVisible: boolean;
    visibleChangePassword: boolean;
    newPassword: string;
    uploadPercent: number;
    pickedImage: any;
    visibleRemoveMember: boolean;
    removeMemberPlaceRef: any;
}

class View extends React.Component<IViewProps, IViewState> {
    DATE_FORMAT: string = 'YYYY-MM-DD';
    updated: boolean;
    constructor(props: IViewProps) {
        super(props);
        this.state = {
            setEmail: false,
            editMode: false,
            reportTab: false,
            setDateOfBirth: false,
            account: props.account,
            sendMessageVisible: false,
            visiblePlaceModal: false,
            imageIsUploading: false,
            maskClosable: true,
            visible: true,
            uploadPercent: 0,
            visibleChangePassword: false,
            newPassword: '',
            model: {
                account_id: this.props.account._id,
                fname: this.props.account.fname,
                lname: this.props.account.lname,
                gender: this.props.account.gender,
                dob: this.props.account.dob,
                email: this.props.account.email,
                phone: this.props.account.phone,
                searchable: this.props.account.searchable,
                change_profile: this.props.account.privacy.change_profile,
                change_picture: this.props.account.privacy.change_picture,
                force_password: this.props.account.flags.force_password_change,
                grand_places_limit: this.props.account.limits.grand_places,
                label_editor_authority: this.props.account.authority.label_editor,
                admin_authority: this.props.account.authority.admin,
            },
            visibleRemoveMember: false,

        };
        this.updated = false;
        this.loadPlaces = this.loadPlaces.bind(this);
        this.applyChanges = this.applyChanges.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.pictureChange = this.pictureChange.bind(this);
        this.removePicture = this.removePicture.bind(this);
        this.onActiveChange = this.onActiveChange.bind(this);
        this.onPrivacyChange = this.onPrivacyChange.bind(this);
        this.toggleReportTab = this.toggleReportTab.bind(this);
        this.loadUploadToken = this.loadUploadToken.bind(this);
        this.sendMessageToggle = this.sendMessageToggle.bind(this);
    }

    componentDidMount() {
        this.placeApi = new PlaceApi();
        this.accountApi = new AccountApi();
        if (this.state.account && this.state.account._id) {
            this.loadPlaces(this.state.account._id);
        }

        this.loadUploadToken();
    }

    componentWillReceiveProps(nextProps: IViewProps) {
        if (nextProps.account && nextProps.account._id && nextProps.account._id !== this.state.account._id) {
            this.setState({
                visible: nextProps.visible,
                account: nextProps.account,
                places: []
            });
            this.loadPlaces(nextProps.account._id);
        }
    }

    showPlaceModal(record: IPlace, index: number) {
        this.selectedPlace = record;
        this.setState({
            selectedPlace: record,
            visiblePlaceModal: true,
            visible: false,
        });
    }

    sendMessageToggle() {
        this.setState({
            sendMessageVisible: !this.state.sendMessageVisible,
        });
    }

    closePlaceModal() {
        this.setState({
            visiblePlaceModal: false,
            visible: true,
        });
    }


    loadPlaces(accountId: string) {
        this.setState({
            loading: true
        });

        this.placeApi.getAccountPlaces({
            account_id: accountId
        }).then((result) => {
            this.setState({
                places: result.places,
                loading: false
            });
        }).catch((error) => {
            this.setState({
                places: [],
                loading: false
            });
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

    getGenderStr(gender: string) {
        switch (gender) {
            case 'm':
                return 'Male';
            case 'f':
                return 'Female';
            case 'o':
            default:
                return 'Other';
        }
    }
    toggleChangePasswordModal () {
        this.setState({
            newPassword: '',
            visibleChangePassword: !this.state.visibleChangePassword,
        });
    }

    changePassword() {
        if (this.state.newPassword.length < 6) {
            message.warning('User password must be at least 6 characters!');
            return;
        }
        this.accountApi.setPassword({
            account_id: this.state.model.account_id,
            new_pass: md5(this.state.newPassword),
        }).then(() => {
            message.success('User password has been changed!');
            this.toggleChangePasswordModal();
        }).catch(() => {
            message.error('User password has not been changed!');
            this.toggleChangePasswordModal();
        });
    }

    changePasswordHandler(event: any) {
        this.setState({
            newPassword: event.currentTarget.value,
        });
    }

    extractNumber(text: any) {
        return parseInt(text.replace(/[^0-9]/g, ''), 0);
    }
    toggleReportTab(reportTab: boolean) {
        this.setState({
            reportTab: !this.state.reportTab,
        });
    }

    applyChanges(form: any) {
        form.validateFields((errors, values) => {
            const errors = _(errors).map((value, key) => value.errors).flatten().value();
            if (_.size(errors) > 0) {
                return;
            }

            let changedProps = _.mapValues(values, (value, key) => {
                if (key === 'dob') {
                    return value.format(this.DATE_FORMAT);
                }

                return value;
            });

            if (_.has(changedProps, 'grand_places')) {
                changedProps = {
                    'limits.grand_places': parseInt(values.grand_places, 0),
                };
            }

            if (_.has(changedProps, 'pass')) {
                this.accountApi.setPassword({
                    account_id: this.state.account._id,
                    new_pass: md5(changedProps.pass)
                }).then((result) => {
                    this.setState({
                        updateProgress: false,
                        showEdit: false,
                    });

                    message.success('The account password has been changed successfully.');
                }, (error) => {
                    this.setState({
                        updateProgress: false
                    });

                    notification.error({
                        message: 'Update Error',
                        description: 'An error happened while trying to set a new password.'
                    });
                });
            } else {
                let editedAccount = _.clone(this.state.account);

                let changedLimitProps = null;
                if (_.has(changedProps, 'limits.grand_places')) {
                    changedLimitProps = {
                        limits: {grand_places: parseInt(values.grand_places, 0)},
                    };
                }

                this.setState({
                    updateProgress: true,
                    account: _.merge(editedAccount, changedLimitProps ? changedLimitProps : changedProps)
                });


                this.accountApi.edit(_.merge(changedProps, {account_id: this.state.account._id})).then((result) => {
                    this.setState({
                        updateProgress: false,
                        showEdit: false,
                    });
                    if (this.props.onChange) {
                        this.props.onChange(editedAccount);
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
            }
        });
    }

    removePicture() {
        this.accountApi.removePicture({
            account_id: this.state.account._id
        }).then((result) => {
            let editedAccount = _.clone(this.state.account);
            editedAccount.picture = {};
            this.setState({
                account: editedAccount
            });
            if (this.props.onChange) {
                this.props.onChange(editedAccount);
            }
        }).catch((error) => {
            notification.error({
                message: 'Update Error',
                description: 'An error has occured while removing the account picture.'
            });
        });
    }

    pictureChange(info: any) {
        if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
            return;
        }

        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);

            this.accountApi.setPicture({
                account_id: this.state.account._id,
                universal_id: info.file.response.data.files[0].universal_id
            }).then((result) => {
                let editedAccount = _.clone(this.state.account);
                editedAccount.picture = info.file.response.data.files[0].thumbs;
                this.setState({
                    account: editedAccount
                });
                if (this.props.onChange) {
                    this.props.onChange(editedAccount);
                }
            }, (error) => {
                notification.error({
                    message: 'Update Error',
                    description: 'We were not able to set the picture!'
                });
            });
        }
    }

    beforeUpload(file: any, fileList: any) {
        console.log(fileList);
        fileList = [];
        if (!this.state.token) {
            notification.error({
                message: 'Error',
                description: 'We are not able to upload the picture.'
            });
            return false;
        }
    }

    onClose() {
        if (this.updated) {
            this.broadcastUpdate();
        }
        this.props.onClose();
        this.setState({
            visible: false,
        });
    }

    updateAdmin(checked: boolean) {
        let editedAccount = _.clone(this.state.account);
        _.merge(editedAccount.authority, {admin: checked});

        const action = checked
            ? this.accountApi.promote({account_id: editedAccount._id})
            : this.accountApi.demote({account_id: editedAccount._id});

        action.then((result) => {
            if (this.props.onChange) {
                this.props.onChange(editedAccount);
            }
            if (checked) {
                message.success(`"${editedAccount._id}" can access Nested Administrator.`);
            } else {
                message.success(`"${editedAccount._id}" would not be longer able to access Nested Administrator.`);
            }
            this.setState({
                account: editedAccount,
            });
            this.updated = true;
        }, (error) => {
            message.error('We were not able to update the field!');
        });
    }

    updateLabelManager(value: boolean) {
        let editedAccount = _.clone(this.state.account);
        _.merge(editedAccount.authority, { label_editor: value });

        this.accountApi.edit({ account_id: editedAccount._id, 'authority.label_editor': value }).then((result) => {
            if (this.props.onChange) {
                this.props.onChange(editedAccount);
            }
            this.updated = true;
            this.setState({
                account: editedAccount,
            });
            message.success('The field has been updated.');
        }, (error) => {
            message.error('We were not able to update the field!');
        });
    }

    onPrivacyChange(props: any) {
        let editedAccount = _.clone(this.state.account);
        _.merge(editedAccount.privacy, props);

        this.accountApi.edit(_.merge(props, {account_id: editedAccount._id})).then((result) => {
            if (this.props.onChange) {
                this.props.onChange(editedAccount);
            }

            message.success('The field has been updated.');
        }, (error) => {
            message.error('We were not able to update the field!');
        });
    }

    onActiveChange(checked: boolean) {
        let editedAccount = _.clone(this.state.account);
        _.merge(editedAccount, {disabled: !checked});

        const action = checked
            ? this.accountApi.enable({account_id: editedAccount._id})
            : this.accountApi.disable({account_id: editedAccount._id});

        action.then((result) => {
            this.setState({
                account: editedAccount,
            });
            if (this.props.onChange) {
                this.props.onChange(editedAccount);
            }

            if (checked) {
                message.success(`"${editedAccount._id}" is active now.`);
            } else {
                message.success(`"${editedAccount._id}" is not active now.`);
            }
        }, (error) => {
            let unEditedAccount = _.clone(this.state.account);
            _.merge(unEditedAccount, {disabled: checked});
            this.setState({
                account: unEditedAccount,
            });
            if (error.err_code === 6) {
                message.error('You have reached the active members of nested service limit!');
            } else {
                message.error('We were not able to update the field!');
            }
        });
    }

    toggleEditMode(editMode: boolean) {
        this.setState({
            editMode: editMode || !this.state.editMode,
        });
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

    updateFName(event: any) {
        this.updateModel({
            fname: event.currentTarget.value,
        });
    }

    updateLName(event: any) {
        this.updateModel({
            lname: event.currentTarget.value,
        });
    }

    updatePhone(event: any) {
        this.updateModel({
            phone: event.currentTarget.value,
        });
    }

    updateEmail(event: any) {
        this.updateModel({
            email: event.currentTarget.value,
        });
    }

    updateDOB(data: any) {
        this.updateModel({
            dob: moment(data).format(this.DATE_FORMAT),
        });
    }

    updateGender(data: any) {
        this.updateModel({
            gender: data,
        });
    }

    updateGrandPlaceLimit(event: any) {
        this.updateModel({
            grand_places_limit: this.extractNumber(event.currentTarget.value || 0),
        });
    }

    updateEditProfile(data: any) {
        this.updateModel({
            change_profile: data,
        });
    }

    updateSearchable(data: any) {
        this.updateModel({
            searchable: data,
        });
    }

    resetModel () {
        this.updateModel({
            account_id: this.state.account._id,
            fname: this.state.account.fname,
            lname: this.state.account.lname,
            gender: this.state.account.gender,
            dob: this.state.account.dob,
            email: this.state.account.email,
            phone: this.state.account.phone,
            searchable: this.state.account.searchable,
            change_profile: this.state.account.privacy.change_profile,
            change_picture: this.state.account.privacy.change_picture,
            force_password: this.state.account.flags.force_password_change,
            grand_places_limit: this.state.account.limits.grand_places,
            label_editor_authority: this.state.account.authority.label_editor,
            admin_authority: this.state.account.authority.admin,
        });
    }

    updateViewModel () {
        let account = this.state.account;
        account.fname = this.state.model.fname;
        account.lname = this.state.model.lname;
        account.gender = this.state.model.gender;
        account.dob = this.state.model.dob;
        account.email = this.state.model.email;
        account.phone = this.state.model.phone;
        account.searchable = this.state.model.searchable;
        account.privacy.change_profile = this.state.model.change_profile;
        account.privacy.change_picture = this.state.model.change_picture;
        account.limits.change_picture = this.state.model.grand_places_limit;

        this.setState({
            account: account,
        });
    }

    broadcastUpdate() {
        const event = new Event('account_updated');
        window.dispatchEvent(event);
    }

    pickFile(e: any) {
        const file = e.target.files.item(0);
        const imageType = /^image\//;

        if (!file || !imageType.test(file.type)) {
            return;
        }
        this.setState({
            pickedImage: file
        });
    }

    saveForm () {
        // return this.form = form;
        this.accountApi.edit({
            account_id: this.state.model.account_id,
            fname: this.state.model.fname,
            lname: this.state.model.lname,
            gender: this.state.model.gender,
            dob: this.state.model.dob,
            email: this.state.model.email,
            phone: this.state.model.phone,
            searchable: this.state.model.searchable,
            change_profile: this.state.model.change_profile,
            change_picture: this.state.model.change_picture,
            force_password: this.state.model.force_password,
            'limits.grand_places': parseInt(this.state.model.grand_places_limit),
            'authority.label_editor': this.state.model.label_editor_authority
        }).then((data) => {
            this.updateViewModel();
            this.toggleEditMode(false);
            this.updated = true;
        });
    }

    stopPropagate = (e: any) => {
        e.stopPropagation();
    }

    clearForm () {
        // this.form.resetFields();
        this.resetModel();
        this.toggleEditMode(false);
    }

    removeFromPlace (id: string) {
        const index = _.findIndex(this.state.places, {
            _id: id,
        });
        if (index > -1) {
            this.placeApi.removeMember({
                place_id: id,
                account_id: this.state.account._id,
            }).then((data) => {
                console.log(data);
                this.state.places.splice(index, 1);
                this.setState({
                    places: this.state.places,
                });
            });
        }
        this.setState({
            visibleRemoveMember: false,
        });
    }

    demoteInPlace(id: string) {
        const index = _.findIndex(this.state.places, {
            _id: id,
        });
        if (index > -1 && _.includes(this.state.places[index].access, 'C')) {
            this.placeApi.demoteMember({
                place_id: id,
                account_id: this.state.account._id,
            }).then((data) => {
                console.log(data);
                _.remove(this.state.places[index].access, (item) => {
                    return item === 'C';
                });
                this.setState({
                    places: this.state.places,
                });
            });
        }
    }

    promoteInPlace(id: string) {
        const index = _.findIndex(this.state.places, {
            _id: id,
        });
        if (index > -1 && !_.includes(this.state.places[index].access, 'C')) {
            this.placeApi.promoteMember({
                place_id: id,
                account_id: this.state.account._id,
            }).then((data) => {
                console.log(data);
                if (_.isArray(this.state.places[index].access)) {
                    this.state.places[index].access.push('C');
                } else {
                    this.state.places[index].acces = ['C'];
                }
                this.setState({
                    places: this.state.places,
                });
            });
        }
    }

    onCropped(file: any) {
        const that = this;
        const formData = new FormData();
        formData.append('blob', file, file.name);
        const credentials = AAA.getInstance().getCredentials();
        var xhr = new XMLHttpRequest();
        xhr.open('POST', `${CONFIG().STORE.URL}/upload/profile_pic/${credentials.sk}/${this.state.token}`, true);
        this.setState({
            uploadPercent: 0,
            imageIsUploading: true,
        });
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        // xhr.setRequestHeader('Access-Control-Allow-Origin', location.host);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                const resp = JSON.parse(xhr.response);
                message.success(`user avatar uploaded successfully`);

                that.accountApi.setPicture({
                    account_id: that.state.account._id,
                    universal_id: resp.data.files[0].universal_id
                }).then((result) => {
                    let editedAccount = _.clone(that.state.account);
                    editedAccount.picture = resp.data.files[0].thumbs;
                    that.setState({
                        account: editedAccount,
                        uploadPercent: 0,
                        imageIsUploading: false,
                    });
                    if (that.props.onChange) {
                        that.props.onChange(editedAccount);
                    }
                }, (error) => {
                    notification.error({
                        message: 'Update Error',
                        description: 'We were not able to set the picture!'
                    });
                });
            }
        };
        xhr.send(formData);
    }

    toggleRemoveMemberModal (ref: any) {
        if (ref) {
            this.setState({
                removeMemberPlaceRef: ref,
            });
        }
        this.setState({
            visibleRemoveMember: !this.state.visibleRemoveMember,
        });
    }

    onFlagChange(props: any) {
        let editedAccount = _.clone(this.state.account);
        _.merge(editedAccount.flags, props);
        this.accountApi.edit(_.merge(props, {account_id: editedAccount._id})).then((result) => {
            if (this.props.onChange) {
                this.props.onChange(editedAccount);
            }

            this.updated = true;
            message.success('The field has been updated.');
        }, (error) => {
            message.error('We were not able to update the field!');
        });
    }
    render() {
        const {editMode} = this.state;
        const managerInPlaces = _.filter(this.state.places, (place) => _.includes(place.access, 'C'));
        const memberInPlaces = _.differenceBy(this.state.places, managerInPlaces, '_id');

        const credentials = AAA.getInstance().getCredentials();
        const uploadUrl = `${CONFIG().STORE.URL}/upload/profile_pic/${credentials.sk}/${this.state.token}`;

        const items = [
            {
                key: 'forcepassword',
                name: 'Force Change Password',
                icon: 'lock16',
                switch: this.state.model.force_password,
                switchChange: (data) => {
                    this.onFlagChange({force_password: data});
                },
            },
            {
                key: 'label',
                name: 'Label Manager',
                icon: 'tag16',
                switch: this.state.model.label_editor_authority,
                switchChange: (data) => {
                    this.updateLabelManager(data);
                },
            },
            {
                key: 'admin',
                name: 'Admin',
                icon: 'gear16',
                switch: this.state.model.admin_authority,
                switchChange: (data) => {
                    this.updateAdmin(data);
                },
            },
            {
                key: 'password',
                name: 'Change Password',
                icon: 'lock16',
                action: (data) => {
                    this.toggleChangePasswordModal();
                },
            },
        ];
        let header = null;
        if (this.state.reportTab) {
            header = (
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
            header = (
                <Row className='modal-head' type='flex' align='middle'>
                    {/* Top bar */}
                    <div className='modal-close' onClick={this.onClose.bind(this)}>
                        <IcoN size={24} name={'xcross24'}/>
                    </div>
                    <h3>Account Details</h3>
                    <div className='filler'></div>
                    {!editMode && (
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
                        <Row className='account-control' type='flex' align='middle' onClick={this.sendMessageToggle}>
                            <IcoN size={16} name={'compose16'}/>
                            <span>Send a Message</span>
                        </Row>
                    )}
                    {!editMode && (
                        <div className='modal-more'>
                            <MoreOption menus={items} deviders={[0]}/>
                        </div>
                    )}
                    {editMode && (
                            <Button
                                type=' butn butn-white'
                                onClick={this.clearForm.bind(this)}>Discard</Button>
                    )}
                    {editMode && (
                            <Button
                                type=' butn butn-green'
                                onClick={this.saveForm.bind(this)}>Save Changes</Button>
                    )}
                </Row>
            );
        }

        return (
            <Row>
                {this.state.visiblePlaceModal &&
                <PlaceModal visible={this.state.visiblePlaceModal} place={this.selectedPlace}
                            onClose={this.closePlaceModal.bind(this)}/>
                }
                <SendMessageModal
                    onClose={this.sendMessageToggle}
                    visible={this.state.sendMessageVisible}
                    target={this.state.model.account_id}/>
                <Modal key={this.state.account._id} visible={this.state.visible} onCancel={this.onClose.bind(this)}
                       footer={null} title={header} maskClosable={this.state.maskClosable}
                       afterClose={this.cleanup} width={800}
                       className={['account-modal', 'modal-template', 'nst-modal',
                       editMode ? 'edit-mode' : '',
                       this.state.reportTab ? 'report-mode' : ''].join(' ')}>
                    {!this.state.reportTab &&
                        <Row gutter={16} type='flex'>
                            <Col span={16}>
                                <div className='modal-body'>
                                    <Row className='account-info-top'>
                                        <Row className='account-info-top-1' type='flex' align='middle'>
                                            <div className='account-avatar'>
                                                <UserAvatar avatar size={64} user={this.state.account}/>
                                            </div>
                                            <input onChange={this.pickFile.bind(this)} style={{display: 'none'}} id='file' type='file'/>
                                            {
                                                (this.state.token && editMode) &&
                                                <Upload
                                                    name='avatar'
                                                    action={uploadUrl}
                                                    accept='image/*'
                                                    multiple={false}
                                                    showUploadList={false}
                                                    onChange={this.pictureChange}
                                                    beforeUpload={this.beforeUpload}
                                                >
                                                {/* <Button
                                                    type=' butn butn-green secondary'
                                                    onClick={this.changePhoto}>Upload Photo</Button> */}
                                                <label onClick={this.stopPropagate} className='butn butn-green secondary' htmlFor='file'><span>Upload a Photo</span></label>
                                                <Button type=' butn butn-red secondary'>
                                                    Remove Photo
                                                </Button>
                                                </Upload>
                                            }
                                            {!editMode &&
                                                <div className='account-name'>
                                                    <span><b>{this.state.account.fname} {this.state.account.lname}</b></span>
                                                    <span>@{this.state.account._id}</span>
                                                </div>
                                            }
                                            {/* {
                                                this.state.account.picture && this.state.account.picture.org &&
                                                <a className='remove-photo' onClick={this.removePicture}>Remove Photo</a>
                                            } */}
                                            <div className='filler'/>
                                            {!editMode &&
                                                <Switch checkedChildren='Active' unCheckedChildren='Deactive' defaultChecked={!this.state.account.disabled}
                                                onChange={this.onActiveChange} checked={!this.state.account.disabled}  className='large-switch'/>
                                            }
                                        </Row>
                                        {!editMode &&
                                            <Row className='account-info-top-2' type='flex' align='middle'>
                                                <div className='account-avatar'>
                                                    <Row type='flex' justify='center'>
                                                        {this.state.account.authority.admin &&
                                                            <IcoN size={16} name={'gearWire16'}/>
                                                        }
                                                        {this.state.account.authority.label_editor &&
                                                            <IcoN size={16} name={'tagWire16'}/>
                                                        }
                                                    </Row>
                                                </div>
                                                {this.state.account.authority.admin && this.state.account.authority.label_editor &&
                                                    <h5>Admin and Label Manager</h5>
                                                }
                                                {this.state.account.authority.admin && !this.state.account.authority.label_editor &&
                                                <h5>Admin</h5>
                                                }
                                                {!this.state.account.authority.admin && this.state.account.authority.label_editor &&
                                                <h5>Label Manager</h5>
                                                }
                                                <div className='filler'/>
                                            </Row>
                                        }
                                    </Row>
                                    {!editMode && <hr className='info-row'/>}
                                    {editMode &&
                                        <Row className='info-row' gutter={24}>
                                            <Col span={12}>
                                                <label>First Name</label>
                                                <Input
                                                    id='name'
                                                    size='large'
                                                    className='nst-input'
                                                    value={this.state.model.fname}
                                                    onChange={this.updateFName.bind(this)}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <label>Last Name</label>
                                                <Input
                                                    id='name'
                                                    size='large'
                                                    className='nst-input'
                                                    value={this.state.model.lname}
                                                    onChange={this.updateLName.bind(this)}
                                                />
                                            </Col>
                                        </Row>
                                    }
                                    {!editMode &&
                                        <Row className='info-row' gutter={24}>
                                            <Col span={12}>
                                                <label>Phone Number</label>
                                                <span className='label-value'>
                                                    {this.state.account.phone}
                                                </span>
                                            </Col>
                                            <Col span={12}>
                                                <label>Email</label>
                                                {
                                                    this.state.account.email &&
                                                    <span className='label-value'>
                                                        {this.state.account.email}
                                                    </span>
                                                }
                                                {
                                                    !this.state.account.email &&
                                                    <span className='label-value not-assigned'>
                                                        - Not Assigned -
                                                    </span>
                                                }
                                            </Col>
                                        </Row>
                                    }
                                    {editMode &&
                                        <Row className='info-row' gutter={24}>
                                            <Col span={24}>
                                                <label>Phone Number</label>
                                                <Input
                                                    id='name'
                                                    size='large'
                                                    className='nst-input'
                                                    value={this.state.model.phone}
                                                    onChange={this.updatePhone.bind(this)}
                                                />
                                                <p className='field-description'>Enter phone number with country code.</p>
                                            </Col>
                                        </Row>
                                    }
                                    {editMode &&
                                        <Row className='info-row' gutter={24}>
                                            <Col span={24}>
                                                <label>Email</label>
                                                <Input
                                                    id='name'
                                                    size='large'
                                                    className='nst-input'
                                                    value={this.state.model.email}
                                                    onChange={this.updateEmail.bind(this)}
                                                />
                                            </Col>
                                        </Row>
                                    }
                                    <Row className='info-row' gutter={24}>
                                        <Col span={editMode ? 16 : 12}>
                                            <label>Birthday</label>
                                            {(!editMode && this.state.account.dob) &&
                                                <span className='label-value'>
                                                    {this.state.account.dob}
                                                </span>
                                            }
                                            {(!editMode && !this.state.account.dob) &&
                                                <span className='label-value not-assigned'>
                                                    - Not Assigned -
                                                </span>
                                            }
                                            {editMode &&
                                                <DatePicker value={this.state.model.dob && this.state.model.dob !== '' ? moment(this.state.model.dob) : null} onChange={this.updateDOB.bind(this)}
                                                    size='large' className='nst-input' format={this.DATE_FORMAT}/>
                                            }
                                        </Col>
                                        <Col span={editMode ? 8 : 12}>
                                            <label>Gender</label>
                                            {!editMode &&
                                                <span className='label-value'>
                                                {this.getGenderStr(this.state.account.gender)}
                                                </span>
                                            }
                                            {editMode &&
                                                <Select
                                                    placeholder={'choose a gender'}
                                                    size='large'
                                                    style={{width: '100%'}}
                                                    value={this.state.model.gender}
                                                    onChange={this.updateGender.bind(this)}
                                                >
                                                    <Option value={'m'}>Male</Option>
                                                    <Option value={'f'}>Female</Option>
                                                    <Option value={'x'}>Other</Option>
                                                </Select>
                                            }
                                        </Col>
                                    </Row>
                                    {editMode && <Row className='info-row' gutter={24}>
                                        <Col span={12}>
                                            <label>Max. Grand Place</label>
                                            <Input
                                                    id='name'
                                                    size='large'
                                                    className='nst-input'
                                                    value={this.state.model.grand_places_limit}
                                                    onChange={this.updateGrandPlaceLimit.bind(this)}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <label>Edit Profile Access</label>
                                            <Select
                                                placeholder={this.state.model.change_profile ? 'Yes' : 'No'}
                                                style={{width: '100%'}} size='large'
                                                value={this.state.model.change_profile}
                                                onChange={this.updateEditProfile.bind(this)}
                                            >
                                                <Option value={true}>Yes</Option>
                                                <Option value={false}>No</Option>
                                            </Select>
                                        </Col>
                                    </Row>}
                                    {editMode && <Row className='info-row' gutter={24}>
                                        <Row style={{width: '100%'}} type='flex'>
                                            <label style={{width: 'auto'}}>Searchable</label>
                                            <div className='filler'></div>
                                            <Switch checkedChildren='Yes' unCheckedChildren='No'
                                                checked={this.state.model.searchable} onChange={this.updateSearchable.bind(this)}/>
                                        </Row>
                                        <p className='field-description'>A short description about searchable feature.</p>
                                    </Row>}
                                    {!editMode && <hr className='info-row'/>}
                                    {!editMode && <Row className='more-info'>
                                        <Col span={8}>
                                            <label>Searchable</label>
                                            <span className='label-value'>
                                                {this.state.account.privacy.searchable ? 'Yes' : 'No'}
                                            </span>
                                        </Col>
                                        <Col span={8}>
                                            <label>Max. Grand Place</label>
                                            <span className='label-value'>
                                            {this.state.account.limits.grand_places}
                                            </span>
                                        </Col>
                                        <Col span={8}>
                                            <label>Edit Profile Access</label>
                                            <span className='label-value'>
                                                {this.state.account.privacy.change_profile ? 'Yes' : 'No'}
                                            </span>
                                        </Col>
                                    </Row>}
                                </div>
                            </Col>
                            <Col span={8} className='modal-sidebar'>
                                {
                                    managerInPlaces.length > 0 &&
                                    <Row className='list-head'>
                                        Manager of {managerInPlaces.length} place
                                    </Row>
                                }
                                {
                                    managerInPlaces.length > 0 &&
                                    <Row className='remove-margin'>
                                        <Col span={24}>
                                            {managerInPlaces.map((place) => {
                                                return (
                                                    <div key={place._id + '1'} className='user-in-place-item'>
                                                        <PlaceItem onClick={this.showPlaceModal.bind(this)}
                                                                place={place}/>
                                                        {this.state.account._id !== place._id &&
                                                        <a className='remove' title={'Remove From Place'} onClick={this.toggleRemoveMemberModal.bind(this, place._id)}><IcoN size={16} name={'bin16'}/></a> }
                                                        {this.state.account._id !== place._id &&
                                                        <a className='promote' title={'Demote Member'} onClick={this.demoteInPlace.bind(this, place._id)}><IcoN size={24} name={'crown24'}/></a>}

                                                    </div>
                                                );
                                            })}
                                        </Col>
                                    </Row>
                                }
                                {
                                    memberInPlaces.length > 0 &&
                                    <Row className='list-head'>
                                            Member of {memberInPlaces.length} place
                                    </Row>
                                }
                                {
                                    memberInPlaces.length > 0 &&
                                    <Row className='remove-margin'>
                                        <Col span={24}>
                                            {memberInPlaces.map((place) => {
                                                return (<div key={place._id + '2'} className='user-in-place-item'>
                                                    <PlaceItem onClick={this.showPlaceModal.bind(this)}
                                                            place={place} key={place._id}/>
                                                    <a className='remove' title={'Remove From Place'} onClick={this.toggleRemoveMemberModal.bind(this, place._id)}><IcoN size={16} name={'bin16'}/></a>
                                                    <a className='promote' title={'Promote Member'}  onClick={this.promoteInPlace.bind(this, place._id)}><IcoN size={24} name={'crownWire24'}/></a>
                                                </div>);
                                            })}
                                        </Col>
                                    </Row>
                                }
                            </Col>
                        </Row>
                    }
                    {this.state.reportTab &&
                        <div className='reports'>
                            <RelatedChartCards
                                title={[['Posts', 'Comments'], ['Created tasks', 'Assigned tasks', 'Comments', 'Completed tasks']]}
                                direction='vertical'
                                params={{id: this.state.model.account_id}}
                                dataType={[
                                    [ReportType.AccountPost, ReportType.AccountComment],
                                    [ReportType.AccountTaskAdd, ReportType.AccountTaskAssigned, ReportType.AccountTaskComment, ReportType.AccountTaskCommpleted]
                                ]}
                                syncId='account'
                                color={[['#e74c3c', '#f1c40f'], ['#6494e0', '#3e337a', '#7c452e', '#1d6d54']]}
                                measure={[MeasureType.NUMBER, MeasureType.NUMBER]}/>
                        </div>
                    }
                    {this.state.visibleChangePassword &&
                        <Modal
                            key={'_change_password_modal'}
                            content='Some descriptions'
                            title='Change Password'
                            width={360}
                            visible={true}
                            onCancel={this.toggleChangePasswordModal.bind(this)}
                            footer={[
                                <Button key='cancel' type=' butn butn secondary' size='large'
                                        onClick={this.toggleChangePasswordModal.bind(this)}>Cancel</Button>,
                                <Button key='submit' type=' butn butn-red' size='large'
                                        onClick={this.changePassword.bind(this)}>Change Password</Button>,
                            ]}
                        >
                            <Row className='info-row' gutter={24}>
                                <Col span={24}>
                                    <label>New Password</label>
                                    <Input
                                        id='name'
                                        size='large'
                                        type='password'
                                        className='nst-input'
                                        value={this.state.newPassword}
                                        onChange={this.changePasswordHandler.bind(this)}
                                    />
                                </Col>
                            </Row>
                        </Modal>
                    }
                    <NstCrop avatar={this.state.pickedImage}
                        onCropped={this.onCropped.bind(this)}/>
                    <Modal
                        key={'remove_member'}
                        content='Remove member prompt'
                        title='Remove Member'
                        width={360}
                        visible={this.state.visibleRemoveMember}
                        onCancel={this.toggleRemoveMemberModal.bind(this)}
                        footer={[
                            <Button key='cancel' type=' butn butn secondary' size='large'
                                    onClick={this.toggleRemoveMemberModal.bind(this)}>Cancel</Button>,
                            <Button key='submit' type=' butn butn-red' size='large'
                                    onClick={this.removeFromPlace.bind(this, this.state.removeMemberPlaceRef)}>Delete</Button>,
                        ]}
                    >
                        Do you want to remove "<b>{this.state.account._id}</b>" from this Place?
                    </Modal>
                </Modal>
            </Row>
        );
    }
}

export default View;
