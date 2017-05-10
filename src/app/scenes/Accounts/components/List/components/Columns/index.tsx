import { TableColumnConfig } from 'antd/lib/table/Table';
import IPerson from '/src/app/common/user/IPerson';
import * as React from 'react';
import {Dropdown, Icon, Menu} from 'antd';
import _ from 'lodash';
import moment from 'moment';

export default class TableColumns {
  selectedColumns: TableColumnConfig[];
  allColumns: TableColumnConfig[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 192,
      fixed: 'left',
      render: (text, user, index) => {
        return `${user.fname} ${user.lname}`;
      }
    },
    {
      title: 'User ID',
      dataIndex: '_id',
      key: '_id',
      width: 128,
      fixed: 'left'
    },
    {
      title: 'Member in Place',
      dataIndex: 'access_places',
      key: 'access_places',
      render: (text, user, index) => {
        return user.access_places
          ? user.access_places.length
          : '-';
      }
    },
    {
      title: 'Joined Date',
      dataIndex: 'joined_on',
      key: 'joined_on',
      render: (text, user, index) => {
        const value = moment(user.joined_on, 'YYYY-MM-DD');
        if (value.isValid()) {
          return value.format('YYYY[/]MM[/]DD HH:mm A');
        } else {
          return '-';
        }
      }
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (text, user, index) => {
        if (text === 'm') {
          return 'Male';
        } else if (text === 'f') {
          return 'Female';
        } else if (text === 'o') {
          return 'Other';
        } else {
          return '-';
        }
      }
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
      render: (text, user, index) => {
        const value = moment(user.joined_on, 'YYYY-MM-DD');
        if (value.isValid()) {
          return value.format('YYYY[/]MM[/]DD');
        } else {
          return '-';
        }
      }
    },
    {
      title: 'Searchable',
      dataIndex: 'privacy.searchable',
      key: 'privacy.searchable',
      render: (text, user, index) => {
        if (user.privacy.searchable) {
          return (<Icon type='check' />);
        } else {
          return (<Icon type='close' />);
        }
      }
    },
    {
      title: 'Status',
      dataIndex: 'registered',
      key: 'registered'
    },
    {
      title: (
        <Dropdown overlay={
          <Menu>
          </Menu>
        } trigger={['click']}>
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
    },
  ];

  constructor() {
    // const columns = window.localStorage.get('nested.admin.accounts.columns');
    const columns = 'name,_id,access_places,joined_on,status,options';
    let list = _.split(columns, ',');
    if (_.size(list) === 0) {
      list = _(this.allColumns).take(6).map('key').value();
    }
    this.selectedColumns = _.filter(this.allColumns, (column) => _.includes(list, column.key));
  }

}
