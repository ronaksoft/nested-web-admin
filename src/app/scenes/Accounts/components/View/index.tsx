import * as React from 'react';
import {Modal, Row, Col, Spin} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import PlaceItem from './components/PlaceItem/index';
import IPerson from '../../IPerson';
import PlaceApi from '../../../../api/place/index';

interface IViewProps {
  visible: boolean;
  account: IPerson;
  onChange: (user: IPerson) => void;
  onClose: () => void;
}

interface IViewState {
  setEmail: boolean;
  setDateOfBirth: boolean;
}

class View extends React.Component<IViewProps, IViewState> {
  constructor(props: IViewProps) {
    super(props);
    this.state = {
      setEmail: false,
      setDateOfBirth: false
    };

    this.loadPlaces = this.loadPlaces.bind(this);
  }

  componentDidMount() {
    this.placeApi = new PlaceApi();
    if (this.props.account && this.props.account._id) {
      this.loadPlaces(this.props.account._id);
    }
  }

  componentWillReceiveProps(nextProps: IViewProps) {
    if (nextProps.account && nextProps.account._id) {
      this.loadPlaces(nextProps.account._id);
    }
  }

  loadPlaces(accountId: string) {
    this.setState({
      loading: true
    });

    this.placeApi.getAccountPlaces({
      account_id: accountId
    }).then((result) => {
      this.setState({
        places: result.places,
        loading: false
      });
    }).catch((error) => {
      console.log('error', error);
      this.setState({
        places: [],
        loading: false
      });
    });
  }

  render() {
    const managerInPlaces = _.filter(this.state.places, (place) => _.includes(place.accesses, 'C'));
    const memberInPlaces = _.differenceBy(this.state.places, managerInPlaces, '_id');

    return (
      <Modal key={this.props.account._id} visible={this.props.visible} onCancel={this.props.onClose} footer={null}>
        <Row>
          <Col span={8}>
            Photo
          </Col>
          <Col span={8}>
            <a onClick={this.changePhoto}>Change Photo</a>
          </Col>
          <Col span={8}>
            <a onClick={this.removePhoto}>Remove Photo</a>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            First Name
          </Col>
          <Col span={14}>
            <b>{this.props.account.fname}</b>
          </Col>
          <Col span={2}>
            edit
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            Last Name
          </Col>
          <Col span={14}>
            <b>{this.props.account.lname}</b>
          </Col>
          <Col span={2}>
            edit
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            User ID
          </Col>
          <Col span={14}>
            @{this.props.account._id}
          </Col>
          <Col span={2}>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            Status
          </Col>
          <Col span={14}>
            {this.props.account.disabled ? 'Not Active' : 'Active'}
          </Col>
          <Col span={2}>
            options
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            Password
          </Col>
          <Col span={14}>
            Where can I find it?
          </Col>
          <Col span={2}>
            options
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            Phone Number
          </Col>
          <Col span={14}>
            {this.props.account.phone}
          </Col>
          <Col span={2}>
            edit
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            Birthday
          </Col>
          <Col span={14}>
          {
            this.props.account.dob &&
            <b>{this.props.account.dob}</b>
          }
          {
            !this.props.account.dob &&
            <a onClick={() => this.setState({ setDateOfBirth: true })}><i>-click to assign-</i></a>
          }
          <Modal
                key={_.uniqueId()}
                title='Edit Birthdate'
                visible={this.state.setDateOfBirth}
                onOk={(email) => this.setState({ dob: dob })}
                onCancel={() => this.setState({ setDateOfBirth: false })}
          >
          <p>
            Write your email address.
          </p>
          </Modal>
          </Col>
          <Col span={2}>
            edit
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            Email
          </Col>
          <Col span={14}>
            {
              this.props.account.email &&
              <b>{this.props.account.email}</b>
            }
            {
              !this.props.account.email &&
              <a onClick={() => this.setState({ setEmail: true })}><i>-click to assign-</i></a>
            }
            <Modal
                  key={_.uniqueId()}
                  title='Edit Email'
                  visible={this.state.setEmail}
                  onOk={(email) => this.setState({ email: email })}
                  onCancel={() => this.setState({ setEmail: false })}
            >
            <p>
              Write your email address.
            </p>
            </Modal>
          </Col>
          <Col span={2}>

          </Col>
        </Row>
        <Row>
          <Col span={24}>

            {
              managerInPlaces.length > 0 &&
              <Row>
                <Col span={20}>
                  Manager of
                </Col>
                <Col span={4}>
                  {managerInPlaces.length}
                </Col>
              </Row>
            }
            {
              managerInPlaces.length > 0 &&
              <Row>
                <Col span={24}>
                  {managerInPlaces.map((place) => <PlaceItem place={place} key={place._id} />)}
                </Col>
              </Row>
            }
            {
              memberInPlaces.length > 0 &&
              <Row>
                <Col span={20}>
                  Member of
                </Col>
                <Col span={4}>
                  {memberInPlaces.length}
                </Col>
              </Row>
            }
            {
              memberInPlaces.length > 0 &&
              <Row>
                <Col span={24}>
                  {memberInPlaces.map((place) => <PlaceItem place={place} key={place._id} />)}
                </Col>
              </Row>
            }

          </Col>
        </Row>
      </Modal>
    );
  }
}

export default View;
