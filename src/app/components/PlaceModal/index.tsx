import * as React from 'react';
import IPlace from '../../api/place/interfaces/IPlace';
import {Modal, Row, Col} from 'antd';
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
            visible: false
        };
    }

    componentWillReceiveProps(props: IProps) {
        if (props.place) {
            this.setState({
                place: props.place,
                visible: props.visible,
            });
        }
    }

    handleCancel() {
        if (this.props.onClose && typeof this.props.onClose === 'function') {
            this.props.onClose();
        }
    }

    render() {
        const {place} = this.state;
        return (
            <div>
                {this.state.place &&
                    <Modal
                        closable={true}
                        onCancel={this.handleCancel.bind(this) }
                        visible = {this.state.visible}
                        footer={null}
                        title = 'Place Info'>
                        <Row>
                            <Col>
                                {place.name}
                            </Col>
                        </Row>
                    </Modal>
                }
            </div>
        );
    }

}
