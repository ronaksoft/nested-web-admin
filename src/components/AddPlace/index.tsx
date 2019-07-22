import * as React from 'react';
import _ from 'lodash';

import IPlace from '../../interfaces/IPlace';
import PlaceApi from '../../api/place/index';
import PlaceView from '../placeview/index';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';

interface IProps {
  classes: any;
  visible: boolean;
  onClose: () => void;
  addPlaces: (places: IPlace[]) => void;
  places?: IPlace[];
}

interface IStates {
  visible: boolean;
  places: IPlace[];
  suggests: IPlace[];
  selectedPlaces: IPlace[];
  query: string;
  hasMore: boolean;
}

class AddPlaceModal extends React.Component<IProps, IStates> {
  private placeApi: any = new PlaceApi();
  private searchIt: any = _.debounce(this.searchPlaces, 512);
  private searchSetting: any = {
    skip: 0,
    limit: 10,
    keyword: '',
  };

  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      places: this.props.places || [],
      suggests: [],
      selectedPlaces: [],
      query: '',
      hasMore: false,
    };
  }

  componentDidMount() {
    this.searchPlaces('');
  }

  updateSuggestions(places?: IPlace[], callback?: any) {
    if (places === undefined) {
      places = this.state.suggests;
    }
    let list = _.differenceBy(places, this.state.selectedPlaces, '_id');
    list = _.differenceBy(list, this.state.places, '_id');
    list = _.uniqBy(list, '_id');
    if (_.isFunction(callback)) {
      callback(list);
    }
    this.setState({
      suggests: list,
    });
  }

  fullFillList(places: any[], list: any[]) {
    if (places.length >= this.searchSetting.limit) {
      this.setState({
        hasMore: true,
      });
      if (list.length === 0) {
        this.loadEvenMore();
      }
    } else {
      this.setState({
        hasMore: false,
      });
    }
  }

  loadEvenMore = () => {
    this.searchSetting.skip += this.searchSetting.limit;
    const filter = 'all';
    this.placeApi
      .placeList({
        filter,
        keyword: this.searchSetting.keyword,
        limit: this.searchSetting.limit,
        skip: this.searchSetting.skip,
      })
      .then((places: any[]) => {
        this.updateSuggestions(this.state.suggests.concat(places), (list: any) => {
          this.fullFillList(places, list);
        });
      });
  };

  searchPlaces(keyword: string) {
    this.searchSetting.skip = 0;
    const filter = 'all';
    this.placeApi
      .placeList({
        filter,
        keyword: this.searchSetting.keyword,
        limit: this.searchSetting.limit,
        skip: this.searchSetting.skip,
      })
      .then((places: any[]) => {
        this.searchSetting.keyword = keyword;
        this.updateSuggestions(places, (list: any) => {
          this.fullFillList(places, list);
        });
      });
  }

  updateSearchQuery = (event: any) => {
    const keyword = event.currentTarget.value;
    this.setState(
      {
        query: keyword,
      },
      () => {
        this.searchIt(keyword);
      }
    );
  };

  componentWillReceiveProps(props: any) {
    this.setState({
      visible: props.visible,
      places: props.places,
    });
  }

  addThisPlace = (place: IPlace) => (e: React.MouseEvent) => {
    const selectedPlaces = this.state.selectedPlaces;
    const index = _.findIndex(selectedPlaces, {
      _id: place._id,
    });
    if (index === -1) {
      selectedPlaces.push(place);
      this.setState(
        {
          selectedPlaces: selectedPlaces,
        },
        () => {
          this.updateSuggestions(this.state.suggests);
        }
      );
    }
  };

  removeThisPlace(place: IPlace) {
    let _id: string = _.isObject(place) ? place._id : place;
    const places = this.state.selectedPlaces;
    const index = _.findIndex(places, {
      _id,
    });
    if (index > -1) {
      places.splice(index, 1);
      this.setState(
        {
          selectedPlaces: places,
        },
        () => {
          this.searchPlaces(this.state.query);
        }
      );
    }
  }

  getSuggests() {
    const list = this.state.suggests.map((p: IPlace) => {
      return (
        <li key={p._id + 'ss'}>
          <PlaceView borderRadius="4px" place={p} size={32} avatar={true} name={true} id={true} />
          <div className="filler" />
          {Boolean(p.type !== 'personal') && (
            <div className={this.props.classes.addButton} onClick={this.addThisPlace(p)}>
              Add
            </div>
          )}
        </li>
      );
    });
    return (
      <ul className="suggests">
        {list}
        <li key={'add_member_load_more'}>
          <Button variant="outlined" color="secondary" onClick={this.loadEvenMore} fullWidth={true}>
            Load More...
          </Button>
        </li>
      </ul>
    );
  }

  getSelectedPlaces() {
    const list = this.state.selectedPlaces.map((p: IPlace) => {
      return (
        <li key={p._id} onClick={this.removeThisPlace.bind(this, p)}>
          <PlaceView borderRadius="4px" place={p} size={32} avatar={true} id={true} />
        </li>
      );
    });
    return <ul className="selecteds">{list}</ul>;
  }

  handleCancel = () => {
    this.props.onClose();
  };

  addPlaces = () => {
    if (this.props.addPlaces) {
      this.props.addPlaces(
        _.merge(_.clone(this.state.selectedPlaces), {
          admin: false,
        })
      );
    }
    this.props.onClose();
    this.setState({
      selectedPlaces: [],
      query: '',
    });
    this.searchPlaces('');
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog onClose={this.handleCancel} open={this.state.visible} fullWidth={true} maxWidth="md">
        <DialogTitle id="simple-dialog-title">Place Member</DialogTitle>
        <DialogContent className={classes.body}>
          {this.getSelectedPlaces()}
          <TextField
            id="name"
            autoComplete={'off'}
            label="Name or id"
            value={this.state.query}
            onChange={this.updateSearchQuery}
          />
          {this.getSuggests()}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={this.addPlaces} fullWidth={true}>
            add {this.state.selectedPlaces.length} Places
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles((theme: Theme) =>
  createStyles({
    body: {
      display: 'flex',
      flexDirection: 'column',
    },
  })
)(AddPlaceModal);
