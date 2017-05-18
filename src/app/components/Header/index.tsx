import * as React from 'react';
import _ from 'lodash';
import { Input, Row, Col, Button, AutoComplete, Icon, notification } from 'antd';
import UserAvatar from './../avatar/index';
import AAA from './../../services/classes/aaa/index';
import AccountApi from '../../api/account/account';
import PlaceApi from '../../api/place/index';
// import PlaceItem from '../../scenes/Accounts/components/View/components/PlaceItem';
// import UserItem from '../../scenes/Accounts/components/View/components/PlaceItem';

const Search = Input.Search;


interface IHeaderProps { };

interface IHeaderState { };

class Header extends React.Component<IHeaderProps, IHeaderState> {

    constructor(props: any) {
        super(props);

        this.state = {
            result: []
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

    handleSelect(value: any, option: any) {
        console.log(value, option);
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
                        <Option key={group.key + '_' + item._id} value={item._id}>
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

                    <AutoComplete
                                size='large'
                                style={{ width: '100%' }}
                                dataSource={suggestedOptions}
                                onSearch={this.search}
                                onSelect={this.handleSelect}
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
