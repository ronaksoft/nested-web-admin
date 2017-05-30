import * as React from 'react';
import PlaceApi from '../../api/place/index';
import IPlace from '../../api/place/interfaces/IPlace';
import {Modal, Row, Col, Icon, Button, message} from 'antd';
import PlaceView from './../placeview/index';
import Avatar from './../avatar/index';
import PlaceItem from '../PlaceItem/index';
import UserItem from '../UserItem/index';
import AccountApi from '../../api/account/account';
import _ from 'lodash';
import View from '../../scenes/Accounts/components/View/index';
import IUser from '../../api/account/interfaces/IUser';
import AAA from '../../services/classes/aaa/index';


interface IProps {
    place?: IPlace;
    visible?: boolean;
    onClose?: any;
}

interface IStates {
    visible: boolean;
    place?: IPlace;
    members?: any;
    chosen ?: IUser;
    viewAccount: boolean;
    creators: Array<string>;
}


export default class PlaceModal extends React.Component<IProps, IStates> {
    currentUser: IUser;

    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            place: null,
            members: [],
            viewAccount: false,
            creators: this.props.place.creators,
        };
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
        if (this.props.place) {
            this.setState({
                place: this.props.place,
                creators: this.props.place.creators,
                visible: this.props.visible,
            });
        }
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

    render() {
        const {place} = this.props;
        const iconStyle = {
            width: '16px',
            height: '16px',
            verticalAlign: 'middle'
        };
        let lockedIcon, lockedTxt, reciveIcon, reciveTxt, searchableIcon, searchableTxt;

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
        return (
            <div>
                {
                    this.state.viewAccount &&
                    <View account={this.state.chosen} visible={this.state.viewAccount} onChange={this.handleChange.bind(this)}
                          onClose={this.onCloseView}/>
                }
                {place &&
                <Modal className='place-modal nst-modal'
                       maskClosable={true}
                       width={480}
                       closable={true}
                       onCancel={this.handleCancel.bind(this) }
                       visible={this.state.visible}
                       footer={null}
                       title='Place Info'>
                    <Row type='flex' align='middle'>
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
                    {lockedIcon && <Row type='flex' align='middle'>
                        <Col span={6}>
                            { lockedIcon }
                        </Col>
                        <Col span={18}>
                            { lockedTxt }
                        </Col>
                    </Row>}
                    { reciveIcon && <Row type='flex' align='middle'>
                        <Col span={6}>
                            { reciveIcon }
                        </Col>
                        <Col span={18}>
                            { reciveTxt }
                        </Col>
                    </Row>}
                    {searchableIcon && <Row type='flex' align='middle'>
                        <Col span={6}>
                            { searchableIcon }
                        </Col>
                        <Col span={18}>
                            { searchableTxt }
                        </Col>
                    </Row>}
                    {!this.isManager(this.currentUser) && place.type !== 'personal' &&
                    <Row>
                        <Col>
                            <Button onClick={this.addAsManager.bind(this)}>Add you as a Manager</Button>
                        </Col>
                    </Row>
                    }
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
                                              manager={this.isManager(item) } key={item._id}/>);
                        }) }
                    </Row>
                </Modal>
                }
            </div>
        );
    }

}
