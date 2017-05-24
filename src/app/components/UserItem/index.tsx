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
        <Row className='user-row remove-margin' type='flex' align='middle' onClick={() => {
            if (typeof props.onClick === 'function') {
                props.onClick();
            }
        }}>
            <Col span={4}>
                <UserAvatar user={props.user} borderRadius={16} place={props.user} size={32} avatar></UserAvatar>
            </Col>
            <Col className='user-row-inner' span={20}>
                <Row type='flex' align='middle'>
                    <Col span={16}>
                        <p>
                            {props.user.name}
                        </p>
                        <span>{props.user._id}</span>
                    </Col>
                    <Col span={8}>
                        {props.manager &&
                        <aside>Manager
                            <Icon type=' nst-ico ic_crown_shine_24'></Icon>
                        </aside>
                        }
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default UserItem;
