import * as React from 'react';
import {Icon, Table, Dropdown} from 'antd';
import Account from '/src/app/common/account/Account';
import {IAccount} from '/src/app/common/account/IAccount';
import IUnique from '/src/app/common/IUnique';
import Person from '/src/app/common/user/Person';
import _ from 'lodash';

interface IListProps { }

interface IListState {
  users: Person[];
}

export default class List extends React.Component<IListProps, IListState> {
  const optionsMenu = (
    <span>Items</span>
  );

  const allColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 128,
      fixed: 'left'
    },
    {
      title: 'User ID',
      dataIndex: 'id',
      key: '_id',
      width: 72,
      fixed: 'left'
    },
    {
      title: 'Member in Place',
      dataIndex: 'places',
      key: 'places'
    },
    {
      title: 'Joined Date',
      dataIndex: 'joined',
      key: 'joined'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Options',
      dataIndex: 'options',
      key: 'options',
      fixed: 'right',
      width: 64,
      render: () => (
        <Dropdown overlay={this.optionsMenu}>
          <a className='ant-dropdown-link' href='#'>
            <Icon type='setting' />
          </a>
        </Dropdown>
      )
    }
  ];

  constructor(props: IListProps) {
    this.state = {
      users: [
        new Person(),
        new Person(),
        new Person()
      ]
    };

    console.log(this.state.users);
  }


  render() {
    return (
      <Table rowKey={row => row._id} columns={this.allColumns} dataSource={this.state.users} />
    );
  }

}

export default List;
