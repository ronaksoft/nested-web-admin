import { TableColumnConfig } from 'antd/lib/table/Table';
import IPerson from '/src/app/common/user/IPerson';
import * as React from 'react';
import {Dropdown, Icon, Menu} from 'antd';

export default class TableColumns {
  selectedColumns: object[];
  allColumns: TableColumnConfig<IPerson> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 128,
      fixed: 'left'
    },
    {
      title: 'User ID',
      dataIndex: '_id',
      key: '_id',
      width: 72,
      fixed: 'left'
    },
    {
      title: 'Member in Place',
      dataIndex: 'place_count',
      key: 'place_count'
    },
    {
      title: 'Joined Date',
      dataIndex: 'join_date',
      key: 'join_date'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: (
        <Dropdown overlay={menu} trigger={['click']}>
          <a className='ant-dropdown-link' href='#'>
            <Icon type='setting' />
          </a>
       </Dropdown>
      ),
      dataIndex: 'options',
      key: 'options',
      fixed: 'right',
      width: 64,
      render: () => {
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
    }
  ];

  constructor() {
    const columns = localStorage.get('nested.admin.accounts.columns');
    let list = _.split(columns, ',');
    if (_.size(list) > 0) {
      list = _(this.allColumns).take(6).map('key').value();
    }
    this.selectedColumns = _.filter(this.allColumns, (column) => _.includes(list, column.key));
  }

}
