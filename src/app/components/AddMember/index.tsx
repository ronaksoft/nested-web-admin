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
import AccountApi from '../../api/account/account';

interface IProps {
    visible: boolean;
    onClose?: () => {};
    addMembers: (members: Array<IUser>) => {};
    members?: Array<IUser>;
}

interface IStates {
    visible: boolean;
    members: Array<IUser>;
    suggests: Array<IUser>;
    selectedUsers: Array<IUser>;
    query: string;
}

export default class AddMemberModal extends React.Component <IProps, IStates> {
    accountApi: any;
    searchIt: any;
    constructor(props: any) {
        super(props);
        this.searchIt = _.debounce(this.searchAccounts, 512);
        this.state = {
            visible: false,
            members: this.props.members || [],
            suggests: [],
            selectedUsers: [],
            query: ''
        };
    }

    componentDidMount() {
        this.accountApi = new AccountApi();
        this.searchAccounts('');
    }

    updateSuggestions(users?: IUser[]) {
        if (users === undefined) {
            users = this.state.suggests;
        }
        let list = _.differenceBy(users, this.state.selectedUsers, '_id');
        list = _.differenceBy(list, this.state.members, '_id');
        this.setState({
            suggests: list,
        });
    }

    searchAccounts(keyword: string) {
        this.accountApi.search(keyword, 10).then((data) => {
            this.updateSuggestions(data.accounts);
        });
    }

    updateSearchQuery(event: any) {
        var keyword = event.currentTarget.value;
        this.setState({
            query: keyword,
        }, () => {
            this.searchIt(keyword);
        });
    }

    componentWillReceiveProps(props: any) {
        this.setState({
            visible: props.visible,
            members: props.members,
        });
    }

    addThisMember(user: IUser) {
        const selectedUsers = this.state.selectedUsers;
        const index = _.findIndex(selectedUsers, {
            _id: user._id,
        });
        if (index === -1) {
            selectedUsers.push(user);
            this.setState({
                selectedUsers: selectedUsers,
            }, () => {
                this.updateSuggestions();
            });
        }
    }

    removeThisMember(user: any) {
        if (_.isObject(user)) {
            user = user._id;
        }
        const users = this.state.selectedUsers;
        const index = _.findIndex(users, {
            _id: user,
        });
        if (index > -1) {
            users.splice(index, 1);
            this.setState({
                selectedUsers: users,
            }, () => {
                this.searchAccounts(this.state.query);
            });
        }
    }

    getSuggests() {
        var list = this
            .state
            .suggests
            .map((u: IUser) => {
                return (
                    <li key={u._id + 'ss'}>
                        <Row type='flex' align='middle'>
                            <UserAvatar user={u} borderRadius={'16'} size={32} avatar></UserAvatar>
                            <div className='user-detail'>
                                <UserAvatar user={u} name size={22} className='uname'></UserAvatar>
                                <UserAvatar user={u} id size={18} className='uid'></UserAvatar>
                            </div>
                            <div className='add-button' onClick={this.addThisMember.bind(this, u)}>Add</div>
                        </Row>
                    </li>
                );
            });
        return (
            <ul className='suggests'>
                {list}
            </ul>
        );
    }

    getSelectedUsers() {
        var list = this
            .state
            .selectedUsers
            .map((u: IUser) => {
                return (
                    <li key={u._id} onClick={this.removeThisMember.bind(this, u)}>
                        <Row type='flex' align='middle'>
                            <UserAvatar user={u} borderRadius={'16'} size={24} avatar></UserAvatar>
                            <UserAvatar user={u} name size={22} className='uname'></UserAvatar>
                        </Row>
                    </li>
                );
            });
        return (
            <ul className='selecteds'>
                {list}
            </ul>
        );
    }

    handleCancel() {
        this.props.onClose();
    }

    addMembers() {
        this.props.addMembers(_.clone(this.state.selectedUsers));
        this.props.onClose();
        this.setState({
            selectedUsers: [],
        });
    }

    render() {

        const modalFooter = (
            <div className='modal-foot'>
                <Button
                    type=' butn butn-green full-width'
                    onClick={this.addMembers.bind(this)}>add {this.state.selectedUsers.length} Members</Button>
            </div>
        );
        return (
            <Modal
                className='add-member-modal'
                maskClosable={true}
                width={480}
                onCancel={this.handleCancel.bind(this)}
                visible={this.state.visible}
                footer={modalFooter}
                title='Add Member'>
                <Row className='input-area' type='flex'>
                    {this.getSelectedUsers()}
                    <Input
                        id='name'
                        size='large'
                        autoComplete={'off'}
                        className='nst-input no-style'
                        value={this.state.query}
                        onChange={this.updateSearchQuery.bind(this)}
                        placeholder='Name or Username'/>
                </Row>
                <Row>
                    {this.getSuggests()}
                </Row>
            </Modal>
        );
    }

}
