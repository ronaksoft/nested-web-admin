import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import Filter from './components/Filter/index';
import Options from './components/Options/index';
import List from './components/List/index';
import {Row, Col} from 'antd';

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
      filterGroup: Filter.FilterGroup.Total
    };
  }

  setGroup = (group: Filter.FilterGroup) => this.setState({ filterGroup: group });

  render() {
    return (

      <div>
        <Row className='toolbar'>
          <Col span={6}>
            <Filter count={10} group={this.state.filterGroup} setGroup={this.setGroup}/>
          </Col>
          <Col span={18}>
            <Options />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <List />
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
