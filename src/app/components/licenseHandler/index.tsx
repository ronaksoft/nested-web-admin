import * as React from 'react';
import {Card, Icon, Tooltip, Modal, Button, Input, message} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import SystemApi from '../../api/system/index';
import {IcoN} from '../icon/index';

interface ILicenceProps {
}

interface ILicenceState {
    license: any;
    loading: boolean;
    hash: string;
    licenseModal: boolean;
}

class Licence extends React.Component<ILicenceProps, ILicenceState> {
    SystemApi: any;
    constructor(props: ILicenceProps) {
        super(props);

        this.state = {
            loading: true,
            hash: '',
            licenseModal: false,
            license: {},
        };

    }

    componentDidMount() {
        this.SystemApi = new SystemApi();
        this.GetLicense();
    }

    GetLicense() {

        this.SystemApi.getLicense().then((result) => {
            this.setState({
                license: result.license,
                loading: false
            });
        }).catch((error) => {
            console.log('error', error);
        });
    }

    setLicense = () => {
        if (!this.state.hash) {
            return;
        }
        this.SystemApi.setLicense(this.state.hash).then((result) => {
            message.success(`Congratulations, your license is updated.`);
            this.GetLicense();
            this.toggleSetLicenseModal();
        }).catch((error) => {
            if (error.err_code === 4) {
                message.warning(`You hash code is wrong!`);
            }
            console.log('error', error);
        });
    }

    toggleSetLicenseModal = () => {
        this.setState({
            licenseModal: !this.state.licenseModal,
        });
    }

    updateHash = (e) => {
        this.setState({
            hash: e.currentTarget.value
        });
    }

    render() {
        const {license} = this.state;
        const remainLicense = license.expire_date ? moment.duration(moment(license.expire_date).diff(moment(new Date()))).asDays().toFixed() : 0;
        return (
            <Card title='Nested Service License' loading={this.state.loading} extra={
                <div>
                    <Tooltip placement='top' title='Set License'>
                        <a rel='noopener noreferrer' onClick={this.toggleSetLicenseModal}><IcoN size={16} name='cross16'/></a>
                    </Tooltip>
                </div>
            } className='chart-card license-card' style={{height: '334px'}}>
            <span className={remainLicense < 30 ? 'warn' : 'good'}><b>Remaining License Time: </b>{remainLicense} days</span>
            <span><b>License organization: </b>{license.owner_organization}</span>
            <span><b>License Owner: </b>{license.owner_name} {'<' + license.owner_email + '>'}</span>
            <span><b>License id: </b>{license.license_id}</span>
            <span><b>License signature: </b>{license.signature}</span>
            <span><b>Max active users: </b>{license.max_active_users ? license.max_active_users : 'unlimited'}</span>
            <Modal
                title='Set License'
                width={360}
                visible={this.state.licenseModal}
                onOk={this.saveEditForm}
                onCancel={() => this.setState({licenseModal: false})}
                footer={[
                    <Button key='cancel' size='large'
                            onClick={() => this.setState({licenseModal: false})}>Cancel</Button>,
                    <Button key='submit' type='primary' size='large'
                            onClick={this.setLicense}>Save</Button>,
                ]}
            >
                <div>
                    <label>Put your license hash string here and press save buton</label>
                    <Input type='text' value={this.state.hash}
                        onChange={this.updateHash}
                        size='large' placeholder='License hash code.'/>
                </div>
            </Modal>
            </Card>
        );
    }
}

export default Licence;
