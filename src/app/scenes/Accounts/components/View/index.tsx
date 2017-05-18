import * as React from 'react';
import {Modal, Row, Col, Spin, Button, Form, Input, notification, DatePicker} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import PlaceItem from '../../../../components/PlaceItem/index';
import IPerson from '../../IPerson';
import PlaceApi from '../../../../api/place/index';
import AccountApi from '../../../../api/account/account';
import UserAvatar from '../../../../components/avatar/index';
import EditableFields from './EditableFields';


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
  DATE_FORMAT: string = 'YYYY-MM-DD';
  constructor(props: IViewProps) {
    super(props);
    this.state = {
      setEmail: false,
      setDateOfBirth: false
    };

    this.loadPlaces = this.loadPlaces.bind(this);
    this.editField = this.editField.bind(this);
    this.applyChanges = this.applyChanges.bind(this);
  }


  componentDidMount() {
    this.placeApi = new PlaceApi();
    this.accountApi = new AccountApi();

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

  editField(target: EditableFields) {
    this.setState({
      editTarget: target,
      showEdit: true,
      uniqueKey: _.uniqueId(),
      updateProgress: false
    });
  }

  applyChanges(form: any) {
    this.setState({
      updateProgress: true
    });

    const edited = form.getFieldsValue();

    this.accountApi.edit(_.merge(edited, { account_id: this.props.account._id })).then((result) => {
      this.setState({
        updateProgress: false,
        showEdit: false
      });
    }).catch((error) => {
      this.setState({
        updateProgress: false
      });
      notification.error({
        message: 'Update Error',
        description: 'We were not able to update the field!'
      });
    });
  }

  saveForm = (form) => this.form = form;

  render() {
    const managerInPlaces = _.filter(this.state.places, (place) => _.includes(place.accesses, 'C'));
    const memberInPlaces = _.differenceBy(this.state.places, managerInPlaces, '_id');

    const EditForm = Form.create({
      onFieldsChange: () => {
        // const model = this.form.getFieldsValue();
        // const errors = this.form.getFieldsError();
        // this.props.onChange(this.state.packet.key, model, errors);
      },
      mapPropsToFields: (props: any) => {
        return {
          fname: {
            value: props.fname
          },
          lname: {
            value: props.lname
          },
          phone: {
            value: props.phone
          },
          dob: {
            value: props.dob ? moment(props.dob, this.DATE_FORMAT) : null
          },
          email: {
            value: props.email
          }
        };
      }
    })((props: any) => {
      const { getFieldDecorator } = props.form;
      return (
        <Form>
          {
            this.state.editTarget === EditableFields.fname &&
            <Form.Item label='First Name'>
            {getFieldDecorator('fname', {
              rules: [{ required: true, message: 'First name is required!' }],
            })(
              <Input placeholder='John' />
            )}
            </Form.Item>
          }
          {
            this.state.editTarget === EditableFields.lname &&
            <Form.Item label='Last Name'>
            {getFieldDecorator('lname', {
              rules: [{ required: true, message: 'Last name is required!' }],
            })(
              <Input placeholder='Doe' />
            )}
            </Form.Item>
          }
          {
            this.state.editTarget === EditableFields.phone &&
            <Form.Item label='Phone'>
              {getFieldDecorator('phone', {
                rules: [{ required: true, message: 'Phone number is required!' }],
              })(
                <Input placeholder='989876543210' />
              )}
            </Form.Item>
          }
          {
            this.state.editTarget === EditableFields.dob &&
            <Form.Item label='Phone'>
              {getFieldDecorator('dob', {
                rules: [],
              })(
                <DatePicker format={this.DATE_FORMAT} />
              )}
            </Form.Item>
          }
          {
            this.state.editTarget === EditableFields.email &&
            <Form.Item label='Email'>
            {getFieldDecorator('email', {
              rules: [],
            })(
              <Input placeholder='example@company.com' />
            )}
            </Form.Item>
          }

        </Form>
      );
    });

    return (
      <Row>
        <Modal key={this.props.account._id} visible={this.props.visible} onCancel={this.props.onClose} footer={null}
        afterClose={this.cleanup} className='account-modal nst-modal' width={480} title='Account Info'>
          <Row type='flex' align='middle'>
            <Col span={8}>
            <UserAvatar avatar size={64} user={this.props.account} />
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
              <Button type='toolkit nst-ico ic_pencil_solid_16' onClick={() => this.editField(EditableFields.fname)}></Button>
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
              <Button type='toolkit nst-ico ic_pencil_solid_16' onClick={() => this.editField(EditableFields.lname)}></Button>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <label>User ID</label>
            </Col>
            <Col span={14}>
              @{this.props.account._id}
            </Col>
            <Col span={2}></Col>
          </Row>
          <Row>
            <Col span={8}>
              <label>Status</label>
            </Col>
            <Col span={14}>
              {this.props.account.disabled ? 'Not Active' : 'Active'}
            </Col>
            <Col span={2}></Col>
          </Row>
          <Row>
            <Col span={8}>
              <label>Password</label>
            </Col>
            <Col span={14}>
              <i>Last changed: {this.props.account.last_pass_change}</i>
            </Col>
            <Col span={2}>
              <Button type='toolkit nst-ico ic_more_solid_16' onClick={() => this.editField(EditableFields.dob)}></Button>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <label>Phone Number</label>
            </Col>
            <Col span={14}>
              {this.props.account.phone}
            </Col>
            <Col span={2}>
              <Button type='toolkit nst-ico ic_pencil_solid_16' onClick={() => this.editField(EditableFields.phone)}></Button>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <label>Birthday</label>
            </Col>
            <Col span={14}>
            {
              this.props.account.dob &&
              <span>{this.props.account.dob}</span>
            }
            {
              !this.props.account.dob &&
              <a onClick={() => this.setState({ setDateOfBirth: true })}><i>-click to assign-</i></a>
            }
            </Col>
            <Col span={2}>
              {
                this.props.account.dob &&
                <Button type='toolkit nst-ico ic_pencil_solid_16' onClick={() => this.editField(EditableFields.dob)}></Button>
              }
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <label>Email</label>
            </Col>
            <Col span={14}>
              {
                this.props.account.email &&
                <span>{this.props.account.email}</span>
              }
              {
                !this.props.account.email &&
                <a onClick={() => this.setState({ setEmail: true })}><i>-click to assign-</i></a>
              }
            </Col>
            <Col span={2}>
              {
                this.props.account.email &&
                <Button type='toolkit nst-ico ic_pencil_solid_16' onClick={() => this.editField(EditableFields.email)}></Button>
              }
            </Col>
          </Row>
          <Row>
            <Col span={24}>

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
                <Row className='remove-margin'>
                  <Col span={24}>
                    {memberInPlaces.map((place) => <PlaceItem place={place} key={place._id} />)}
                  </Col>
                </Row>
              }

            </Col>
          </Row>
          <Modal
                key={this.state.uniqueKey}
                title='Edit'
                width={360}
                visible={this.state.showEdit}
                onOk={this.saveEditForm}
                onCancel={() => this.setState({ showEdit: false })}
                footer={[
                  <Button key='cancel' size='large' onClick={() => this.setState({ showEdit: false })}>Cancel</Button>,
                  <Button key='submit' type='primary' size='large' loading={this.state.updateProgress} onClick={() => this.applyChanges(this.form)}>Save</Button>,
                ]}
          >
            <EditForm ref={this.saveForm} {...this.props.account} />
          </Modal>
        </Modal>
      </Row>
    );
  }
}

export default View;
