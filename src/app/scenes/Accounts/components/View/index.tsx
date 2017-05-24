import * as React from 'react';
import {Modal, Row, Col, Spin, Button, Form, Input, notification, DatePicker, Upload, Icon, message} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import md5 from 'md5';
import PlaceItem from '../../../../components/PlaceItem/index';
import IPerson from '../../interfaces/IPerson';
import PlaceApi from '../../../../api/place/index';
import AccountApi from '../../../../api/account/account';
import UserAvatar from '../../../../components/avatar/index';
import EditableFields from './EditableFields';
import CONFIG from '../../../../../app.config';
import AAA from './../../../../services/classes/aaa/index';

interface IViewProps {
  visible: boolean;
  account: IPerson;
  onChange: (user: IPerson) => void;
  onClose: () => void;
}

interface IViewState {
  setEmail: boolean;
  setDateOfBirth: boolean;
  account: IPerson;
  token: string;
}

class View extends React.Component<IViewProps, IViewState> {
  DATE_FORMAT: string = 'YYYY-MM-DD';
  constructor(props: IViewProps) {
    super(props);
    this.state = {
      setEmail: false,
      setDateOfBirth: false,
      account: props.account
    };

    this.loadPlaces = this.loadPlaces.bind(this);
    this.editField = this.editField.bind(this);
    this.applyChanges = this.applyChanges.bind(this);
    this.pictureChange = this.pictureChange.bind(this);
    this.loadUploadToken = this.loadUploadToken.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.removePicture = this.removePicture.bind(this);
  }

  componentDidMount() {
    this.placeApi = new PlaceApi();
    this.accountApi = new AccountApi();

    if (this.state.account && this.state.account._id) {
      this.loadPlaces(this.state.account._id);
    }

    this.loadUploadToken();
  }

  componentWillReceiveProps(nextProps : IViewProps) {
    if (nextProps.account && nextProps.account._id && nextProps.account._id !== this.state.account._id) {
      this.setState({ account: nextProps.account, places: [] });
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
      this.setState({
        places: [],
        loading: false
      });
    });
  }

  loadUploadToken() {
    this.accountApi.getUploadToken().then((result) => {
      this.setState({
        token: result.token
      });
    }, (error) => {
      this.setState({
        token: null
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
    form.validateFields((errors, values) => {
      const errors = _(errors).map((value, key) => value.errors).flatten().value();
      if (_.size(errors) > 0) {
        return;
      }

      const changedProps = _.mapValues(values, (value, key) => {
        if (key === 'dob') {
          return value.format(this.DATE_FORMAT);
        }

        return value;
      });
      if (_.has(changedProps, 'pass')) {
        this.accountApi.setPassword({
          account_id: this.state.account._id,
          new_pass: md5(changedProps.pass)
        }).then((result) => {
          this.setState({
            updateProgress: false,
            showEdit: false,
          });

          message.success('The account password has been changed successfully.');
        }, (error) => {
          this.setState({
            updateProgress: false
          });

          notification.error({
            message: 'Update Error',
            description: 'An error happened while trying to set a new password.'
          });
        });
      } else {
        let editedAccount = _.clone(this.state.account);

        this.setState({
          updateProgress: true,
          account: _.merge(editedAccount, changedProps)
        });


        this.accountApi.edit(_.merge(changedProps, { account_id: this.state.account._id })).then((result) => {
          this.setState({
            updateProgress: false,
            showEdit: false,
          });
          this.props.onChange(editedAccount);
        }, (error) => {
          this.setState({
            updateProgress: false
          });
          notification.error({
            message: 'Update Error',
            description: 'We were not able to update the field!'
          });
        });
      }
    });
  }

  saveForm = (form) => this.form = form;

  removePicture() {
    this.accountApi.removePicture({
      account_id: this.state.account._id
    }).then((result) => {
      let editedAccount = _.clone(this.state.account);
      editedAccount.picture = {};
      this.setState({
        account: editedAccount
      });
      this.props.onChange(editedAccount);
    }).catch((error) => {
      notification.error({
        message: 'Update Error',
        description: 'An error has occured while removing the account picture.'
      });
    });
  }

  pictureChange(info: any) {
    if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      return;
    }

    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);

      this.accountApi.setPicture({
        account_id: this.state.account._id,
        universal_id: info.file.response.data[0].universal_id
      }).then((result) => {
        let editedAccount = _.clone(this.state.account);
        editedAccount.picture = info.file.response.data[0].thumbs;
        this.setState({
          account: editedAccount
        });
        this.props.onChange(editedAccount);
      }, (error) => {
        notification.error({
          message: 'Update Error',
          description: 'We were not able to set the picture!'
        });
      });
    }
  }

  beforeUpload(file: any, fileList: any) {
    if (!this.state.token) {
      notification.error({
        message: 'Error',
        description: 'We are not able to upload the picture.'
      });
      return false;
    }
  }

  render() {
    const managerInPlaces = _.filter(this.state.places, (place) => _.includes(place.access, 'C'));
    const memberInPlaces = _.differenceBy(this.state.places, managerInPlaces, '_id');

    const EditForm = Form.create({
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
        <Form onSubmit={() => this.applyChanges(this.form)}>
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
            <Form.Item label='Birthdate'>
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
          {
            this.state.editTarget === EditableFields.pass &&
            <Form.Item label='Password'>
              {getFieldDecorator('pass', {
                rules: [
                  { required: true, message: 'Password is required!' },
                  { min: 6, message: 'Password must be more than 6 characters.' }
                ],
              })(
                <Input placeholder='New password' />
              )}
            </Form.Item>
          }

        </Form>
      );
    });
    const accountClone = _.clone(this.state.account);
    const credentials = AAA.getInstance().getCredentials();
    const uploadUrl = `${CONFIG.STORE.URL}/upload/profile_pic/${credentials.sk}/${this.state.token}`;
    return (
      <Row>
        <Modal key={this.state.account._id} visible={this.props.visible} onCancel={this.props.onClose} footer={null}
        afterClose={this.cleanup} className='account-modal nst-modal' width={480} title='Account Info'>
          <Row type='flex' align='top'>
            <Col span={8}>
              <UserAvatar avatar size={64} user={this.state.account} />
            </Col>
            <Col span={8}>
              {
                this.state.token &&
                <Upload
                        name='avatar'
                        action={uploadUrl}
                        accept='image/*'
                        onChange={this.pictureChange}
                        beforeUpload={this.beforeUpload}
                        >
                          <a className='change-photo' onClick={this.changePhoto}>Change Photo</a>
                </Upload>
              }
            </Col>
            <Col span={8}>
              {
                this.state.account.picture && this.state.account.picture.org &&
                <a className='remove-photo' onClick={this.removePicture}>Remove Photo</a>
              }
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <label>First Name</label>
            </Col>
            <Col span={14}>
              <b>{this.state.account.fname}</b>
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
              <b>{this.state.account.lname}</b>
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
              @{this.state.account._id}
            </Col>
            <Col span={2}></Col>
          </Row>
          <Row>
            <Col span={8}>
              <label>Status</label>
            </Col>
            <Col span={14}>
              {this.state.account.disabled ? 'Not Active' : 'Active'}
            </Col>
            <Col span={2}></Col>
          </Row>
          <Row>
            <Col span={8}>
              <label>Password</label>
            </Col>
            <Col span={14}>
              <i>●●●●●●●●</i>
            </Col>
            <Col span={2}>
              <Button type='toolkit nst-ico ic_more_solid_16' onClick={() => this.editField(EditableFields.pass)}></Button>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <label>Phone Number</label>
            </Col>
            <Col span={14}>
              {this.state.account.phone}
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
              this.state.account.dob &&
              <span>{this.state.account.dob}</span>
            }
            {
              !this.state.account.dob &&
              <a onClick={() => this.editField(EditableFields.dob)}><i>-click to assign-</i></a>
            }
            </Col>
            <Col span={2}>
              {
                this.state.account.dob &&
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
                this.state.account.email &&
                <span>{this.state.account.email}</span>
              }
              {
                !this.state.account.email &&
                <a onClick={() => this.editField(EditableFields.email)}><i>-click to assign-</i></a>
              }
            </Col>
            <Col span={2}>
              {
                this.state.account.email &&
                <Button type='toolkit nst-ico ic_pencil_solid_16' onClick={() => this.editField(EditableFields.email)}></Button>
              }
            </Col>
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
                <Row className='remove-margin'>
                  <Col span={24}>
                    {memberInPlaces.map((place) => <PlaceItem place={place} key={place._id} />)}
                  </Col>
                </Row>
              }
          <Modal
                key={this.props.account._id}
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
            <EditForm ref={this.saveForm} {...accountClone} />
          </Modal>
        </Modal>
      </Row>
    );
  }
}

export default View;
