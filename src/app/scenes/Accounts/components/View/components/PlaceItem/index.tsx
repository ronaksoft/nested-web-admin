import * as React from 'react';
import {Row, Col} from 'antd';
import {IPlace} from '../../../../../Places/IPlace';
import {PlaceView} from '../../../../../../components/placeview/index';

function PlaceItem(props: any) {
  return (
    <Row className='place-row' type='flex' align='middle'>
      <Col span={24}>
        {props.place.name}
      </Col>
    </Row>
  );
}

export default PlaceItem;
