import _ from 'lodash';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import * as React from 'react';
import { IcoN } from '../icon/index';

export interface IMenuItem {
  key: string;
  name: string;
  icon: string;
  action?: any;
  switch?: boolean;
  switchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  class?: string;
}

export interface IFilterProps {
  menus: IMenuItem[];
  deviders?: number[];
  classes: any;
}

export interface IFilterState {
  menus: IMenuItem[];
  isOpen: boolean;
}
class MoreOption extends React.Component<IFilterProps, IFilterState> {
  private button: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: IFilterProps) {
    super(props);
    this.state = {
      isOpen: false,
      menus: this.props.menus || [],
    };
  }

  handleGroupChange(menu: any) {
    if (_.isFunction(menu.action)) {
      menu.action(menu);
    }
  }

  componentWillReceiveProps(newProps: IFilterProps) {
    this.setState({
      menus: newProps.menus,
    });
  }

  toggleDrawer = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    const { classes } = this.props;
    const { isOpen } = this.state;

    const menus: JSX.Element[] = [];
    const classNames = ['filterPopover'];
    this.state.menus.forEach((menu: IMenuItem, index: number) => {
      const haveSwitch = menu.switch || menu.switch === false;
      if (menu.class) {
        classNames.push(menu.class);
      }
      menus.push(
        <MenuItem key={menu.key} onClick={() => this.handleGroupChange(menu)}>
          <div className={classes.menuItem}>
            <IcoN size={16} name={menu.icon} />
            <p>{menu.name}</p>
            {haveSwitch && (
              <Switch
                checked={menu.switch}
                value={menu.switch}
                onChange={menu.switchChange}
                color="primary"
              />
            )}
          </div>
        </MenuItem>
      );

      if (this.props.deviders && this.props.deviders.indexOf(index) > -1) {
        menus.push(<Divider key={index} />);
      }
    });

    return (
      <div>
        <div className="_cp ant-dropdown-link" onClick={this.toggleDrawer} ref={this.button}>
          <IcoN size={24} name="more24" />
        </div>
        <Menu
          open={isOpen}
          keepMounted={true}
          onClose={this.toggleDrawer}
          anchorEl={this.button.current}
        >
          {menus}
        </Menu>
      </div>
    );
  }
}

export default withStyles((theme: Theme) =>
  createStyles({
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      color: fade(theme.palette.text.primary, 0.72),
      margin: 0,
      flex: 1,
      '& i': {
        marginRight: '12px',
      },
      '& p': {
        fontWeight: 700,
        display: 'flex',
        flex: 1,
        fontSize: '14px',
      },
    },
  })
)(MoreOption);
