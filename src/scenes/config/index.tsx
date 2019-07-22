import _ from 'lodash';
import * as React from 'react';

import SystemApi from '../../api/system/index';
import MessageApi from '../../api/message/index';
import appLoader from '../../components/Loading/app-loading';
import appConfig from '../../config';
import HealthCheck from './components/HealthCheck/index';
import EditMessageModal from './components/EditMessageModal/index';
import AAA from '../../services/classes/aaa/index';
import CONFIG from '../../config';
import AccountApi from '../../api/account';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Button, Grid, Paper, Select, MenuItem, Typography, FormControl } from '@material-ui/core';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Loading from '../../components/Loading';

export interface IConfigProps {
  classes: any;
  enqueueSnackbar: (
    message: React.ReactNode | string,
    options?: any
  ) => string | number | null | undefined;
  closeSnackbar: () => void;
}

export interface IConfigState {
  editMessageModal: boolean;
  data: any;
  stringConstants: any;
  company_logo_universal_id: string;
  token: string;
  disableBtn: boolean;
  imageIsUploading: boolean;
  uploadPercent: number;
  welcomeMessage: any;
  formData: FormData;
}

class Config extends React.Component<IConfigProps, IConfigState> {
  private submitForms: number = 0;
  private SystemApi: SystemApi = new SystemApi();
  private MessageApi: MessageApi = new MessageApi();
  private accountApi: AccountApi = new AccountApi();
  constructor(props: IConfigProps) {
    super(props);
    this.state = {
      data: {},
      uploadPercent: 0,
      stringConstants: {},
      welcomeMessage: {
        subject: '',
        body: '',
      },
      token: '',
      company_logo_universal_id: '',
      disableBtn: true,
      imageIsUploading: false,
      editMessageModal: false,
      formData: {} as FormData,
    };
  }

  componentDidMount() {
    this.GetData();
    this.loadUploadToken();
    appLoader.hide();
  }

  loadUploadToken() {
    this.accountApi.getUploadToken().then(
      (result: any) => {
        this.setState({ token: result.token });
      },
      (error: any) => {
        this.setState({ token: '' });
      }
    );
  }
  GetData() {
    this.SystemApi.getConstants()
      .then((result: any) => {
        this.setState({
          data: result,
        });
      })
      .catch((error: any) => {
        console.log('error', error);
      });
    this.SystemApi.getStringConstants()
      .then((result: any) => {
        this.setState({
          stringConstants: result,
        });
      })
      .catch((error: any) => {
        console.log('error', error);
      });
    this.MessageApi.getMessageTemplate({})
      .then((result: any) => {
        if (result.message_templates.WELCOME_MSG) {
          this.setState({
            welcomeMessage: {
              body: result.message_templates.WELCOME_MSG.body,
              subject: result.message_templates.WELCOME_MSG.subject,
            },
          });
        }
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  }

  SetData(req: any) {
    this.SystemApi.setConstants(req)
      .then((result: any) => {
        this.saveRespons(true);
      })
      .catch((error: any) => {
        this.saveRespons(false, error);
      });
  }

  SetStringConstants(req: any) {
    this.SystemApi.setStringConstants(req)
      .then((result: any) => {
        this.saveRespons(true);
      })
      .catch((error: any) => {
        this.saveRespons(false, error);
      });
  }

  saveRespons(successful: boolean, error?: string) {
    this.submitForms++;
    if (this.submitForms !== 2) {
      return;
    }
    if (successful) {
      this.props.enqueueSnackbar('Your new configs is set', {
        variant: 'success',
      });
      this.setState({
        disableBtn: true,
      });
      this.GetData();
    } else {
      this.props.enqueueSnackbar('Your config not updated !', {
        variant: 'error',
      });
    }
    this.submitForms = 0;
  }

  beforeUpload = () => {
    this.setState({
      uploadPercent: 0,
      imageIsUploading: true,
    });
    if (!this.state.token) {
      return false;
    }
  };

  removeLogo = () => {
    const stringConstants = _.clone(this.state.stringConstants);
    stringConstants.company_logo = '';
    this.setState({
      disableBtn: false,
      stringConstants,
    });
  };

  handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (this.state.imageIsUploading) {
      return this.props.enqueueSnackbar('Wait for uploading finish', {
        variant: 'warning',
      });
    }
    // const model = this.props.form.getFieldsValue();
    //     console.log(model);
    //     let intModel: any = {};
    //     let strModel: any = {};
    //     for (let k in this.state.data) {
    //       if (model[k] !== null) {
    //         intModel[k] = model[k];
    //       }
    //     }
    //     for (const k in this.state.stringConstants) {
    //       strModel[k] = model[k];
    //     }
    //     if (typeof strModel.company_logo === 'object') {
    //       strModel.company_logo = this.state.company_logo_universal_id;
    //     } else {
    //       strModel.company_logo = this.state.stringConstants.company_logo;
    //     }
    //     this.SetData(intModel);
    //     this.SetStringConstants(strModel);
  };

  handleReset = () => {
    this.setState({
      disableBtn: true,
      formData: {} as FormData,
    });
  };

  handleChange = () => {
    this.setState({
      disableBtn: false,
    });
  };

  editWelcomeMessage = () => {
    this.setState({
      editMessageModal: !this.state.editMessageModal,
    });
  };

  submitMessage = (msg: any) => {
    const req = {
      msg_id: 'WELCOME_MSG',
      msg_body: msg.body,
      msg_subject: msg.subject,
    };
    this.MessageApi.setMessageTemplate(req)
      .then((result: any) => {
        this.props.enqueueSnackbar('Welcome message template is set', {
          variant: 'success',
        });
        this.setState({
          welcomeMessage: {
            body: msg.body,
            subject: msg.subject,
          },
        });
        this.GetData();
      })
      .catch((error: any) => {
        this.props.enqueueSnackbar('Welcome message cant be set', {
          variant: 'error',
        });
      });
  };

  checkConfirm = (field: string, key?: string) => (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const mainKey = key || 'data';
    const state: any = {};
    state[mainKey] = this.state[mainKey];
    state[mainKey][field] = event.target.value;
    this.setState(state);
  };

  pickFile = (e: any) => {
    const that = this;
    const file = e.target.files.item(0);
    const imageType = /^image\//;

    if (!file || !imageType.test(file.type)) {
      return;
    }
    const formData = new FormData();
    formData.append('blob', file, file.name);
    const credentials = AAA.getInstance().getCredentials();
    const xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      `${CONFIG().STORE.URL}/upload/place_pic/${credentials.sk}/${this.state.token}`,
      true
    );

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    // xhr.setRequestHeader('Access-Control-Allow-Origin', location.host);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const resp = JSON.parse(xhr.response);
        that.setState({
          company_logo_universal_id: resp.data.files[0].universal_id,
          imageIsUploading: false,
          uploadPercent: 0,
        });
      }
    };
    xhr.send(formData);
  };

  pictureChange = (info: any) => {
    if (info.event && info.event.percent) {
      this.setState({
        uploadPercent: parseInt(info.event.percent.toFixed(2)),
      });
    }
    if (info.file.status === 'done') {
      this.setState({
        company_logo_universal_id: info.file.response.data.files[0].universal_id,
        imageIsUploading: false,
        uploadPercent: 0,
      });
    } else if (info.file.status === 'error') {
      this.props.enqueueSnackbar(`${info.file.name} file upload failed.`, {
        variant: 'error',
      });
    }
  };
  // saveForm = (form) => this.form = form;

  render() {
    const { classes } = this.props;
    const logo =
      this.state.company_logo_universal_id.length > 0
        ? this.state.company_logo_universal_id
        : this.state.stringConstants.company_logo;
    const imageUrl = `${CONFIG().STORE.URL}/view/x/${logo}`;
    // TOOD upload image
    const defaults = appConfig();
    return (
      <>
        <EditMessageModal
          messageChange={this.submitMessage}
          onClose={this.editWelcomeMessage}
          visible={this.state.editMessageModal}
          message={this.state.welcomeMessage}
        />
        {Object.keys(this.state.data).length === 0 ||
          (Object.keys(this.state.stringConstants).length === 0 && (
            <Loading active={true} position="absolute" />
          ))}
        {Object.keys(this.state.data).length > 0 &&
          Object.keys(this.state.stringConstants).length > 0 && (
            <ValidatorForm onSubmit={this.handleSubmit} className="system-config">
              <div className="scene-head">
                <Typography className="page-head" variant="h5" component="h2">
                  System
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  className="button-margin"
                  disabled={this.state.disableBtn}
                  onClick={this.handleReset}
                >
                  Discard
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={this.state.disableBtn}
                  onClick={this.handleSubmit}
                  type="submit"
                >
                  Apply
                </Button>
              </div>
              <Grid container={true} spacing={5}>
                <Grid item={true} xs={6}>
                  <Paper className={classes.card}>
                    <Typography variant="h6" component="h3">
                      Account Policies
                    </Typography>
                    <ul>
                      <li>
                        <FormControl className={classes.option}>
                          <label htmlFor="register_mode">Account Register Mode</label>
                          <div className="filler" />
                          <Select
                            id={'register_mode'}
                            value={this.state.data.register_mode}
                            style={{ width: 200 }}
                            onChange={this.checkConfirm('register_mode')}
                          >
                            <MenuItem value="" disabled={true}>
                              {this.state.data.register_mode === 2 ? 'Admin only' : 'Everyone'}
                            </MenuItem>
                            <MenuItem value={2}>Admin only</MenuItem>
                            <MenuItem value={1}>Everyone</MenuItem>
                          </Select>
                        </FormControl>
                        <p className={classes.aside}>
                          In this mode only you or another admin could create accounts.
                        </p>
                      </li>
                      <li>
                        <div className={classes.option}>
                          <label>
                            Default Maximum Grand Places that each account could create:
                          </label>
                          <div className="filler" />
                          <TextValidator
                            type="number"
                            value={this.state.data.account_grandplaces_limit}
                            onChange={this.checkConfirm('account_grandplaces_limit')}
                            required={true}
                            validators={[
                              'required',
                              `minNumber:${defaults.DEFAULT_ACCOUNT_MIN_GRAND_PLACES}`,
                              `maxNumber:${defaults.DEFAULT_ACCOUNT_MAX_GRAND_PLACES}`,
                            ]}
                            errorMessages={[
                              'Required!',
                              'it must be grather than ' +
                                defaults.DEFAULT_ACCOUNT_MIN_GRAND_PLACES,
                              'it must be lower than ' + defaults.DEFAULT_ACCOUNT_MAX_GRAND_PLACES,
                            ]}
                          />
                        </div>
                        <p className={classes.aside}>
                          Changes will be applied for new accounts only.
                        </p>
                      </li>
                    </ul>
                  </Paper>
                  <Paper className={classes.card}>
                    <Typography variant="h6" component="h3">
                      Place Policies
                    </Typography>
                    <ul>
                      <li>
                        <div className={classes.option}>
                          <label>Maximum Place Members</label>
                          <div className="filler" />
                          <TextValidator
                            type="number"
                            value={this.state.data.place_max_keyholders}
                            onChange={this.checkConfirm('place_max_keyholders')}
                            required={true}
                            validators={[
                              'required',
                              `minNumber:${defaults.DEFAULT_PLACE_MIN_KEYHOLDERS}`,
                              `maxNumber:${defaults.DEFAULT_PLACE_MAX_KEYHOLDERS}`,
                            ]}
                            errorMessages={[
                              'Required!',
                              'it must be grather than ' + defaults.DEFAULT_PLACE_MIN_KEYHOLDERS,
                              'it must be lower than ' + defaults.DEFAULT_PLACE_MAX_KEYHOLDERS,
                            ]}
                          />
                        </div>
                      </li>
                      <li>
                        <div className={classes.option}>
                          <label>Maximum Place Managers</label>
                          <div className="filler" />
                          <TextValidator
                            type="number"
                            value={this.state.data.place_max_creators}
                            onChange={this.checkConfirm('place_max_creators')}
                            required={true}
                            validators={[
                              'required',
                              `minNumber:${defaults.DEFAULT_PLACE_MIN_CREATORS}`,
                              `maxNumber:${defaults.DEFAULT_PLACE_MAX_CREATORS}`,
                            ]}
                            errorMessages={[
                              'Required!',
                              'it must be grather than ' + defaults.DEFAULT_PLACE_MIN_CREATORS,
                              'it must be lower than ' + defaults.DEFAULT_PLACE_MAX_CREATORS,
                            ]}
                          />
                        </div>
                      </li>
                      <li>
                        <div className={classes.option}>
                          <label>Default Maximum Sub-Places:</label>
                          <div className="filler" />
                          <TextValidator
                            type="number"
                            value={this.state.data.place_max_children}
                            onChange={this.checkConfirm('place_max_children')}
                            required={true}
                            validators={[
                              'required',
                              `minNumber:${defaults.DEFAULT_PLACE_MIN_CHILDREN}`,
                              `maxNumber:${defaults.DEFAULT_PLACE_MAX_CHILDREN}`,
                            ]}
                            errorMessages={[
                              'Required!',
                              'it must be grather than ' + defaults.DEFAULT_PLACE_MIN_CHILDREN,
                              'it must be lower than ' + defaults.DEFAULT_PLACE_MAX_CHILDREN,
                            ]}
                          />
                        </div>
                        <p>
                          Changes will be applied for new places only. You can change it for each
                          place seperatly in Place Settings.
                        </p>
                      </li>
                      <li>
                        <div className={classes.option}>
                          <label>Maximum Place Childrens Level</label>
                          <div className="filler" />
                          <TextValidator
                            type="number"
                            value={this.state.data.place_max_level}
                            onChange={this.checkConfirm('place_max_level')}
                            required={true}
                            validators={[
                              'required',
                              `minNumber:${defaults.DEFAULT_PLACE_MIN_LEVELS}`,
                              `maxNumber:${defaults.DEFAULT_PLACE_MAX_LEVELS}`,
                            ]}
                            errorMessages={[
                              'Required!',
                              'it must be grather than ' + defaults.DEFAULT_PLACE_MIN_LEVELS,
                              'it must be lower than ' + defaults.DEFAULT_PLACE_MAX_LEVELS,
                            ]}
                          />
                        </div>
                      </li>
                    </ul>
                  </Paper>
                  <Paper className={classes.card}>
                    <Typography variant="h6" component="h3">
                      Label Policies
                    </Typography>
                    <ul>
                      <li>
                        <div className={classes.option}>
                          <label>Maximum Label Members</label>
                          <div className="filler" />
                          <TextValidator
                            type="number"
                            value={this.state.data.label_max_members}
                            onChange={this.checkConfirm('label_max_members')}
                            required={true}
                            validators={[
                              'required',
                              `minNumber:${defaults.DEFAULT_LABEL_MIN_MEMBERS}`,
                              `maxNumber:${defaults.DEFAULT_LABEL_MAX_MEMBERS}`,
                            ]}
                            errorMessages={[
                              'Required!',
                              'it must be grather than ' + defaults.DEFAULT_LABEL_MIN_MEMBERS,
                              'it must be lower than ' + defaults.DEFAULT_LABEL_MAX_MEMBERS,
                            ]}
                          />
                        </div>
                      </li>
                    </ul>
                  </Paper>
                  <Paper className={classes.card}>
                    <Typography variant="h6" component="h3">
                      Health Check
                    </Typography>
                    <ul>
                      <li>
                        <HealthCheck />
                      </li>
                    </ul>
                  </Paper>
                </Grid>
                <Grid item={true} xs={6}>
                  <Paper className={classes.card}>
                    <Typography variant="h6" component="h3">
                      System Messages
                    </Typography>
                    <ul>
                      <li>
                        <div className={classes.option}>
                          <label>Welcome Message</label>
                          <div className="filler" />
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={this.editWelcomeMessage}
                          >
                            Edit
                          </Button>
                        </div>
                        <p className={classes.aside}>
                          New accounts receive this message automatically at their first login.
                        </p>
                      </li>
                    </ul>
                  </Paper>
                  <Paper className={classes.card}>
                    <Typography variant="h6" component="h3">
                      Post Limits
                    </Typography>
                    <ul>
                      <li>
                        <div className={classes.option}>
                          <label>Maximum Attachments per Post</label>
                          <div className="filler" />
                          <TextValidator
                            type="number"
                            required={true}
                            value={this.state.data.post_max_attachments}
                            onChange={this.checkConfirm('post_max_attachments')}
                            validators={[
                              'required',
                              `minNumber:${defaults.DEFAULT_POST_MIN_ATTACHMENTS}`,
                              `maxNumber:${defaults.DEFAULT_POST_MAX_ATTACHMENTS}`,
                            ]}
                            errorMessages={[
                              'Required!',
                              'it must be grather than ' + defaults.DEFAULT_POST_MIN_ATTACHMENTS,
                              'it must be lower than ' + defaults.DEFAULT_POST_MAX_ATTACHMENTS,
                            ]}
                          />
                        </div>
                      </li>
                      <li>
                        <div className={classes.option}>
                          <label>Maximum Post Destinations</label>
                          <div className="filler" />
                          <TextValidator
                            type="number"
                            value={this.state.data.post_max_targets}
                            onChange={this.checkConfirm('post_max_targets')}
                            required={true}
                            validators={[
                              'required',
                              `minNumber:${defaults.DEFAULT_POST_MIN_TARGETS}`,
                              `maxNumber:${defaults.DEFAULT_POST_MAX_TARGETS}`,
                            ]}
                            errorMessages={[
                              'Required!',
                              'it must be grather than ' + defaults.DEFAULT_POST_MIN_TARGETS,
                              'it must be lower than ' + defaults.DEFAULT_POST_MAX_TARGETS,
                            ]}
                          />
                        </div>
                      </li>
                      <li>
                        <div className={classes.option}>
                          <label>Maximum Post Labels</label>
                          <div className="filler" />
                          <TextValidator
                            type="number"
                            value={this.state.data.post_max_labels}
                            onChange={this.checkConfirm('post_max_labels')}
                            required={true}
                            validators={[
                              'required',
                              `minNumber:${defaults.DEFAULT_POST_MIN_LABELS}`,
                              `maxNumber:${defaults.DEFAULT_POST_MAX_LABELS}`,
                            ]}
                            errorMessages={[
                              'Required!',
                              'it must be grather than ' + defaults.DEFAULT_POST_MIN_LABELS,
                              'it must be lower than ' + defaults.DEFAULT_POST_MAX_LABELS,
                            ]}
                          />
                        </div>
                      </li>
                      <li>
                        <FormControl className={classes.option}>
                          <label htmlFor="retract_time_select">
                            Maximum Post Retract Time (hours)
                          </label>
                          <div className="filler" />
                          <Select
                            id={'retract_time_select'}
                            value={this.state.data.post_retract_time}
                            style={{ width: 200 }}
                            onChange={this.checkConfirm('post_retract_time')}
                          >
                            <MenuItem value={3600000}>1</MenuItem>
                            <MenuItem value={21600000}>6</MenuItem>
                            <MenuItem value={43200000}>12</MenuItem>
                            <MenuItem value={86400000}>24</MenuItem>
                          </Select>
                        </FormControl>
                      </li>
                    </ul>
                  </Paper>
                  <Paper className={classes.card}>
                    <Typography variant="h6" component="h3">
                      Company information
                    </Typography>
                    <ul>
                      <li>
                        <div className={classes.option}>
                          <label>Name</label>
                          <div className="filler" />
                          <TextValidator
                            value={this.state.stringConstants.company_name}
                            required={true}
                            validators={['required']}
                            onChange={this.checkConfirm('company_name', 'stringConstants')}
                            errorMessages={['Required!']}
                          />
                        </div>
                      </li>
                      <li>
                        <div className={classes.option}>
                          <label>Your Company Description</label>
                          <div className="filler" />
                          <TextValidator
                            value={this.state.stringConstants.company_desc}
                            onChange={this.checkConfirm('company_desc', 'stringConstants')}
                            required={true}
                            fullWidth={true}
                            multiline={true}
                            validators={['required']}
                            errorMessages={['Required!']}
                          />
                        </div>
                      </li>
                      <li>
                        <div className={classes.option}>
                          <label>Logo</label>
                          <input
                            hidden={true}
                            onChange={this.pickFile}
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="file"
                            type="file"
                          />
                          <div className="filler" />
                          {this.state.stringConstants.company_logo &&
                            this.state.stringConstants.company_logo !== '' && (
                              <Button
                                className="button-margin"
                                variant="outlined"
                                color="secondary"
                                onClick={this.removeLogo}
                              >
                                {' '}
                                remove image{' '}
                              </Button>
                            )}
                          {/* <div
                              className="progress-bar"
                              style={{ width: this.state.uploadPercent + '%' }}
                            /> */}
                          <Button variant="contained" color="primary" className="button-margin">
                            <label htmlFor="file">Select image</label>
                          </Button>
                          {this.state.stringConstants.company_logo &&
                            this.state.stringConstants.company_logo !== '' && (
                              <img
                                className="comapny-logo"
                                alt="logo"
                                src={imageUrl}
                                width={40}
                                height={40}
                              />
                            )}
                        </div>
                      </li>
                      <li>
                        <FormControl className={classes.option}>
                          <label htmlFor="system_lang">System default language</label>
                          <div className="filler" />
                          <Select
                            id={'system_lang'}
                            value={this.state.stringConstants.system_lang}
                            style={{ width: 200 }}
                            onChange={this.checkConfirm('system_lang', 'stringConstants')}
                          >
                            <MenuItem value="en">EN</MenuItem>
                            <MenuItem value="fa">FA</MenuItem>
                          </Select>
                        </FormControl>
                      </li>
                      <li>
                        <div className={classes.option}>
                          <label>Magic number</label>
                          <div className="filler" />
                          <TextValidator
                            type="number"
                            onChange={this.checkConfirm('magic_number', 'stringConstants')}
                            validators={['required']}
                            errorMessages={['Required!']}
                            value={this.state.stringConstants.magic_number}
                            helperText="You can register with this number more than once."
                          />
                        </div>
                      </li>
                    </ul>
                  </Paper>
                </Grid>
              </Grid>
            </ValidatorForm>
          )}
      </>
    );
  }
}

export default withStyles((theme: Theme) =>
  createStyles({
    card: {
      position: 'relative',
      '& h3': {
        color: fade(theme.palette.text.primary, 0.8),
        fontSize: '16px',
        fontWeight: 700,
        padding: theme.spacing(0, 2),
        lineHeight: '64px',
      },
      '& ul': {
        listStyle: 'none',
        margin: 0,
        padding: theme.spacing(0, 0, 0, 2),
      },
      '& li': {
        borderBottom: `1px solid ${fade(theme.palette.text.primary, 0.08)}`,
        paddingRight: '16px',
        marginBottom: '16px',
        paddingBottom: '24px',
      },
    },
    option: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      '& > label': {
        display: 'flex',
        flex: 'none',
        paddingRight: theme.spacing(2),
        color: '#323d47',
        fontSize: '16px',
        marginBottom: 0,
      },
    },
    aside: {
      color: fade(theme.palette.text.primary, 0.64),
      fontSize: '13px',
      marginTop: '0',
      marginBottom: '16px',
    },
  })
)(withSnackbar(Config));
