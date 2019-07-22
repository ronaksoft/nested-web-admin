import Downshift from 'downshift';
import AccountApi from '../../api/account';
import AAA from './../../services/classes/aaa/index';
import _ from 'lodash';
import { History } from 'history';
import * as React from 'react';
import UserAvatar from './../avatar/index';
import PlaceApi from '../../api/place/index';
import PlaceModal from '../../components/PlaceModal/index';
import UserModal from '../../scenes/accounts/components/View/index';
import IUser from '../../interfaces/IUser';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
} from '@material-ui/core';
import { IcoN } from '../icon/index';
import { withSnackbar } from 'notistack';
import SearchIcon from '@material-ui/icons/Search';

interface IHeaderProps {
  classes: any;
  history: History;
  enqueueSnackbar: (
    message: React.ReactNode | string,
    options?: any
  ) => string | number | null | undefined;
  closeSnackbar: () => void;
}

interface IHeaderState {
  showPlaceModal: boolean;
  showUserModal: boolean;
  query: string;
  result: any[];
  selectedItem: any[];
}

class Header extends React.Component<IHeaderProps, IHeaderState> {
  private keyword: string = '';
  private selectedPlace: any;
  private selectedUser: any;
  private loggedUser: any;
  private accountApi: AccountApi = new AccountApi();
  private placeApi: PlaceApi = new PlaceApi();

  constructor(props: any) {
    super(props);

    this.state = {
      result: [],
      selectedItem: [],
      showPlaceModal: false,
      query: '',
      showUserModal: false,
    };

    this.search = _.debounce(this.search.bind(this), 256);
    this.handleAccountChange = this.handleAccountChange.bind(this);
    this.loggedUser = AAA.getInstance().getUser();
  }

  search(keyword: string) {
    this.keyword = keyword;
    const getAccountPromise = this.accountApi.getAll({
      limit: 5,
      keyword: keyword,
    });

    const getPlacePromise = this.placeApi.placeList({
      limit: 5,
      keyword: keyword,
    });

    Promise.all([getAccountPromise, getPlacePromise]).then(
      resultSet => {
        const result: any[] = [];
        result[0] = {
          key: 'accounts',
          title: 'Aaccounts',
          items: resultSet[0].accounts,
        };
        result[1] = {
          key: 'places',
          title: 'Places',
          items: resultSet[1],
        };

        this.setState({
          result: result,
        });
      },
      (error: any) => {
        this.props.enqueueSnackbar('We are not able to search right now!', {
          variant: 'error',
        });
      }
    );
  }

  signOut = () => {
    const aaa = AAA.getInstance();
    this.accountApi.signout().then(() => {
      aaa.setIsUnAthenticated();
      this.props.history.push('/signin');
      localStorage.removeItem('nested.server.domain');
    });
  };

  handleSelect = (group: any, item: any) => (e: React.MouseEvent) => {
    if (group.key === 'accounts') {
      this.selectedUser = item;
      this.setState({
        showUserModal: true,
      });
    }

    if (group.key === 'places') {
      this.selectedPlace = item;
      this.setState({
        showPlaceModal: true,
      });
    }
  };

  closePlaceModal() {
    this.setState({
      showPlaceModal: false,
    });
  }

  closeUserModal() {
    this.setState({
      showUserModal: false,
    });
  }

  handleAccountChange(account: IUser) {
    this.selectedUser = account;
    const result = _.cloneDeep(this.state.result);
    const index = _.findIndex(result[0].items, { _id: account._id });
    if (index > -1) {
      result[0].items.splice(index, 1, account);
      this.setState({
        result: result,
      });
    }
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      query: event.target.value,
    });
    this.search(event.target.value);
  }

  handleChange(item: any) {
    let newSelectedItem = [...this.state.selectedItem];
    if (newSelectedItem.indexOf(item) === -1) {
      newSelectedItem = [...newSelectedItem, item];
    }
    this.setState({
      query: '',
      selectedItem: newSelectedItem,
    });
  }

  handleKeyDown = (event: KeyboardEvent) => {
    const { selectedItem } = this.state;
    if (selectedItem.length && !this.state.query.length && event.key === 'Backspace') {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length - 1),
      });
    }
  };

  handleDelete = (item: any) => () => {
    const { selectedItem } = this.state;
    const newSelectedItem = [...selectedItem];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    this.setState({
      selectedItem: newSelectedItem,
    });
  };

  render() {
    const { classes } = this.props;
    const { selectedItem } = this.state;
    let suggestedOptions: JSX.Element[] = this.state.result
      .filter(group => group.items.length > 0)
      .map(group => {
        return (
          <div key={group.key}>
            <h3>{group.title}</h3>
            {group.items.map((item: any) => (
              <MenuItem
                key={group.key + '_' + item._id}
                value={group.key + '___' + item._id}
                onClick={this.handleSelect(group, item)}
              >
                {item._id}
              </MenuItem>
            ))}
          </div>
        );
      });

    if (
      this.state.result.length !== 0 &&
      this.state.result[0].items.length === 0 &&
      this.state.result[1].items.length === 0
    ) {
      suggestedOptions.push(
        <MenuItem key={'no-result-item'} value={this.keyword}>
          No Result for "{this.keyword}"!!
        </MenuItem>
      );
    }
    return (
      <Grid className={classes.header} container={true} spacing={2} alignItems="center">
        <Grid item={true} xs={5}>
          {this.state.showPlaceModal && (
            <PlaceModal
              visible={this.state.showPlaceModal}
              place={this.selectedPlace}
              onChange={p => console.log(p)}
              onClose={this.closePlaceModal.bind(this)}
            />
          )}
          {this.state.showUserModal && (
            <UserModal
              visible={this.state.showUserModal}
              account={this.selectedUser}
              onClose={this.closeUserModal.bind(this)}
              onChange={this.handleAccountChange}
            />
          )}
          <Downshift
            id="downshift-multiple"
            inputValue={this.state.query}
            onChange={this.handleChange}
            selectedItem={this.state.selectedItem}
          >
            {({
              getInputProps,
              getItemProps,
              getLabelProps,
              isOpen,
              inputValue: inputValue2,
              selectedItem: selectedItem2,
              highlightedIndex,
            }) => {
              const { onBlur, onChange, onFocus } = getInputProps({
                onKeyDown: this.handleKeyDown,
                placeholder: 'Select multiple countries',
              });

              return (
                <div>
                  {
                    <TextField
                      fullWidth={true}
                      label="Search here..."
                      InputLabelProps={getLabelProps()}
                      InputProps={{
                        startAdornment:
                          selectedItem.length > 0 ? (
                            selectedItem.map(item => (
                              <Chip
                                key={item}
                                tabIndex={-1}
                                label={item}
                                onDelete={this.handleDelete(item)}
                              />
                            ))
                          ) : (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                      }}
                      onBlur={onBlur}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        this.handleInputChange(event);
                        if (onChange) {
                          onChange(event);
                        }
                      }}
                      onFocus={onFocus}
                    />
                  }

                  {isOpen ? (
                    <Paper square={true} className={classes.suggestArea}>
                      <div className="card-body">{suggestedOptions}</div>
                    </Paper>
                  ) : null}
                </div>
              );
            }}
          </Downshift>
        </Grid>
        <Grid className={classes.profile} item={true} xs={7}>
          <MenuItem className="nst-ico" onClick={this.signOut}>
            <IcoN size={16} name="exit16" />
          </MenuItem>
          <Avatar className={classes.avatar}>
            <UserAvatar size={24} user={this.loggedUser} avatar={true} />
          </Avatar>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles((theme: Theme) =>
  createStyles({
    header: {
      display: 'flex',
      height: '120px',
      zIndex: 11,
    },
    profile: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    avatar: {
      marginLeft: theme.spacing(1),
    },
    suggestArea: {
      position: 'absolute',
      width: '100%',
      maxWidth: '500px',
    },
  })
)(withSnackbar(Header));
