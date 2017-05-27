import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';

import Filter from './../../components/Filter/index';
import {Row, Col, Icon} from 'antd';
import PlaceList from './List/index';
import SystemApi from '../../api/system/index';
import IGetSystemCountersResponse from '../../api/system/interfaces/IGetSystemCountersResponse';
import CPlaceFilterTypes from '../../api/consts/CPlaceFilterTypes';


export interface IAccountsProps {
}

export interface IAccountsState {
  counters: IGetSystemCountersResponse;
  loadCounters: boolean;
  selectedFilter: string;
}

class Accounts extends React.Component<IAccountsProps, IAccountsState> {
  constructor(props: IAccountsProps) {
    super(props);
    this.state = {
      selectedFilter: CPlaceFilterTypes.GRAND_PLACES,
      counters: {},
      loadCounters: false,
    };
  }

  componentDidMount() {
    let systemApi = new SystemApi();
    systemApi.getSystemCounters()
      .then((data: IGetSystemCountersResponse) => {
        this.setState({
          counters: data,
          loadCounters: true
        });
      });
  }

  changeFilter(key: string) {
    this.setState({
      selectedFilter: key,
    });
  }

  render() {

    const filterItems = [
      {
        key: CPlaceFilterTypes.ALL,
        name: 'Total',
        count: this.state.counters.grand_places + this.state.counters.locked_places + this.state.counters.unlocked_places,
        disableChart: true,
      },
      {
        key: CPlaceFilterTypes.GRAND_PLACES,
        name: 'Grand Places',
        count: this.state.counters.grand_places,
        chartColor: '#00B45A',
        bgChartColor: '#CBEFDD',
      },
      {
        key: CPlaceFilterTypes.UNLOCKED_PLACES,
        name: 'Unlocked Places',
        count: this.state.counters.unlocked_places,
        chartColor: '#3296FF',
        bgChartColor: '#D9EBFF',
      },
      {
        key: CPlaceFilterTypes.LOCKED_PLACES,
        name: 'Locked Places',
        count: this.state.counters.locked_places,
        chartColor: '#FF6464',
        bgChartColor: '#FFDFDF',
      },
      {
        key: CPlaceFilterTypes.PERSONAL_PLACES,
        name: 'Personal Places',
        count: this.state.counters.personal_places,
        chartColor: '#FF6464',
        bgChartColor: '#FFDFDF',
      }
    ];
    console.log(this.state.counters, filterItems);

    return (
      <div>
        <Row className='toolbar' type='flex' align='center'>
          <Col span={6}>
            {this.state.loadCounters &&
            <Filter totalCount={filterItems[0].count} menus={filterItems} onChange={this.changeFilter.bind(this)}/>
            }
          </Col>
          <Col span={18}></Col>
        </Row>
        <Row>
          <Col span={24}>
            {this.state.loadCounters &&
            <PlaceList counters={this.state.counters} selectedFilter={this.state.selectedFilter}/>
            }
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
