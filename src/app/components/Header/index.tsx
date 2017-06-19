import * as React from 'react';
import _ from 'lodash';
import {Input, Row, Col, Button, AutoComplete, Icon, notification} from 'antd';
import UserAvatar from './../avatar/index';
import AAA from './../../services/classes/aaa/index';
import AccountApi from '../../api/account/account';
import PlaceApi from '../../api/place/index';
import PlaceModal from '../../components/PlaceModal/index';
import UserModal from '../../scenes/Accounts/components/View/index';
import IAccount from '../../scenes/Accounts/interfaces';
import {browserHistory} from 'react-router';
// import PlaceItem from '../../scenes/Accounts/components/View/components/PlaceItem';
// import UserItem from '../../scenes/Accounts/components/View/components/PlaceItem';

const Group = AutoComplete.OptGroup;
const Option = AutoComplete.Option;

interface IHeaderProps {
};

interface IHeaderState {
    showPlaceModal: boolean;
    showUserModal: boolean;
};

class Header extends React.Component<IHeaderProps, IHeaderState> {
    keyword: string = '';
    selectedPlace: any;
    selectedUser: any;
    loggedUser: any;

    constructor(props: any) {
        super(props);

        this.state = {
            result: [],
            showPlaceModal: false,
        };

        this.search = _.debounce(this.search.bind(this), 256);
        this.handleAccountChange = this.handleAccountChange.bind(this);
        this.loggedUser = AAA.getInstance().getUser();
    }

    componentDidMount() {
        this.accountApi = new AccountApi();
        this.placeApi = new PlaceApi();
    }

    search(keyword: string) {
        this.keyword = keyword;
        const getAccountPromise = this.accountApi.getAll({
            limit: 5,
            keyword: keyword
        });

        const getPlacePromise = this.placeApi.placeList({
            limit: 5,
            keyword: keyword
        });

        Promise.all([getAccountPromise, getPlacePromise])
            .then((resultSet) => {
                const result = [];
                result[0] = {
                    key: 'accounts',
                    title: 'Aaccounts',
                    items: resultSet[0].accounts
                };
                result[1] = {
                    key: 'places',
                    title: 'Places',
                    items: resultSet[1]
                };

                this.setState({
                    result: result
                });
            }, (error) => {
                notification.error({
                    message: 'Error',
                    description: 'We are not able to search right now!'
                });
            });
    }

    signOut() {
        let aaa = AAA.getInstance();
        let accountApi = new AccountApi();
        accountApi.signout()
            .then(() => {
                aaa.setIsUnAthenticated();
                browserHistory.push('/signin');
            });
    }

    handleSelect(value: string, option: any) {
        const group = value.split('___')[0];
        const key = value.split('___')[1];

        if (group === 'accounts') {
            this.selectedUser = _.find(this.state.result[0].items, {_id: key});
            this.setState({
                showUserModal: true,
            });
        }

        if (group === 'places') {
            this.selectedPlace = _.find(this.state.result[1].items, {_id: key});
            this.setState({
                showPlaceModal: true,
            });
        }
    }

    closePlaceModal() {
        this.setState({
            showPlaceModal: false,
        });
    }


    closeUserModal() {
        this.setState({
            showUserModal: false,
        });
    }

    handleAccountChange(account: IAccount) {
        this.selectedUser = account;
        const result = _.cloneDeep(this.state.result);
        const index = _.findIndex(result[0].items, {_id: account._id});
        if (index > -1) {
            result[0].items.splice(index, 1, account);
            this.setState({
                result: result
            });
        }
    }

    render() {

        let suggestedOptions = this.state.result.map((group) => {
                return (
                    <Group
                        key={group.key}
                        label={group.title}
                    >
                        {
                            group.items.map((item) =>
                                <Option key={group.key + '_' + item._id} value={group.key + '___' + item._id}>
                                    {item._id}
                                </Option>)
                        }
                    </Group>
                );
            }
        );


        if (this.state.result.length !== 0 &&
            this.state.result[0].items.length === 0 &&
            this.state.result[1].items.length === 0) {
            suggestedOptions.push(
                <Option key={'no-result-item'} disable={true} value={this.keyword}>
                    No Result for "{this.keyword}"!!
                </Option>
            );
        }

        return (
            <header className='header'>
                <Row>
                    <Col span={10}>
                        {this.state.showPlaceModal &&
                        <PlaceModal visible={this.state.showPlaceModal} place={this.selectedPlace}
                                    onClose={this.closePlaceModal.bind(this)}/>
                        }
                        {this.state.showUserModal &&
                        <UserModal visible={this.state.showUserModal} account={this.selectedUser}
                                   onClose={this.closeUserModal.bind(this)} onChange={this.handleAccountChange}/>
                        }
                        <AutoComplete
                            allowClear={true}
                            size='large'
                            style={{width: '100%'}}
                            dataSource={suggestedOptions}
                            onSearch={this.search}
                            onSelect={this.handleSelect.bind(this)}
                        >
                            <Input
                                placeholder='Search here...'
                                size='large'
                                prefix={<Icon type='search' className='certain-category-icon'/>}
                            />
                        </AutoComplete>
                    </Col>
                    <Col span={14}>
                        <Row type='flex' justify='end'>
                            <Col>
                                {/*<Button type='toolkit nst-ico ic_open_message_solid_24'*/}
                                {/*shape='circle'*/}
                                {/*icon='notification'></Button>*/}
                                {/*<Button type='toolkit nst-ico ic_bell_solid_24'*/}
                                {/*shape='circle'*/}
                                {/*icon='notification'></Button>*/}
                                {/*<Button type='toolkit nst-ico ic_gear_solid_-1' shape='circle'></Button>*/}
                                {/*<Button type='toolkit nst-ico ic_lock_solid_24' shape='circle' icon='setting'></Button>*/}
                                <Button type='toolkit nst-ico ic_logout_solid_24' icon='signout' onClick={() => {
                                    this.signOut();
                                }}
                                        shape='circle'></Button>
                                <Button type='toolkit-user' shape='circle' className='oddcondi'>

                                    <UserAvatar size={24} user={this.loggedUser} avatar/>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </header>
        );
    }
}

export default Header;
