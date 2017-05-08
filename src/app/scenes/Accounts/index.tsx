import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
<<<<<<< Updated upstream
import Filter from './components/Filter/index';
import Options from './components/Options/index';
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
        <Row>
          <Col span={12}>
            <Filter count={10} group={this.state.filterGroup} setGroup={this.setGroup}/>
          </Col>
          <Col span={12}>
            <Options />
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
=======
import {Filter} from './components/Filter/index';

function Accounts(count: any) {
  return (
    <div>
      <h1>YES</h1>
      <Filter />
    </div>
  );
>>>>>>> Stashed changes
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
