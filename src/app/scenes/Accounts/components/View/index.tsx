import * as React from 'react';
import {Modal, Row, Col, Button} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import PlaceItem from './components/PlaceItem/index';
import IPerson from '../../IPerson';
import UserAvatar from '../../../../components/avatar/index';


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

    this.cleanup = this.cleanup.bind(this);
  }

  cleanup() {
    this.setState({
      setEmail: false
    });
  }

  render() {
    // todo: ask server to get place objects
    const memberInPlaces = this.props.account.access_places || [];
    const managerInPlaces = this.props.account.access_places || [];
    console.log(this.props);
    var user = this.props.account;

    return (
      <Modal key={_.uniqueId()} visible={this.props.visible} onCancel={this.props.onClose} footer={null}
      afterClose={this.cleanup} className='account-modal nst-modal' width={480} title='Account Info'>
        <Row type='flex' align='middle'>
          <Col span={8}>
          <UserAvatar avatar size={64} user={user} />
          </Col>
          <Col span={16}>
            <a className='change-photo' onClick={this.changePhoto}>Change Photo</a>
            <a className='remove-photo' onClick={this.removePhoto}>Remove Photo</a>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <label>First Name</label>
          </Col>
          <Col span={14}>
            <b>{this.props.account.fname}</b>
          </Col>
          <Col span={2}>
            <Button type='toolkit nst-ico ic_pencil_solid_16'></Button>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <label>Last Name</label>
          </Col>
          <Col span={14}>
            <b>{this.props.account.lname}</b>
          </Col>
          <Col span={2}>
            <Button type='toolkit nst-ico ic_pencil_solid_16'></Button>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <label>User ID</label>
          </Col>
          <Col span={14}>
            <b>@{this.props.account._id}</b>
          </Col>
          <Col span={2}></Col>
        </Row>
        <Row>
          <Col span={8}>
            <label>Status</label>
          </Col>
          <Col span={14}>
            <b>{this.props.account.disabled ? 'Not Active' : 'Active'}</b>
          </Col>
          <Col span={2}></Col>
        </Row>
        <Row>
          <Col span={8}>
            <label>Birthday</label>
          </Col>
          <Col span={14}>
            Where can I find it?
          </Col>
          <Col span={2}>
            <Button type='toolkit nst-ico ic_more_solid_16'></Button>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            Phone Number
          </Col>
          <Col span={14}>
            <b>{this.props.account.phone}</b>
          </Col>
          <Col span={2}>
            <Button type='toolkit nst-ico ic_pencil_solid_16'></Button>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <label>Birthday</label>
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
          <Col span={2}></Col>
        </Row>
        <Row>
          <Col span={8}>
            <label>Email</label>
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
          <Col span={2}></Col>
        </Row>
        {
          managerInPlaces.length > 0 &&
          <Row className='devide-row'>
            <Col span={18}>
              Manager of 
            </Col>
            <Col style={{textAlign : 'right'}} span={6}>
              {managerInPlaces.length} place
            </Col>
          </Row>
        }
        {
          managerInPlaces.length > 0 &&
          <Row className='remove-margin'>
            <Col span={24}>
              {managerInPlaces.map((place) => <PlaceItem place={place} />)}
            </Col>
          </Row>
        }
        {
          memberInPlaces.length > 0 &&
          <Row className='devide-row'>
            <Col span={18}>
              Member of 
            </Col>
            <Col style={{textAlign : 'right'}} span={6}>
              {memberInPlaces.length} place
            </Col>
          </Row>
        }
        {
          memberInPlaces.length > 0 &&
          <Row>
            <Col span={24}>
              {memberInPlaces.map((place) => <PlaceItem place={place} />)}
            </Col>
          </Row>
        }
      </Modal>
    );
  }
}

export default View;
