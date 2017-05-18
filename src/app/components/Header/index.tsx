import * as React from 'react';
import _ from 'lodash';
import { Input, Row, Col, Button, AutoComplete, Icon, notification } from 'antd';
import UserAvatar from './../avatar/index';
import AAA from './../../services/classes/aaa/index';
import AccountApi from '../../api/account/account';
import PlaceApi from '../../api/place/index';
import PlaceModal from '../../components/PlaceModal/index';
import UserModal from '../../scenes/Accounts/components/View/index';
// import PlaceItem from '../../scenes/Accounts/components/View/components/PlaceItem';
// import UserItem from '../../scenes/Accounts/components/View/components/PlaceItem';

const Search = Input.Search;


interface IHeaderProps { };

interface IHeaderState {
    showPlaceModal: boolean;
    showUserModal: boolean;
};

class Header extends React.Component<IHeaderProps, IHeaderState> {

    selectedPlace: any;
    selectedUser: any;

    constructor(props: any) {
        super(props);

        this.state = {
            result: [],
            showPlaceModal: false,
        };

        this.search = _.debounce(this.search.bind(this), 256);
    }

    componentDidMount() {
        this.accountApi = new AccountApi();
        this.placeApi = new PlaceApi();
    }

    search(keyword: string) {
        const getAccountPromise = this.accountApi.getAll({
            limit: 5,
            keyword: keyword
        });

        const getPlacePromise = this.placeApi.placeList({
            limit: 5,
            keyword: keyword
        });

        Promise.all([getAccountPromise, getPlacePromise]).then((resultSet) => {
            console.log('resultSet', resultSet);
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

    handleSelect(value: string, option: any) {
        const group = value.split('___')[0];
        const key = value.split('___')[1];

        if (group === 'accounts') {
            this.selectedUser = _.find(this.state.result[0].items, { _id: key });
            console.log(this.selectedUser);
            this.setState({
                showUserModal: true,
            });
        }

        if (group === 'places') {
            this.selectedPlace = _.find(this.state.result[1].items, { _id: key });
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

    render() {
        let loggedUser = AAA.getInstance().getUser();
        const Group = AutoComplete.OptGroup;
        const Option = AutoComplete.Option;

        const suggestedOptions = this.state.result.map((group) => {
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

        return (
            <header className='header'>
                <Row>
                    <Col span={10}>
                        {this.state.showPlaceModal &&
                            <PlaceModal visible={this.state.showPlaceModal} place={this.selectedPlace} onClose={this.closePlaceModal.bind(this) }/>
                        }
                        {this.state.showUserModal &&
                            <UserModal visible={this.state.showUserModal} account={this.selectedUser} onClose={this.closeUserModal.bind(this) }/>
                        }
                        <AutoComplete
                            size='large'
                            style={{ width: '100%' }}
                            dataSource={suggestedOptions}
                            onSearch={this.search}
                            onSelect={this.handleSelect.bind(this) }
                            optionLabelProp='_id'
                            >
                            <Input
                                placeholder='Search here...'
                                size='large'
                                prefix={<Icon type='search' className='certain-category-icon' />}
                                />
                        </AutoComplete>
                    </Col>
                    <Col span={14}>
                        <Row type='flex' justify='end'>
                            <Col>
                                <Button type='toolkit nst-ico ic_open_message_solid_24' shape='circle' icon='notification'></Button>
                                <Button type='toolkit nst-ico ic_bell_solid_24' shape='circle' icon='notification'></Button>
                                <Button type='toolkit nst-ico ic_gear_solid_-1' shape='circle' icon='logout'></Button>
                                <Button type='toolkit nst-ico ic_lock_solid_24' shape='circle' icon='setting'></Button>
                                <Button type='toolkit nst-ico ic_logout_solid_24' shape='circle' icon='lock'></Button>
                                <Button type='toolkit-user' shape='circle' className='oddcondi'>
                                    <UserAvatar size={24} user={loggedUser} avatar/>
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
