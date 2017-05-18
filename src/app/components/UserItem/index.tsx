import * as React from 'react';
import {Row, Col, Icon} from 'antd';
import IUser from '../../api/account/interfaces/IUser';
import PlaceView from '../placeview/index';

function UserItem(props: any) {
  const iconStyle = {
    width: '16px',
    height: '16px',
    verticalAlign: 'middle'
  };
  console.log(props.place);
  return (
    <Row className='place-row' type='flex' align='middle'>
      <Col span={3}>
        <PlaceView borderRadius={4} place={props.place} size={32} avatar></PlaceView>
      </Col>
      <Col span={15}>
        <p>
          <Icon type=' nst-ico ic_brick_wall_solid_16' style={iconStyle}/>
          <Icon type=' nst-ico ic_window_solid_16' style={iconStyle}/>
          {props.place.name}
        </p>
        <span>{props.place._id}</span>
      </Col>
      <Col span={6}>
        <aside>{22} Members</aside>
      </Col>
    </Row>
  );
}

export default UserItem;
