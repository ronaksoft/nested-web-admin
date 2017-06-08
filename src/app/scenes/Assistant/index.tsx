import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import * as React from 'react';
import {Row, Col} from 'antd';
import HealthCheck from './components/HealthCheck/index';

export interface IAssistantProps {}

export interface IAssistantState {}

class Assistant extends React.Component < IAssistantProps,
IAssistantState > {
    constructor(props : IAssistantProps) {
        super(props);
    }

    render() {
        return (
            <Row>
                <Col span={24}>
                    <HealthCheck />
                </Col>
            </Row>
        );
    }
}

function mapStateToProps(state : any) {
    return {};
}

function mapDispatchToProps(dispatch : IDispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Assistant);
