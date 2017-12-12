import * as React from 'react';
import PlaceApi from '../../api/place/index';
import IPlace from '../../api/place/interfaces/IPlace';
import {Modal, Row, Col, Icon, Button, message, Form, Input, Select, notification} from 'antd';

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

interface IProps {
    place?: IPlace;
    visible?: boolean;
    onClose?: any;
    onChange: (place: IPlace) => {};
}

interface IStates {
    editTarget: EditableFields | null;
    visible: boolean;
    place?: IPlace;
    members?: any;
    chosen ?: IUser;
    viewAccount: boolean;
    creators: Array<string>;
    isGrandPlace: boolean;
    showEdit: boolean;
    updateProgress: boolean;
    editMode: boolean;
    sidebarTab: number;
}


export default class PlaceModal extends React.Component<IProps, IStates> {
    currentUser: IUser;
    placeApi: any;

    constructor(props: any) {
        super(props);
        this.state = {
            sidebarTab: 0,
            updateProgress: false,
            showEdit: false,
            visible: false,
            place: this.props.place,
            members: [],
            editMode: false,
            viewAccount: false,
            creators: this.props.place.creators,
            isGrandPlace: true
        };
        this.changeSidebarTab = this.changeSidebarTab.bind(this);
        this.currentUser = AAA.getInstance().getUser();
    }

    componentWillReceiveProps(props: any) {
        this.setState({
            place: props.place,
            creators: props.place.creators,
            visible: props.visible,
        });
        this.fetchUsers();
    }

    fetchUsers() {
        let placeApi = new PlaceApi();
        placeApi.getPlaceListMemebers({
            place_id: this.props.place._id
        }).then((accounts) => {
            this.setState({
                members: accounts,
            });
        });
    }

    componentDidMount() {
        this.placeApi = new PlaceApi();
        if (this.props.place) {
            this.setState({
                place: this.props.place,
                creators: this.props.place.creators,
                visible: this.props.visible,
            });
        }
        console.log(this.props.place);
        this.fetchUsers();
    }

    onItemClick = (account) => {
        this.setState({chosen: account, viewAccount: true, visible: false});
    }

    onCloseView = () => {
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
        this.setState({
            visible: false,
        });
        if (this.props.onClose && typeof this.props.onClose === 'function') {
            this.props.onClose();
        }
    }

    isManager(user: any) {
        let creator = _.indexOf(this.state.creators, user._id);
        if (creator > -1) {
            return true;
        } else {
            return false;
        }
    }

    addAsManager() {
        let placeApi = new PlaceApi();
        placeApi.placeAddMember({
            account_id: this.currentUser._id,
            place_id: this.props.place._id,
        }).then((res: any) => {
            // fixme:: remove error handler
            if (res.err_code && res.err_code === 1) {
                message.error(`You must be a member of grand-place first.`);
            } else if (res.err_code) {
                message.error(`An error happened!`);
            } else {
                message.success(`You are added as admin in "${this.props.place.name}"`);
                this.setState({
                    creators: _.concat(this.state.creators, [this.currentUser._id])
                });
                this.fetchUsers();
            }
        }).catch((err: any) => {
            message.error(`An error happened!`);
            console.log(err);
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

    toggleAdmin(user: any) {
        // todo
    }

    removeMember(user: any) {
        // todo
    }

    getMembersItems() {
        var list = this.state.members.map((u: any) => {
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
                    className='addMemberItem'>
                    <IcoN size={16} name={'cross16'}/>
                    Add member...
                </li>
            </ul>
        );
    }

    render() {
        const {place, editMode} = this.state;
        const isPersonal = place.type === C_PLACE_TYPE[C_PLACE_TYPE.personal];
        console.log(isPersonal, place.type, C_PLACE_TYPE.personal, C_PLACE_TYPE[C_PLACE_TYPE.personal]);
        const iconStyle = {
            width: '16px',
            height: '16px',
            verticalAlign: 'middle'
        };
        let lockedIcon, lockedTxt, reciveIcon, reciveTxt, searchableIcon, searchableTxt;
        const placeClone = _.clone(this.state.place);

        if (place.privacy.locked === true) {
            lockedIcon = <Icon type=' nst-ico ic_brick_wall_solid_16' style={iconStyle}/>;
            lockedTxt = 'Private Place';
        } else {
            lockedIcon = <Icon type=' nst-ico ic_window_solid_16' style={iconStyle}/>;
            lockedTxt = 'Common Place';
        }

        if (place.privacy.search === true) {
            searchableIcon = <Icon type=' nst-ico ic_search_24' style={iconStyle}/>;
            searchableTxt = 'This place shows in search results.';
        } else {
            searchableIcon = <Icon type=' nst-ico ic_non_search_24' style={iconStyle}/>;
            searchableTxt = 'This place is not shown in search results.';
        }

        if (place.privacy.receptive === 'external' && place.policy.add_post === 'everyone') {
            reciveIcon = <Icon type=' nst-ico ic_earth_solid_24' style={iconStyle}/>;
            reciveTxt = 'Everyone can share post.';
        } else if (place.privacy.receptive === 'internal' && place.policy.add_post === 'everyone') {
            reciveIcon = <Icon type=' nst-ico ic_team_solid_24' style={iconStyle}/>;
            reciveTxt = 'All grand-place members can share post';
        } else if (place.privacy.receptive === 'off' && place.policy.add_post === 'everyone') {
            reciveIcon = <Icon type=' nst-ico ic_manager-and-member_solid_24' style={iconStyle}/>;
            reciveTxt = 'All members of the place could share post.';
        } else if (place.privacy.receptive === 'off' && place.policy.add_post === 'creators') {
            reciveIcon = <Icon type=' nst-ico ic_manager_solid_24' style={iconStyle}/>;
            reciveTxt = 'Only managers can share post';
        }

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
                    <Row className='account-control' type='flex' align='middle'>
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
                {!editMode && (
                    <div className='modal-more'>
                        <MoreOption menus={items} deviders={[0]}/>
                    </div>
                )}
                {editMode && (
                        <Button
                            type=' butn butn-white'>Discard</Button>
                )}
                {editMode && (
                        <Button
                            type=' butn butn-green'>Save Changes</Button>
                )}
            </Row>
        );

        return (
            <div>
                {
                    this.state.viewAccount &&
                    <View account={this.state.chosen} visible={this.state.viewAccount}
                          onChange={this.handleChange.bind(this)}
                          onClose={this.onCloseView}/>
                }
                {place &&
                <Modal
                       className={['place-modal', 'modal-template', 'nst-modal', editMode ? 'edit-mode' : ''].join(' ')}
                       maskClosable={true}
                       width={800}
                       closable={true}
                       onCancel={this.handleCancel.bind(this)}
                       visible={this.state.visible}
                       footer={null}
                       title={header}>
                    <Row gutter={16} type='flex'>
                        <Col span={16}>
                            <div className='modal-body'>
                                <Row type='flex'>
                                    <div className='place-pic'>
                                        <PlaceView className='placemodal' avatar size={64} place={place}/>
                                    </div>
                                    <div className='Place-Des'>
                                        <h2>{place.name}</h2>
                                        <h4>{place._id}</h4>
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
                                        {!isPersonal && <label>
                                            Create Sub-Place Policy
                                        </label>}
                                        {!isPersonal && <span className='label-value'>
                                            <PlacePolicy place={place} text={true} create={true}/>  
                                        </span>}
                                        {!isPersonal && <label>
                                            Add Member Policy
                                        </label>}
                                        {!isPersonal && <span className='label-value'>
                                            <PlacePolicy place={place} text={true} add={true}/>  
                                        </span>}
                                        {!isPersonal && <Row className='info-row' gutter={24}>
                                            <Col span={12}>
                                                <label>Max. Managers</label>
                                                <span className='label-value power'>
                                                {place.counters.creators}
                                                </span>
                                                <span className='label-value not-assigned'>
                                                    /{place.limits.creators}
                                                </span>
                                            </Col>
                                            <Col span={12}>
                                                <label>Max. Members</label>
                                                <span className='label-value power'>
                                                    {place.counters.key_holders}
                                                </span>
                                                <span className='label-value not-assigned'>
                                                    /{place.limits.key_holders}
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
                                                    /{place.limits.childs}
                                                </span>
                                            </Col>
                                        </Row>
                                    </div>
                                </Row>
                            </div>
                        </Col>
                        <Col span={8} className='modal-sidebar'>
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
                        </Col>
                    </Row>
                    {/* <Row type='flex' align='middle'>
                        <Col span={6}>
                            <PlaceView className='placemodal' avatar size={64} place={place}/>
                        </Col>
                        <Col span={18} className='Place-Des'>
                            <p>{place.name}
                                <br></br>
                                <span>{place._id}</span>
                            </p>
                        </Col>
                    </Row>
                    {this.state.isGrandPlace &&
                    <Row>
                        <Row>
                            <Col span={14}>
                                <label>Maximum Managers</label>
                            </Col>
                            <Col span={8}>
                                {place.limits.creators}
                            </Col>
                            <Col span={2}>
                                <Button type='toolkit nst-ico ic_pencil_solid_16'
                                        onClick={() => this.editField(EditableFields.creators)}></Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={14}>
                                <label>Maximum Members</label>
                            </Col>
                            <Col span={8}>
                                {place.limits.key_holders}
                            </Col>
                            <Col span={2}>
                                <Button type='toolkit nst-ico ic_pencil_solid_16'
                                        onClick={() => this.editField(EditableFields.key_holders)}></Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={14}>
                                <label>Storage Limit</label>
                            </Col>
                            <Col span={8}>
                                {place.limits.size === 0 && <span>Unlimited</span>}
                                {place.limits.size > 0 && <span>{this.convertSize(place.limits.size)} GB</span>}
                            </Col>
                            <Col span={2}>
                                <Button type='toolkit nst-ico ic_pencil_solid_16'
                                        onClick={() => this.editField(EditableFields.size)}></Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={14}>
                                <label>Maximum Children Limit</label>
                            </Col>
                            <Col span={8}>
                                {place.limits.childs}
                            </Col>
                            <Col span={2}>
                                <Button type='toolkit nst-ico ic_pencil_solid_16'
                                        onClick={() => this.editField(EditableFields.childs)}></Button>
                            </Col>
                        </Row>
                    </Row>
                    }
                    {lockedIcon &&
                    <Row type='flex' align='middle'>
                        <Col span={6}>
                            {lockedIcon}
                        </Col>
                        <Col span={18}>
                            {lockedTxt}
                        </Col>
                    </Row>}
                    {reciveIcon && <Row type='flex' align='middle'>
                        <Col span={6}>
                            {reciveIcon}
                        </Col>
                        <Col span={18}>
                            {reciveTxt}
                        </Col>
                    </Row>}
                    {searchableIcon && <Row type='flex' align='middle'>
                        <Col span={6}>
                            {searchableIcon}
                        </Col>
                        <Col span={18}>
                            {searchableTxt}
                        </Col>
                    </Row>}
                    {place.counters.childs > 0 &&
                    <div>
                        <Row className='devide-row'>
                            <Col span={24}>
                                {place.counters.childs} Sub-places
                            </Col>
                        </Row>
                        <Row className='remove-margin'>
                            <PlaceItem place={place} key={place._id}/>
                        </Row>
                    </div>
                    }
                    <Row className='devide-row'>
                        <Col span={24}>
                            {place.counters.creators + place.counters.key_holders} Members
                        </Col>
                    </Row>
                    <Row className='remove-margin'>
                        {this.state.members &&
                        this.state.members.map((item) => {
                            return (<UserItem user={item} onClick={() => this.onItemClick(item)}
                                              manager={this.isManager(item)} key={item._id}/>);
                        })}
                    </Row>
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
                    </Row> */}
                </Modal>
                }
            </div>
        );
    }

}
