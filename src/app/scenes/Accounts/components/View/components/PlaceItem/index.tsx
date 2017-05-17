import * as React from 'react';
import {Row, Col} from 'antd';
import {IPlace} from '../../../../../Places/IPlace';

function PlaceItem(props: any) {
  return (
    <Row>
      <Col span={24}>
        {props.place.name}
      </Col>
    </Row>
  );
}

export default PlaceItem;
