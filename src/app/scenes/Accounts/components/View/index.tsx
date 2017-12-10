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
    Switch
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
    editMode: boolean;
}

class View extends React.Component<IViewProps, IViewState> {
    DATE_FORMAT: string = 'YYYY-MM-DD';

    constructor(props: IViewProps) {
        super(props);
        this.state = {
            setEmail: false,
            editMode: false,
            setDateOfBirth: false,
            account: props.account,
            visiblePlaceModal: false,
            maskClosable: true,
            visible: true,
        };

        this.loadPlaces = this.loadPlaces.bind(this);
        this.editField = this.editField.bind(this);
        this.applyChanges = this.applyChanges.bind(this);
        this.pictureChange = this.pictureChange.bind(this);
        this.loadUploadToken = this.loadUploadToken.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.removePicture = this.removePicture.bind(this);
        this.onAdminChange = this.onAdminChange.bind(this);
        this.onActiveChange = this.onActiveChange.bind(this);
        this.onPrivacyChange = this.onPrivacyChange.bind(this);
        this.toggleEditMode = this.toggleEditMode.bind(this);
        this.clearForm = this.clearForm.bind(this);

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

    editField(target: EditableFields) {
        this.setState({
            editTarget: target,
            showEdit: true,
            uniqueKey: _.uniqueId(),
            updateProgress: false
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

    saveForm = (form) => {
        this.toggleEditMode(false);
        return this.form = form;
    }

    clearForm = () => {
        // this.form.resetFields();
        this.toggleEditMode(false);
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
                universal_id: info.file.response.data[0].universal_id
            }).then((result) => {
                let editedAccount = _.clone(this.state.account);
                editedAccount.picture = info.file.response.data[0].thumbs;
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
        if (!this.state.token) {
            notification.error({
                message: 'Error',
                description: 'We are not able to upload the picture.'
            });
            return false;
        }
    }

    onClose() {
        this.props.onClose();
        this.setState({
            visible: false,
        });
    }

    onAdminChange(checked: boolean) {
        let editedAccount = _.clone(this.state.account);
        _.merge(editedAccount, {admin: checked});

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
        }, (error) => {
            message.error('We were not able to update the field!');
        });
    }

    onAuthorityChange(value: boolean) {
        let editedAccount = _.clone(this.state.account);
        _.merge(editedAccount.authority, { label_editor: value });

        this.accountApi.edit({ account_id: editedAccount._id, 'authority.label_editor': value }).then((result) => {
            if (this.props.onChange) {
                this.props.onChange(editedAccount);
            }

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

    onFlagChange(props: any) {
        let editedAccount = _.clone(this.state.account);
        _.merge(editedAccount.flags, props);
        console.log(_.merge(props, {account_id: editedAccount._id}));
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
            if (this.props.onChange) {
                this.props.onChange(editedAccount);
            }

            if (checked) {
                message.success(`"${editedAccount._id}" is active now.`);
            } else {
                message.success(`"${editedAccount._id}" is not active now.`);
            }
        }, (error) => {
            message.error('We were not able to update the field!');
        });
    }

    toggleEditMode(editMode: boolean) {
        this.setState({
            editMode: editMode || !this.state.editMode,
        });
    }

    render() {
        const {editMode} = this.state;
        console.log(editMode);
        const managerInPlaces = _.filter(this.state.places, (place) => _.includes(place.access, 'C'));
        const memberInPlaces = _.differenceBy(this.state.places, managerInPlaces, '_id');

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
                        this.state.editTarget === EditableFields.fname &&
                        <Form.Item label='First Name'>
                            {getFieldDecorator('fname', {
                                initialValue: this.state.account.fname,
                                rules: [{required: true, message: 'First name is required!'}],
                            })(
                                <Input placeholder='John'/>
                            )}
                        </Form.Item>
                    }
                    {
                        this.state.editTarget === EditableFields.lname &&
                        <Form.Item label='Last Name'>
                            {getFieldDecorator('lname', {
                                initialValue: this.state.account.lname,
                                rules: [{required: true, message: 'Last name is required!'}],
                            })(
                                <Input placeholder='Doe'/>
                            )}
                        </Form.Item>
                    }
                    {
                        this.state.editTarget === EditableFields.phone &&
                        <Form.Item label='Phone'>
                            {getFieldDecorator('phone', {
                                initialValue: this.state.account.phone,
                                rules: [{required: true, message: 'Phone number is required!'}],
                            })(
                                <Input placeholder='989876543210'/>
                            )}
                        </Form.Item>
                    }
                    {
                        this.state.editTarget === EditableFields.dob &&
                        <Form.Item label='Birthdate'>
                            {getFieldDecorator('dob', {
                                initialValue: this.state.account.dob,
                                rules: [],
                            })(
                                <DatePicker format={this.DATE_FORMAT}/>
                            )}
                        </Form.Item>
                    }
                    {
                        this.state.editTarget === EditableFields.email &&
                        <Form.Item label='Email'>
                            {getFieldDecorator('email', {
                                initialValue: this.state.account.email,
                                rules: [],
                            })(
                                <Input placeholder='example@company.com'/>
                            )}
                        </Form.Item>
                    }
                    {
                        this.state.editTarget === EditableFields.pass &&
                        <Form.Item label='Password'>
                            {getFieldDecorator('pass', {
                                rules: [
                                    {required: true, message: 'Password is required!'},
                                    {min: 6, message: 'Password must be more than 6 characters.'}
                                ],
                            })(
                                <Input placeholder='New password'/>
                            )}
                        </Form.Item>
                    }
                    {
                        this.state.editTarget === EditableFields['limits.grand_places'] &&
                        <Form.Item label='Grand Places Limit'>
                            {getFieldDecorator('grand_places', {
                                initialValue: this.state.account.limits.grand_places,
                                rules: [
                                    {required: true, message: 'Grand Places Limit is required!'},
                                    {min: 1, message: 'rand Places Limit is required!'}
                                ],
                            })(
                                <Input placeholder='10' type='number'/>
                            )}
                        </Form.Item>
                    }

                </Form>
            );
        });

        const accountClone = _.clone(this.state.account);
        const credentials = AAA.getInstance().getCredentials();
        const uploadUrl = `${CONFIG().STORE.URL}/upload/profile_pic/${credentials.sk}/${this.state.token}`;

        const items = [
            {
                key: 'label',
                name: 'Label Manager',
                icon: 'tag16',
                switch: false,
                action: () => {
                    // tODO Toggle label manager
                },
            },
            {
                key: 'admin',
                name: 'Admin',
                icon: 'gear16',
                switch: true,
                action: () => {
                    // tODO Toggle Admin manager
                },
            }
        ];
        const header = (
            <Row className='account-bar' type='flex' align='middle'>
                {/* Top bar */}
                <div className='modal-close' onClick={this.onClose.bind(this)}>
                    <IcoN size={24} name={'xcross24'}/>
                </div>
                <h3>Account Deatils</h3>
                <div className='filler'></div>
                {!editMode && (
                    <Row className='account-control' type='flex' align='middle' onClick={this.toggleEditMode}>
                        <IcoN size={16} name={'pencil16'}/>
                        <span>Edit</span>
                    </Row>
                )}
                {!editMode && (
                    <Row className='account-control' type='flex' align='middle'>
                        <IcoN size={16} name={'pencil16'}/>
                        <span>Reports</span>
                    </Row>
                )}
                {!editMode && (
                    <Row className='account-control' type='flex' align='middle'>
                        <IcoN size={16} name={'pencil16'}/>
                        <span>Send a Message</span>
                    </Row>
                )}
                {!editMode && (
                    <div className='modal-more'>
                        <MoreOption menus={items}/>
                    </div>
                )}
                {editMode && (
                        <Button
                            type=' butn butn-white'
                            onClick={this
                                .clearForm}>Discard</Button>
                )}
                {editMode && (
                        <Button
                            type=' butn butn-green'
                            onClick={this
                                .saveForm}>Save Changes</Button>
                )}
            </Row>
        );

        return (
            <Row>
                {this.state.visiblePlaceModal &&
                <PlaceModal visible={this.state.visiblePlaceModal} place={this.selectedPlace}
                            onClose={this.closePlaceModal.bind(this)}/>
                }
                <Modal key={this.state.account._id} visible={this.state.visible} onCancel={this.onClose.bind(this)}
                       footer={null} title={header} maskClosable={this.state.maskClosable}
                       afterClose={this.cleanup} width={800}
                       className={['account-modal', 'nst-modal', editMode ? 'edit-mode' : ''].join(' ')}>
                    <Row gutter={16}>
                        <Col span={16}>
                            <div className='account-body'>
                                <Row className='account-info-top'>
                                    <Row className='account-info-top-1' type='flex' align='middle'>
                                        <div className='account-avatar'>
                                            <UserAvatar avatar size={64} user={this.state.account}/>
                                        </div>
                                        {
                                            (this.state.token && editMode) &&
                                            <Upload
                                                name='avatar'
                                                action={uploadUrl}
                                                accept='image/*'
                                                onChange={this.pictureChange}
                                                beforeUpload={this.beforeUpload}
                                            >
                                            <Button
                                                type=' butn butn-green secondary'
                                                onClick={this.changePhoto}>Upload Photo</Button>
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
                                            onChange={this.onActiveChange}/>
                                        }
                                    </Row>
                                    {!editMode &&
                                        <Row className='account-info-top-2' type='flex' align='middle'>
                                            <div className='account-avatar'>
                                                <Row type='flex' justify='center'>
                                                    <IcoN size={16} name={'gearWire16'}/>
                                                    <IcoN size={16} name={'tagWire16'}/>
                                                </Row>
                                            </div>
                                            <h5>Admin and Label Manager</h5>
                                            <div className='filler'/>
                                        </Row>
                                    }
                                </Row>
                                {!editMode && <hr className='info-row'/>}
                                {editMode &&
                                    <Row className='info-row' gutter={32}>
                                        <Col span={12}>
                                            <label>First Name</label>
                                            <Input/>
                                        </Col>
                                        <Col span={12}>
                                            <label>Last Name</label>
                                            <Input/>
                                        </Col>
                                    </Row>
                                }
                                {!editMode &&
                                    <Row className='info-row' gutter={32}>
                                        <Col span={12}>
                                            <label>Phone Number</label>
                                            <span className='label-value'>
                                                {this.state.account.phone}
                                            </span>
                                        </Col>
                                        <Col span={12}>
                                            <label>Email</label>
                                            <span className='label-value'>
                                                {this.state.account.email}
                                            </span>
                                        </Col>
                                    </Row>
                                }
                                {editMode &&
                                    <Row className='info-row' gutter={32}>
                                        <Col span={24}>
                                            <label>Phone Number</label>
                                            <Input value={this.state.account.phone} />
                                            <p>Enter phone number with country code.</p>
                                        </Col>
                                    </Row>
                                }
                                {editMode &&
                                    <Row className='info-row' gutter={32}>
                                        <Col span={24}>
                                            <label>Email</label>
                                            <Input value={this.state.account.email} />
                                        </Col>
                                    </Row>
                                }
                                <Row className='info-row' gutter={32}>
                                    <Col span={editMode ? 12 : 16}>
                                        <label>Birthday</label>
                                        {!editMode &&
                                            <span className='label-value'>
                                                {this.state.account.dob}
                                            </span>
                                        }
                                        {editMode &&
                                            <Button type='toolkit nst-ico ic_pencil_solid_16'
                                                onClick={() => this.editField(EditableFields.dob)}></Button>
                                        }
                                    </Col>
                                    <Col span={editMode ? 8 : 12}>
                                        <label>Gender</label>
                                        {!editMode &&
                                            <span className='label-value'>
                                            Male/Female
                                            </span>
                                        }
                                        {editMode &&
                                            <Button type='toolkit nst-ico ic_pencil_solid_16'
                                                onClick={() => this.editField(EditableFields.gender)}></Button>
                                        }
                                    </Col>
                                </Row>
                                {editMode && <Row className='info-row' gutter={32}>
                                    <Col span={12}>
                                        <label>Max. Grand Place</label>
                                    </Col>
                                    <Col span={12}>
                                        <label>Edit Profile Access</label>
                                    </Col>
                                </Row>}
                                {editMode && <Row className='info-row' gutter={32}>
                                        <label>Searchable</label>
                                        <div className='filler'></div>
                                        <p>A short description about searchable feature.</p>
                                </Row>}
                                {!editMode && <hr className='info-row'/>}
                                {!editMode && <Row className='more-info'>
                                    <Col span={8}>
                                        <label>Searchable</label>
                                        <span className='label-value'>
                                            {this.state.account.privacy.searchable}
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
                                            {this.state.account.privacy.change_profile}
                                        </span>
                                    </Col>
                                </Row>}
                                {/* <Row>
                                    <Col span={8}>
                                        <label>First Name</label>
                                    </Col>
                                    <Col span={14}>
                                        <b>{this.state.account.fname}</b>
                                    </Col>
                                    <Col span={2}>
                                        <Button type='toolkit nst-ico ic_pencil_solid_16'
                                                onClick={() => this.editField(EditableFields.fname)}></Button>
                                    </Col>
                                </Row> */}
                                {/* <Row>
                                    <Col span={8}>
                                        <label>Last Name</label>
                                    </Col>
                                    <Col span={14}>
                                        <b>{this.state.account.lname}</b>
                                    </Col>
                                    <Col span={2}>
                                        <Button type='toolkit nst-ico ic_pencil_solid_16'
                                                onClick={() => this.editField(EditableFields.lname)}></Button>
                                    </Col>
                                </Row> */}
                                {/* <Row>
                                    <Col span={8}>
                                        <label>User ID</label>
                                    </Col>
                                    <Col span={14}>
                                        @{this.state.account._id}
                                    </Col>
                                    <Col span={2}></Col>
                                </Row> */}
                                {/* <Row>
                                    <Col span={8}>
                                        <label>Password</label>
                                    </Col>
                                    <Col span={14}>
                                        <i>●●●●●●●●</i>
                                    </Col>
                                    <Col span={2}>
                                        <Button type='toolkit nst-ico ic_more_solid_16'
                                                onClick={() => this.editField(EditableFields.pass)}></Button>
                                    </Col>
                                </Row> */}
                                {/* <Row>
                                    <Col span={8}>
                                        <label>Phone Number</label>
                                    </Col>
                                    <Col span={14}>
                                        {this.state.account.phone}
                                    </Col>
                                    <Col span={2}>
                                        <Button type='toolkit nst-ico ic_pencil_solid_16'
                                                onClick={() => this.editField(EditableFields.phone)}></Button>
                                    </Col>
                                </Row> */}
                                {/* <Row>
                                    <Col span={8}>
                                        <label>Birthday</label>
                                    </Col>
                                    <Col span={14}>
                                        {
                                            this.state.account.dob &&
                                            <span>{this.state.account.dob}</span>
                                        }
                                        {
                                            !this.state.account.dob &&
                                            <a onClick={() => this.editField(EditableFields.dob)}><i>-click to assign-</i></a>
                                        }
                                    </Col>
                                    <Col span={2}>
                                        {
                                            this.state.account.dob &&
                                            <Button type='toolkit nst-ico ic_pencil_solid_16'
                                                    onClick={() => this.editField(EditableFields.dob)}></Button>
                                        }
                                    </Col>
                                </Row> */}
                                {/* <Row>
                                    <Col span={8}>
                                        <label>Email</label>
                                    </Col>
                                    <Col span={14}>
                                        {
                                            this.state.account.email &&
                                            <span>{this.state.account.email}</span>
                                        }
                                        {
                                            !this.state.account.email &&
                                            <a onClick={() => this.editField(EditableFields.email)}><i>-click to assign-</i></a>
                                        }
                                    </Col>
                                    <Col span={2}>
                                        {
                                            this.state.account.email &&
                                            <Button type='toolkit nst-ico ic_pencil_solid_16'
                                                    onClick={() => this.editField(EditableFields.email)}></Button>
                                        }
                                    </Col>
                                </Row> */}
                                {/* <Row>
                                    <Col span={8}>
                                        <label>Searchable</label>
                                    </Col>
                                    <Col span={14}>
                                        <Switch
                                            checkedChildren={<Icon type='check'/>}
                                            unCheckedChildren={<Icon type='cross'/>}
                                            defaultChecked={this.state.account.privacy.searchable}
                                            onChange={(checked) => this.onPrivacyChange({searchable: checked})}
                                        />
                                    </Col>
                                    <Col span={2}></Col>
                                </Row> */}
                                {/* <Row>
                                    <Col span={8}>
                                        <label>Grand Places Limit</label>
                                    </Col>
                                    <Col span={14}>
                                        {this.state.account.limits.grand_places}
                                    </Col>
                                    <Col span={2}>
                                        <Button type='toolkit nst-ico ic_pencil_solid_16'
                                                onClick={() => this.editField(EditableFields['limits.grand_places'])}></Button>
                                    </Col>
                                </Row> */}
                                {/* <Row>
                                    <Col span={8}>
                                        <label>Edit Profile</label>
                                    </Col>
                                    <Col span={14}>
                                        <Switch
                                            checkedChildren={<Icon type='check'/>}
                                            unCheckedChildren={<Icon type='cross'/>}
                                            defaultChecked={this.state.account.privacy.change_profile}
                                            onChange={(checked) => this.onPrivacyChange({change_profile: checked})}
                                        />
                                    </Col>
                                    <Col span={2}></Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <label>Change Profile Picture</label>
                                    </Col>
                                    <Col span={14}>
                                        <Switch
                                            checkedChildren={<Icon type='check'/>}
                                            unCheckedChildren={<Icon type='cross'/>}
                                            defaultChecked={this.state.account.privacy.change_picture}
                                            onChange={(checked) => this.onPrivacyChange({change_picture: checked})}
                                        />
                                    </Col>
                                    <Col span={2}></Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <label>Force Password Change</label>
                                    </Col>
                                    <Col span={14}>
                                        <Switch
                                            checkedChildren={<Icon type='check'/>}
                                            unCheckedChildren={<Icon type='cross'/>}
                                            defaultChecked={this.state.account.flags.force_password_change}
                                            onChange={(checked) => this.onFlagChange({force_password: checked})}
                                        />
                                    </Col>
                                    <Col span={2}></Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <label>Administrator</label>
                                    </Col>
                                    <Col span={14}>
                                        <Switch
                                            checkedChildren={<Icon type='check'/>}
                                            unCheckedChildren={<Icon type='cross'/>}
                                            defaultChecked={this.state.account.admin}
                                            onChange={this.onAdminChange}
                                        />
                                    </Col>
                                    <Col span={2}></Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <label>Label Manager</label>
                                    </Col>
                                    <Col span={14}>
                                        <Switch
                                            checkedChildren={<Icon type='check'/>}
                                            unCheckedChildren={<Icon type='cross'/>}
                                            defaultChecked={this.state.account.authority ? this.state.account.authority.label_editor : false}
                                            onChange={(checked) => this.onAuthorityChange(checked)}
                                        />
                                    </Col>
                                    <Col span={2}></Col>
                                </Row> */}
                            </div>
                        </Col>
                        <Col span={8}>
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
                                                <div className='user-in-place-item'>
                                                    <PlaceItem onClick={this.showPlaceModal.bind(this)}
                                                            place={place}/>
                                                    <a className='promote'>Demote</a>
                                                    <a className='remove'><IcoN size={16} name={'xcross16'}/></a>
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
                                        {memberInPlaces.map((place) => <div className='user-in-place-item'>
                                                    <PlaceItem onClick={this.showPlaceModal.bind(this)}
                                                        place={place} key={place._id}/>
                                                    <a className='promote'>Demote</a>
                                                    <a className='remove'><IcoN size={16} name={'xcross16'}/></a>
                                                </div>)}
                                    </Col>
                                </Row>
                            }
                        </Col>
                    </Row>
                    <Modal
                        key={this.props.account._id}
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
                        <EditForm ref={this.saveForm} {...accountClone} />
                    </Modal>
                </Modal>
            </Row>
        );
    }
}

export default View;
