import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';

import Filter from './../../components/Filter/index';
import {Row, Col} from 'antd';

export interface IAccountsProps {}

export interface IAccountsState {
  count: Number;
}

class Accounts extends React.Component<IAccountsProps, IAccountsState> {
  constructor(props: IAccountsProps) {
    super(props);
    this.state = {};
  }

  changeFilter (key: string) {
    alert(key);
  }

  render() {

      const filterItems = [
          {
              key : 'total',
              name : 'Total',
              count : 9765,
              disableChart : true,
          },
          {
              key : 'grand_places',
              name : 'Grand Places (with personal)',
              count : 24,
              chartColor: '#00B45A',
              bgChartColor : '#CBEFDD',
          },
          {
              key : 'grand_places_only',
              name : 'Grand Places Only',
              count : 68,
              chartColor: '#3296FF',
              bgChartColor : '#D9EBFF',
          },
          {
              key : 'personal_places',
              name : 'Personal Places (with Sub-places)',
              count : 85,
              chartColor: '#FF6464',
              bgChartColor : '#FFDFDF',
          }
      ];

      return (
          <div>
              <Row>
                  <Col span={12}>
                      <Filter totalCount={100} menus={filterItems} onChange={this.changeFilter.bind(this)}/>
                  </Col>
                  <Col span={12}>

                  </Col>
              </Row>
              <Row>
                    <Col span={24}>
                      Table
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
