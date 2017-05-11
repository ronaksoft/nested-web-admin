import * as React from 'react';
import {Icon, Table, Dropdown, Card, Menu, Checkbox, Popover, Button} from 'antd';
import Account from '/src/app/common/account/Account';
import {IAccount} from '/src/app/common/account/IAccount';
import IUnique from '/src/app/common/IUnique';
import Person from '/src/app/common/user/Person';
import _ from 'lodash';
import AccountApi from '../../../../api/account/account';
import moment from 'moment';
import UserAvatar from '/src/app/components/avatar/index';


interface IListProps { }

interface IListState {
  users: Person[];
}

class List extends React.Component<IListProps, IListState> {

  const dataColumns = {
    'name': 'Name',
    '_id': 'User ID',
    'access_places': 'Member in Place',
    'joined_on': 'Joined Date',
    'phone': 'Phone',
    'gender': 'Gender',
    'dob': 'Date of Birth',
    'privacy.searchable': 'Searchable',
    'registered': 'Status'
  };

  const genders = {
    'o': 'Other',
    'f': 'Female',
    'm': 'Male'
  };

 // columns Render Handlers

  nameRender = (text, user, index) => <UserAvatar avatar={true} name={true} size='24' user={user} />;
  idRender = (text, user, index) => text;
  placesRender = (text, user, index) => user.access_places ? user.access_places.length : '-';
  joinedRender = (text, user, index) => {
    const value = moment(user.joined_on, 'YYYY-MM-DD');
    if (value.isValid()) {
      return value.format('YYYY[/]MM[/]DD HH:mm A');
    } else {
      return '-';
    }
  }
  phoneRender = (text, user, index) => text;
  genderRender = (text, user, index) => {
    return this.genders[user.gender] || '-';
  }
  optionsRender = () => {
    const optionsMenu = (
      <Menu>
        <Menu.Item key='0'>
          <Icon type='check' /> Enable
        </Menu.Item>
        <Menu.Item key='1'>
          <Icon type='close' /> Disable
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key='2'>
          <Icon type='arrow-up' /> Promote
        </Menu.Item>
        <Menu.Item key='3'>
          <Icon type='arrow-down' /> Demote
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key='4'>
          <Icon type='lock' />Set Password
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={optionsMenu} trigger={['click']}>
        <a className='ant-dropdown-link' href='#'>
          <Icon type='ellipsis' />
        </a>
      </Dropdown>
    );
  }

 onColumnCheckChange = (item) => {
   item.checked = !item.checked;
   this.setState({
     dataColumns: this.replaceByKey(this.state.dataColumns, item)
   });
   if (item.checked) {
     this.insertColumn(item.key);
   } else {
     this.removeColumn(item.key);
   }
 }

 insertColumn = (key) => {
   var column = _.find(this.allColumns, { key: key });
   if (!column) {
     return;
   }
   console.log(`${this.state.columns.length - 2} > ${column.index}`);
   var index = (_.lastIndexOf(this.state.columns) - 1) > column.index
     ? column.index
     : _.lastIndexOf(this.state.columns);
   this.state.columns.splice(index, 0, column);
   this.setState({
     columns: this.state.columns
   });
 }

 removeColumn = (key) => {
   this.setState({
     columns: _.reject(this.state.columns, { key: key })
   });
 }

  constructor(props: IListProps) {

    this.allColumns = [
      {
        title: this.dataColumns.name,
        dataIndex: 'name',
        key: 'name',
        width: 192,
        fixed: 'left',
        render: this.nameRender,
        index: 0,
      },
      {
        title: this.dataColumns._id,
        dataIndex: '_id',
        key: '_id',
        width: 128,
        fixed: 'left',
        render: this.idRender,
        index: 1,
      },
      {
        title: this.dataColumns.access_places,
        dataIndex: 'access_places',
        key: 'access_places',
        width: 192,
        render: this.placesRenderHandler,
        index: 2,
      },
      {
        title: this.dataColumns.joined_on,
        dataIndex: 'joined_on',
        key: 'joined_on',
        width: 128,
        render: this.joinedRender,
        index: 3,
      },
      {
        title: this.dataColumns.phone,
        dataIndex: 'phone',
        key: 'phone',
        width: 128,
        render: this.phoneRender,
        index: 4,
      },
      {
        title: this.dataColumns.gender,
        dataIndex: 'gender',
        key: 'gender',
        width: 72,
        render: this.genderRender,
        index: 5,
      }
    ];

    this.state = {
      users: [],
      columns: _.take(this.allColumns, 5),
      dataColumns: []
    };

    this.state.dataColumns = _.map(this.dataColumns, (value, key) => {
      return {
        key: key,
        title: value,
        checked: _.some(this.state.columns, { key : key })
      };
    });

    this.optionsPopover = (
      <ul>
       {
         _.map(this.state.dataColumns, (item) =>
           <li key={item.key}>
             <Checkbox onChange={() => this.onColumnCheckChange(item)} checked={item.checked}>{item.title}</Checkbox>
           </li>
        )
       }
      </ul>
    );

    this.optionsTitle = (
      <Popover content={this.optionsPopover} placement='bottom'>
        <Icon type='setting' />
      </Popover>
   );

   this.state.columns.push({
     title: this.optionsTitle,
     dataIndex: 'options',
     key: 'options',
     fixed: 'right',
     width: 64,
     render: this.optionsRender
   });

  }

  componentDidMount() {
    let accountApi = new AccountApi();
    accountApi.accountList().then((accounts: IUser[]) => {
      this.setState({
        users: accounts
      });
    });
  }


  render() {

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange
    };

    return (
      <Card>
        <Table
              rowKey='_id'
              rowSelection={rowSelection}
              columns={this.state.columns}
              dataSource={this.state.users}
              size='middle'
              className='nst-table'
              scroll={{x: 960}}
        />
      </Card>
    );
  }

  private replaceByKey(items: any, item: any) {
    const index = _.findIndex(items, { 'key' : item.key });

    if (index > -1) {
      items.splice(index, 1, item);
    }

    return items;
  }
}

export default List;
