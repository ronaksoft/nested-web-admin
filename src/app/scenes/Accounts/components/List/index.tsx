import * as React from 'react';
import {Icon, Table, Dropdown, Card} from 'antd';
import Account from '/src/app/common/account/Account';
import {IAccount} from '/src/app/common/account/IAccount';
import IUnique from '/src/app/common/IUnique';
import Person from '/src/app/common/user/Person';
import TableColumns from './TableColumns';
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

    const person1 = new Person();
    const person2 = new Person();
    const person3 = new Person();

    person1._id = '1';
    person1.fname = 'Soroush';
    person1.lname = 'Torkzadeh';
    person1.gender = 'Male';
    person1.searchable = true;

    person2._id = '2';
    person2.fname = 'Ali';
    person2.lname = 'Mahmoudi';
    person2.gender = 'Male';
    person2.searchable = false;

    person3._id = '3';
    person3.fname = 'Sina';
    person3.lname = 'Hoseini';
    person3.gender = 'Male';
    person3.searchable = false;

    this.state = {
      users: [ person1, person2, person3 ],
      selectedRowKeys: []
    };

    console.log(this.state.users);
  }

  componentDidMount() {
    setTimeout(() => {
      let accountApi = new AccountApi();
      accountApi.accountList()
        .then((res) => {
          console.log(res);
        });
    }, 3000);

  }


  render() {

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange
    };

    return (
      <Card style={{ width: 960}}>
        <Table
              rowKey='_id'
              rowSelection={rowSelection}
              columns={TableColumns.selectedColumns}
              dataSource={this.state.users}
              size='middle'
              scroll={{x: 960}}
        />
      </Card>
    );
  }

}

export default List;
