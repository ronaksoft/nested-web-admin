import * as React from 'react';
import {Row, Col} from 'antd';
import {IPlace} from '../../../../../Places/IPlace';
import {PlaceView} from '../../../../../../components/placeview/index';

function PlaceItem(props: any) {
  return (
    <Row className='place-row' type='flex' align='middle'>
      <Col span={24}>
        {/*<PlaceView borderRadius={4} place={props.place} size={32} avatar name id></PlaceView>*/}
      </Col>
    </Row>
  );
}

export default PlaceItem;
