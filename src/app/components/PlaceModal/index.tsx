import * as React from 'react';
import IPlace from '../../api/place/interfaces/IPlace';
import {Modal, Row, Col, Icon} from 'antd';
import PlaceView from './../placeview/index';

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
        console.log(this);
        const {place} = this.props;
        const iconStyle = {
            width: '16px',
            height: '16px',
            verticalAlign: 'middle'
        };
        let lockedIcon, lockedTxt, reciveIcon, reciveTxt, searchableIcon, seachabeTxt;

        if (place.privacy.locked === true) {
            lockedIcon = <Icon type=' nst-ico ic_brick_wall_solid_16' style={iconStyle}/>;
            lockedTxt = 'Private Place';
        } else {
            lockedIcon = <Icon type=' nst-ico ic_window_solid_16' style={iconStyle}/>;
            lockedTxt = 'Common Place';
        }

        if (place.privacy.search === true) {
            searchableIcon = <Icon type=' nst-ico ic_search_24' style={iconStyle}/>;
            seachabeTxt = 'This place shows in search results.';
        } else {
            searchableIcon = <Icon type=' nst-ico ic_non_search_24' style={iconStyle}/>;
            seachabeTxt = 'This place does’nt show in search results.';
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
                                { lockedIcon }
                                <PlaceView avatar size={64} place={place} />
                            </Col>
                            <Col span={18}>
                                <PlaceView id name size={64} place={place} />
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
                        <Row className='devide-row'>
                            <Col span={24}>
                                9 Sub-places
                            </Col>
                        </Row>
                        <Row>
                            {/*<PlaceItem place={place} key={place._id} />*/}
                        </Row>
                        <Row className='devide-row'>
                            <Col span={24}>
                                424 Members
                            </Col>
                        </Row>
                        <Row>
                            {/*<UserItem place={place} key={place._id} />*/}
                        </Row>
                    </Modal>
                }
            </div>
        );
    }

}
