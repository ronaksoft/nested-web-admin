import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import Filter from '../../components/Filter/index';
import Options from './components/Options/index';
import List from './components/List/index';
import {Row, Col, notification} from 'antd';
import AccountApi from '../../api/account/account';
import FilterGroup from './FilterGroup';

export interface IAccountsProps {}

export interface IAccountsState {
  count: Number;
  filterGroup: FilterGroup;
  Items: IUser[];
}

class Accounts extends React.Component<IAccountsProps, IAccountsState> {
  constructor(props: IAccountsProps) {

    super(props);

    this.state = {
      filterGroup: 'users',
      counters: {}
    };
  }

  load() {
    this.accountApi.getCounters().then((counters) => {
      this.setState({
        counters: counters,
        loading: false
      });
    }).catch((error) => {
      this.setState({
        loading: false
      });
      notification.error('Error', 'An error has occured while trying to get data!');
    });
  }

  componentDidMount() {
    this.accountApi = new AccountApi();
    this.load();
  }

  setGroup = (group: FilterGroup) => this.setState({ filterGroup: group });

  render() {
    const total = this.state.counters.enabled_accounts + this.state.counters.disabled_accounts;
    const filterItems = [
        {
            key : 'users',
            name : 'Total',
            count : total,
            disableChart : true,
        },
        {
            key : 'users_enabled',
            name : 'Active Accounts',
            count : this.state.counters.enabled_accounts,
            chartColor: '#00B45A',
            bgChartColor : '#CBEFDD',
        },
        {
            key : 'users_disabled',
            name : 'Deactive Accounts',
            count : this.state.counters.disabled_accounts,
            chartColor: '#3296FF',
            bgChartColor : '#D9EBFF',
        }
    ];
    return (

      <div>
        <Row className='toolbar' type='flex' align='center'>
          <Col span={6}>
            <Filter totalCount={total} menus={filterItems} onChange={this.setGroup} counters={this.state.counters} />
          </Col>
          <Col span={18}>
            <Options />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <List counters={this.state.counters} />
          </Col>
        </Row>
      </div>
    );
  }

}

function mapStateToProps(state: any) {
  return {};
}

function mapDispatchToProps(dispatch: IDispatch) {
  return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Accounts);
