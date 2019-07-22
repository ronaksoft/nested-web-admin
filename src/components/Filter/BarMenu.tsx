import * as React from 'react';
import { IcoN } from '../icon/index';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from '@material-ui/core/Drawer';

// import './filter.less';

export interface IMenuItem {
  key: string;
  name: string;
  icon: string;
  count?: number;
  chartColor?: string;
  bgChartColor?: string;
  style?: string;
  class?: string;
  disableChart?: boolean;
}

export interface IFilterProps {
  menus: Array<IMenuItem>;
  onChange: any;
  label?: string;
  labelIcon?: string;
}

export interface IFilterState {
  selectedItem?: IMenuItem;
  isOpen: boolean;
  menus: IMenuItem[];
}
class BarMenu extends React.Component<IFilterProps, IFilterState> {
  private selectedMenuIndex: number = 0;

  constructor(props: IFilterProps) {
    super(props);
    if (this.props.menus[0]) {
      this.state = {
        menus: this.props.menus,
        isOpen: false,
        selectedItem: this.props.menus[0],
      };
    }
  }

  handleGroupChange = (menu: IMenuItem) => {
    if (!menu.key) {
      menu = this.state.menus[0];
      this.setState({
        selectedItem: menu,
      });

      if (typeof this.props.onChange === 'function') {
        this.props.onChange(menu.key);
      }
    } else {
      this.selectedMenuIndex = parseInt(menu.key, 0);
      this.setState({
        selectedItem: this.state.menus[this.selectedMenuIndex],
      });

      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this.state.menus[this.selectedMenuIndex].key);
      }
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
    if (this.state.menus.length > 1) {
      const menus: JSX.Element[] = this.state.menus.map((menu: IMenuItem, index: number) => (
        <MenuItem key={index} onClick={() => this.handleGroupChange(menu)}>
          <div className="filterPopover">
            <IcoN size={16} name={menu.icon} />
            <p>{menu.name}</p>
            <span>{menu.count}</span>
          </div>
        </MenuItem>
      ));
      const label = this.state.menus.map(menu => menu.name).join(' / ');
      return (
        <div>
          <span className="bar-item">
            {label}
            <div className="bar-icon">
              <IcoN size={16} name="arrow16" />
            </div>
          </span>
          <Drawer open={isOpen} onClose={this.toggleDrawer}>
            <Menu open={isOpen} keepMounted={true} onClose={this.toggleDrawer}>
              {menus}
            </Menu>
          </Drawer>
        </div>
      );
    } else {
      return (
        <span className="bar-item" onClick={() => this.handleGroupChange(this.state.menus[0])}>
          {this.state.menus[0].name}
          <div className="bar-icon">
            <IcoN size={16} name={this.state.menus[0].icon} />
          </div>
        </span>
      );
    }
  }
}

export default BarMenu;
