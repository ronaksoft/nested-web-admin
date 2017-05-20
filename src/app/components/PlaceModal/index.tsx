import * as React from 'react';
import IPlace from '../../api/place/interfaces/IPlace';
import {Modal, Row, Col, Icon} from 'antd';
import PlaceView from './../placeview/index';
import PlaceItem from '../PlaceItem/index';
import UserItem from '../UserItem/index';
import AccountApi from '../../api/account/account';
import _ from 'lodash';

interface IProps {
    place?: IPlace;
    visible?: boolean;
    onClose?: any;
}

interface IStates {
    visible: boolean;
    place?: IPlace;
}


export default class PlaceModal extends React.Component<IProps, IStates> {

    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            place : null
        };
    }

    componentWillReceiveProps(props: any) {
        this.setState({
            place: props.place,
            visible: props.visible,
        });
    }

    componentDidMount() {
        if (this.props.place) {
            this.setState({
                place: this.props.place,
                visible: this.props.visible,
            });
        }
        this.AccountApi = new AccountApi();
        this.loadPlaces(this.props.place._id);
    }

    loadPlaces(placeId: string) {


        this.AccountApi.getMembers({
            place_id: placeId
        }).then((result) => {
            console.log(result.accounts);
        this.setState({
            members: result.accounts,
            loading: false
        });
        }).catch((error) => {
            console.log('error', error);
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
            searchableTxt = 'This place does’nt show in search results.';
        }

        if (place.privacy.receptive === 'external') {
            reciveIcon = <Icon type=' nst-ico ic_earth_solid_24' style={iconStyle}/>;
            reciveTxt = '..';
        } else {
            reciveIcon = <Icon type=' nst-ico ic_manager_solid_24' style={iconStyle}/>;
            reciveTxt = '...';
        }
        return (
            <div>
                {place &&
                    <Modal className='place-modal nst-modal'
                        closable={true}
                        onCancel={this.handleCancel.bind(this) }
                        visible = {this.state.visible}
                        footer={null}
                        title = 'Place Info'>
                        <Row type='flex' align='middle'>
                            <Col span={6}> 
                                <PlaceView avatar size={64} place={place} />
                            </Col>
                            <Col span={18} className='Place-Des'>
                                <p>{place.name}
                                    <br></br>
                                    <span>{place._id}</span>
                                </p>
                            </Col>
                        </Row>
                        <Row type='flex' align='middle'>
                            <Col span={6}>
                                { lockedIcon }
                            </Col>
                            <Col span={18}>
                                { lockedTxt }
                            </Col>
                        </Row>
                        <Row type='flex' align='middle'>
                            <Col span={6}>
                                { reciveIcon }
                            </Col>
                            <Col span={18}>
                                { reciveTxt }
                            </Col>
                        </Row>
                        <Row type='flex' align='middle'>
                            <Col span={6}>
                                { searchableIcon }
                            </Col>
                            <Col span={18}>
                                { searchableTxt }
                            </Col>
                        </Row>
                        <Row className='devide-row'>
                            <Col span={24}>
                                {place.counters.childs} Sub-places
                            </Col>
                        </Row>
                        <Row className='remove-margin'>
                            <PlaceItem place={place} key={place._id} />
                        </Row>
                        <Row className='devide-row'>
                            <Col span={24}>
                                {place.counters.creators + place.counters.key_holders} Members
                            </Col>
                        </Row>
                        <Row>
                            {_(this.state.members).map((item) => <UserItem user={item} key={item._id} />)}
                        </Row>
                    </Modal>
                }
            </div>
        );
    }

}
