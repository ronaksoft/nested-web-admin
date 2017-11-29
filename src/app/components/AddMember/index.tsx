import IUser from '../../api/account/interfaces/index';
import * as React from 'react';
import {
    Modal,
    Row,
    Col,
    Icon,
    Button,
    message,
    Form,
    Input,
    Select,
    notification,
    Upload
} from 'antd';

import _ from 'lodash';
import {IcoN} from '../icon/index';
import UserAvatar from '../avatar/index';

interface IProps {
    visible : boolean;
    members?: Array < IUser >;
    onClose?: () => {};
    addMembers : (members : Array < IUser >) => {};
}

interface IStates {
    visible : boolean;
    members : Array < IUser >;
    suggests : Array < IUser >;
    query : string;
}

export default class AddMemberModal extends React.Component < IProps,
IStates > {

    constructor(props : any) {
        super(props);
        this.state = {
            visible: false,
            members: [],
            suggests: [
                {
                    admin: true,
                    counters: {
                        client_keys: 3,
                        incorrect_attempts: 0,
                        logins: 289,
                        total_notifications: 470,
                        unread_notifications: 5
                    },
                    disabled: false,
                    dob: '1996-05-12',
                    email: 'ehsan@nested.me',
                    flags: {
                        force_password_change: false
                    },
                    fname: 'Ehsan',
                    gender: 'm',
                    joined_on: 1493369284776,
                    limits: {
                        client_keys: 10,
                        grand_places: 3
                    },
                    lname: 'Noureddin Moosa',
                    phone: '989121228718',
                    picture: {
                        org: 'IMG5A082F36F0704400015BD9DA5A082F36F0704400015BD9DB',
                        pre: 'THU5A082F36F0704400015BD9E05A082F36F0704400015BD9E1',
                        x128: 'THU5A082F36F0704400015BD9E35A082F36F0704400015BD9E4',
                        x32: 'THU5A082F36F0704400015BD9DD5A082F36F0704400015BD9DE',
                        x64: 'THU5A082F36F0704400015BD9E65A082F36F0704400015BD9E7'
                    },
                    privacy: {
                        change_picture: true,
                        change_profile: true,
                        searchable: true
                    },
                    searchable: true,
                    _id: 'ehsan'
                }
            ],
            query: ''
        };
    }

    updateSearchQuery(event : any) {
        this.setState({query: event.currentTarget.value});
    }

    componentWillReceiveProps(props : any) {
        this.setState({visible: props.visible});
    }

    getSuggests() {
        var list = this
            .state
            .suggests
            .map((u : IUser) => {
                return (
                    <li key={u.id + 'ss'}>
                        <Row type='flex' align='middle'>
                            <UserAvatar user={u} borderRadius={'16'} size={32} avatar></UserAvatar>
                            <div className='user-detail'>
                                <UserAvatar user={u} name size={22} className='uname'></UserAvatar>
                                <UserAvatar user={u} id size={18} className='uid'></UserAvatar>
                            </div>
                            <div className='add-button'>Add</div>
                        </Row>
                    </li>
                );
            });
        return (
            <ul>
                {list}
            </ul>
        );
    }

    handleCancel() {
        this.props.onClose();
    }

    addMembers() {
        console.log(arguments);
        this
            .props
            .addMembers(this.state.members);
    }

    render() {

        const modalFooter = (
            <div className='modal-foot'>
                <Button
                    type=' butn butn-green full-width'
                    onClick={this
                    .addMembers
                    .bind(this)}>add {this.state.members.length}
                    Members</Button>
            </div>
        );
        return (
            <Modal
                className='add-member-modal'
                maskClosable={true}
                width={480}
                onCancel={this
                .handleCancel
                .bind(this)}
                visible={this.state.visible}
                footer={modalFooter}
                title='Add Member'>
                <Row>
                    <Input
                        id='name'
                        size='large'
                        className='nst-input no-style'
                        value={this.state.query}
                        onChange={this
                        .updateSearchQuery
                        .bind(this)}
                        placeholder='Name or Username'/>
                </Row>
                <Row>
                    {this.getSuggests()}
                </Row>
            </Modal>
        );
    }

}
