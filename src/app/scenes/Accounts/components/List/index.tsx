import * as React from 'react';
import {Icon, Table, Dropdown, Card} from 'antd';
import Account from '/src/app/common/account/Account';
import {IAccount} from '/src/app/common/account/IAccount';
import IUnique from '/src/app/common/IUnique';
import Person from '/src/app/common/user/Person';
import TableColumns from './components/Columns/index';
import _ from 'lodash';
import AccountApi from '../../../../api/account/account';

interface IListProps { }

interface IListState {
  users: Person[];
}

export default class List extends React.Component<IListProps, IListState> {

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  constructor(props: IListProps) {

    this.state = {
      users: [],
      selectedRowKeys: []
    };

    this.tableColumns = new TableColumns();
  }

  componentDidMount() {
    let accountApi = new AccountApi();
    accountApi.accountList()
      .then((accounts: IUser[]) => {
        console.log(accounts);
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
              columns={this.tableColumns.selectedColumns}
              dataSource={this.state.users}
              size='middle'
              className='nst-table'
              scroll={{x: 960}}
        />
      </Card>
    );
  }

}

export default List;
