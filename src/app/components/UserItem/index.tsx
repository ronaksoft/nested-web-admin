import * as React from 'react';
import {Row, Col, Icon} from 'antd';
import IUser from '../../api/account/interfaces/IUser';
import UserAvatar from '../avatar/index';

function UserItem(props: any) {
    const iconStyle = {
        width: '16px',
        height: '16px',
        verticalAlign: 'middle'
    };
    return (
        <Row className='user-row' type='flex' align='middle' onClick={() => {
            if (typeof props.onClick === 'function') {
                props.onClick();
            }
        }}>
            <Col span={3}>
                <UserAvatar user={props.user} borderRadius={16} place={props.user} size={32} avatar></UserAvatar>
            </Col>
            <Col span={15}>
                <p>
                    {props.user.name}
                </p>
                <span>{props.user._id}</span>
            </Col>
            <Col span={6}>
                {props.manager &&
                <aside>Manager</aside>
                }
            </Col>
        </Row>
    );
}

export default UserItem;
