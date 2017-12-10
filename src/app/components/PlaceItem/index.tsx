import * as React from 'react';
import {Row, Col, Icon} from 'antd';
import IPlace from '../../api/place/interfaces/IPlace';
import PlaceView from '../placeview/index';

function PlaceItem(props: any) {
    const iconStyle = {
        width: '16px',
        height: '16px',
        verticalAlign: 'middle'
    };

    return (
        <Row className='place-row' type='flex' align='middle' onClick={() => {
            if (props.onClick) {
                props.onClick(props.place);
            }
        }}>
            <PlaceView borderRadius={4} place={props.place} size={32} avatar></PlaceView>
            <Row type='flex' className='place-name-id'>
                <p>
                    {props.place.privacy.locked &&
                    <Icon type=' nst-ico ic_brick_wall_solid_16' style={iconStyle}/>
                    }
                    {!props.place.privacy.locked &&
                    <Icon type=' nst-ico ic_window_solid_16' style={iconStyle}/>
                    }
                    {props.place.name}
                </p>
                <span>{props.place._id}</span>
            </Row>
            <aside>{props.place.counters.creators + props.place.counters.key_holders} Members</aside>
        </Row>
    );
}

export default PlaceItem;
