import * as React from 'react';
import {Card, Button, Row, Col, Alert} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import SystemApi from '../../../../api/system/index';

interface IHealthCheckProps {}

interface IHealthCheckState {}

const LAST_HEALTH_CHECK_KEY: string = 'ronak.nested.admin.assistant.health_check';

class HealthCheck extends React.Component < IHealthCheckProps,
IHealthCheckState > {
    constructor(props : IHealthCheckProps) {
        super(props);
        this.state = {
            loading: true
        };

        this.run = this.run.bind(this);
        this.checkStatusInterval = null;
    }

    componentDidMount() {
        this.setState({ last: this.getLast() });
        this.systemApi = new SystemApi();
        this.load().then(() => {
            this.setState({ loading: false });
            this.checkStatusInterval = setInterval(() => {
                this.load();
            }, 6000);
        }, () => {
            this.setState({loading: false});
        });
    }

    componentWillUnmount() {
        if (this.checkStatusInterval) {
            clearInterval(this.checkStatusInterval);
        }
    }

    render() {
        return (
            <Card title='Health Check'>
                <Row>
                    <Col span={12}>
                        <Row style={{marginBottom: 16}}>
                            <Col span={24}>
                                <p>Health check is designed to fix any possible errors.</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Button size='large' icon='play-circle' loading={this.state.isRunning} onClick={this.run}>Run</Button>
                            </Col>
                            <Col span={12}>
                            {
                                this.state.last &&
                                <p>Last Run: <b>{this.state.last.format('dddd, MMMM Do YYYY, h:mm:ss a')}</b></p>
                            }
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Alert  message='Notes'
                                description='It is recommended to run this job during nights or while your server is not busy. Please note that it takes several minutes and you will be notified once the job has been completed.'
                                type='info'
                                showIcon/>
                    </Col>
                </Row>
            </Card>
        );
    }

    run() {

        this.setState({progress: true});

        return this.systemApi.runHealthCheck().then((response) => {
            const now = moment();
            this.setState({progress: false, isRunning: true, last: now});
            this.setLast(now);
        }, (error) => {
            this.setState({progress: false, isRunning: false});
        });
    }

    private load(period : string) {
        return this.systemApi.getHealthCheckState().then((response) => {
            this.setState({isRunning: response.running_health_check});
        });
    }

    private setLast(date: moment) {
        window.localStorage.setItem(LAST_HEALTH_CHECK_KEY, date.format('x'));
    }

    private getLast() {
        const last = window.localStorage.getItem(LAST_HEALTH_CHECK_KEY);
        if (!last) {
            return null;
        }

        const lastMoment = moment(Number(last));
        if (!lastMoment.isValid()) {
            return null;
        }

        return lastMoment;
    }
}

export default HealthCheck;
