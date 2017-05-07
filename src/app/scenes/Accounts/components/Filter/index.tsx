import * as React from 'react';
import { Menu, Dropdown, Icon, Row, Col } from 'antd';

export interface IFilterProps {
    count: Number;
    group?: FilterGroup;
    setGroup: Handler;
}

export enum FilterGroup {
    Total = 1,
    Active = 2,
    Pending = 3,
    DeactivedAndDeleted = 4
}

class Filter extends React.Component<IFilterProps, any> {

    static FilterGroup = FilterGroup;

    constructor(props: IFilterProps) {
        super(props);
        this.state = {
            count: props.count || 0,
            group: props.group || FilterGroup.Total
        };
    }

    handleGroupChange = (group: FilterGroup) => {
        this.setState({
            group: group
        });
        this.props.setGroup(group);
    }

    render() {
        const filterLabels = {};
        filterLabels[FilterGroup.Total] = 'Total Accounts';
        filterLabels[FilterGroup.Active] = 'Active Accounts';
        filterLabels[FilterGroup.Pending] = 'Pending Accounts';
        filterLabels[FilterGroup.DeactivedAndDeleted] = 'Deactivated & Deleted Accounts';

        let group = null;
        const menu = (
          <Menu>
            <Menu.Item key={FilterGroup.Total}>
              {
                this.state.group === FilterGroup.Total &&
                <Icon type='check' />
              }
              <a onClick={() => this.handleGroupChange(FilterGroup.Total)}>{filterLabels[FilterGroup.Total]}</a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key={FilterGroup.Active}>
              {
                this.state.group === FilterGroup.Active &&
                <Icon type='check' />
              }
              <a onClick={() => this.handleGroupChange(FilterGroup.Active)}>{filterLabels[FilterGroup.Active]}</a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key={FilterGroup.Pending}>
              {
                this.state.group === FilterGroup.Pending &&
                <Icon type='check' />
              }
              <a onClick={() => this.handleGroupChange(FilterGroup.Pending)}>{filterLabels[FilterGroup.Pending]}</a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key={FilterGroup.DeactivedAndDeleted}>
              {
                this.state.group === FilterGroup.DeactivedAndDeleted &&
                <Icon type='check' />
              }
              <a onClick={() => this.handleGroupChange(FilterGroup.DeactivedAndDeleted)}>{filterLabels[FilterGroup.DeactivedAndDeleted]}</a>
            </Menu.Item>
          </Menu>
        );

        return (
          <Row justify='start'>
            <Col span={12}><h1>{this.state.count}</h1></Col>
            <Col span={12}>
              <h2>
                {filterLabels[this.state.group]}
                <Dropdown overlay={menu} trigger={['click']}>
                 <a className='ant-dropdown-link' href='#'>
                   <Icon type='down' />
                 </a>
                </Dropdown>
              </h2>
            </Col>
          </Row>
        );
    }
}

export default Filter;
