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
import EditableFields from './EditableFields';
import CONFIG from '/src/app/config';
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
    visible: boolean;
}

class View extends React.Component<IViewProps, IViewState> {
    DATE_FORMAT: string = 'YYYY-MM-DD';

    constructor(props: IViewProps) {
        super(props);
        this.state = {
            setEmail: false,
            setDateOfBirth: false,
            account: props.account,
            visiblePlaceModal: false,
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

    saveForm = (form) => this.form = form;

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

    render() {
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
        return (
            <Row>
                {this.state.visiblePlaceModal &&
                <PlaceModal visible={this.state.visiblePlaceModal} place={this.selectedPlace}
                            onClose={this.closePlaceModal.bind(this)}/>
                }
                <Modal key={this.state.account._id} visible={this.state.visible} onCancel={this.onClose.bind(this)}
                       footer={null}
                       afterClose={this.cleanup} className='account-modal nst-modal' width={480} title='Account Info'>
                    <Row type='flex' align='top'>
                        <Col span={8}>
                            <UserAvatar avatar size={64} user={this.state.account}/>
                        </Col>
                        <Col span={8}>
                            {
                                this.state.token &&
                                <Upload
                                    name='avatar'
                                    action={uploadUrl}
                                    accept='image/*'
                                    onChange={this.pictureChange}
                                    beforeUpload={this.beforeUpload}
                                >
                                    <a className='change-photo' onClick={this.changePhoto}>Change Photo</a>
                                </Upload>
                            }
                        </Col>
                        <Col span={8}>
                            {
                                this.state.account.picture && this.state.account.picture.org &&
                                <a className='remove-photo' onClick={this.removePicture}>Remove Photo</a>
                            }
                        </Col>
                    </Row>
                    <Row>
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
                    </Row>
                    <Row>
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
                    </Row>
                    <Row>
                        <Col span={8}>
                            <label>User ID</label>
                        </Col>
                        <Col span={14}>
                            @{this.state.account._id}
                        </Col>
                        <Col span={2}></Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <label>Active</label>
                        </Col>
                        <Col span={14}>
                            <Switch
                                checkedChildren={<Icon type='check'/>}
                                unCheckedChildren={<Icon type='cross'/>}
                                defaultChecked={!this.state.account.disabled}
                                onChange={this.onActiveChange}
                            />
                        </Col>
                        <Col span={2}></Col>
                    </Row>
                    <Row>
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
                    </Row>
                    <Row>
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
                    </Row>
                    <Row>
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
                    </Row>
                    <Row>
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
                    </Row>
                    <Row>
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
                    </Row>
                    <Row>
                        <Col span={24}>
                            <div className='form-devider'></div>
                        </Col>
                    </Row>
                    <Row>
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

                    </Row>
                    <Row>
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
                    </Row>
                    {
                        managerInPlaces.length > 0 &&
                        <Row className='devide-row'>
                            <Col span={18}>
                                Manager of
                            </Col>
                            <Col style={{textAlign: 'right'}} span={6}>
                                {managerInPlaces.length} place
                            </Col>
                        </Row>
                    }
                    {
                        managerInPlaces.length > 0 &&
                        <Row className='remove-margin'>
                            <Col span={24}>
                                {managerInPlaces.map((place) => <PlaceItem onClick={this.showPlaceModal.bind(this)}
                                                                           place={place}/>)}
                            </Col>
                        </Row>
                    }
                    {
                        memberInPlaces.length > 0 &&
                        <Row className='devide-row'>
                            <Col span={18}>
                                Member of
                            </Col>
                            <Col style={{textAlign: 'right'}} span={6}>
                                {memberInPlaces.length} place
                            </Col>
                        </Row>
                    }
                    {
                        memberInPlaces.length > 0 &&
                        <Row className='remove-margin'>
                            <Col span={24}>
                                {memberInPlaces.map((place) => <PlaceItem onClick={this.showPlaceModal.bind(this)}
                                                                          place={place} key={place._id}/>)}
                            </Col>
                        </Row>
                    }
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
