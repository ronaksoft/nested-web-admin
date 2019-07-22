import Drawer from '@material-ui/core/Drawer';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import * as React from 'react';
import { IcoN } from '../icon/index';
// import './filter.less';

export interface IMenuItem {
  key: string;
  name: string;
  icon: string;
  chartColor?: string;
  bgChartColor?: string;
  style?: string;
  class?: string;
  disableChart?: boolean;
}

export interface IFilterProps {
  menus: IMenuItem[];
  totalCount: number;
  onChange: any;
  counters?: any;
  label?: string;
  labelIcon?: string;
}

export interface IFilterState {
  selectedItem?: IMenuItem;
  menus: IMenuItem[];
  isOpen: boolean;
}
class Filter extends React.Component<IFilterProps, IFilterState> {
  private selectedMenuIndex: number = -1;

  constructor(props: IFilterProps) {
    super(props);
    this.state = {
      menus: this.props.menus,
      isOpen: false,
      selectedItem: this.props.menus[0] ? this.props.menus[0] : undefined,
    };
    if (this.props.menus[0]) {
      this.selectedMenuIndex = 0;
    }
  }

  handleGroupChange = (menu: any) => {
    this.selectedMenuIndex = parseInt(menu.key, 0);
    this.setState({
      selectedItem: this.state.menus[this.selectedMenuIndex],
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.state.menus[this.selectedMenuIndex].key);
    }
  };

  componentWillReceiveProps(newProps: IFilterProps) {
    this.setState({
      menus: newProps.menus,
      selectedItem: newProps.menus[this.selectedMenuIndex],
    });
  }

  toggleDrawer = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    const { isOpen } = this.state;

    const menus: JSX.Element[] = this.state.menus.map((menu: IMenuItem, index: number) => (
      <MenuItem key={index} onClick={() => this.handleGroupChange(menu)}>
        <div className="filterPopover">
          <IcoN size={16} name={menu.icon} />
          <p>{menu.name}</p>
          {this.state.selectedItem && this.state.selectedItem.key === menu.key && (
            <IcoN size={16} name="lock" />
          )}
        </div>
      </MenuItem>
    ));

    return (
      <h2>
        <a className="ant-dropdown-link" href="#" onClick={this.toggleDrawer}>
          {this.state.selectedItem && <span>{this.state.selectedItem.name}</span>}
          <IcoN size={16} name="sort16" />
        </a>
        <Drawer open={isOpen} onClose={this.toggleDrawer}>
          <Menu open={isOpen} keepMounted={true} onClose={this.toggleDrawer}>
            {menus}
          </Menu>
        </Drawer>
      </h2>
    );
  }
}

export default Filter;
