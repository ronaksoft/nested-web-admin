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
import C_USER_SEARCH_AREA from '../../api/consts/CUserSearchArea';

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
    hasMore: boolean;
}

export default class AddMemberModal extends React.Component <IProps, IStates> {
    accountApi: any;
    searchIt: any;
    searchSetting: any;
    constructor(props: any) {
        super(props);
        this.searchIt = _.debounce(this.searchAccounts, 512);
        this.state = {
            visible: false,
            members: this.props.members || [],
            suggests: [],
            selectedUsers: [],
            query: '',
            hasMore: false,
        };
        this.searchSetting = {
            skip: 0,
            limit: 10,
            keyword: '',
        };
    }

    componentDidMount() {
        this.accountApi = new AccountApi();
        this.searchAccounts('');
    }

    updateSuggestions(users?: IUser[], callback?: any) {
        if (users === undefined) {
            users = this.state.suggests;
        }
        let list = _.differenceBy(users, this.state.selectedUsers, '_id');
        list = _.differenceBy(list, this.state.members, '_id');
        list = _.uniqBy(list, '_id');
        if (_.isFunction(callback)) {
            callback(list);
        }
        this.setState({
            suggests: list,
        });
    }

    fullFillList(accounts: any[], list: any[]) {
        if (accounts.length >= this.searchSetting.limit) {
            this.setState({
                hasMore: true,
            });
            if (list.length === 0) {
                this.loadEvenMore();
            }
        } else {
            this.setState({
                hasMore: false,
            });
        }
    }

    loadEvenMore() {
        this.searchSetting.skip += this.searchSetting.limit;
        this.accountApi.search(this.searchSetting.keyword, this.searchSetting.limit, C_USER_SEARCH_AREA.ADMIN, this.searchSetting.skip).then((data: any) => {
            this.updateSuggestions(this.state.suggests.concat(data.accounts), (list: any) => {
                this.fullFillList(data.accounts, list);
            });
        });
    }

    searchAccounts(keyword: string) {
        this.searchSetting.skip = 0;
        this.accountApi.search(keyword, this.searchSetting.limit, C_USER_SEARCH_AREA.ADMIN, this.searchSetting.skip).then((data) => {
            this.searchSetting.keyword = keyword;
            this.updateSuggestions(data.accounts, (list: any) => {
                this.fullFillList(data.accounts, list);
            });
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
                this.updateSuggestions(this.state.suggests);
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
                            <div className='add-button _cp' onClick={this.addThisMember.bind(this, u)}>Add</div>
                        </Row>
                    </li>
                );
            });
        return (
            <ul className='suggests'>
                {list}
                <li key={'add_member_load_more'}>
                    <Button className='butn butn-white full-width' onClick={this.loadEvenMore.bind(this)}>
                        Load More...
                    </Button>
                </li>
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
        this.props.addMembers(_.merge(_.clone(this.state.selectedUsers), {
            admin: false,
        }));
        this.props.onClose();
        this.setState({
            selectedUsers: [],
            query: '',
        });
        this.searchAccounts('');
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
