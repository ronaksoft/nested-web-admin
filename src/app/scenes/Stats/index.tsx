import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';

import {Form, Row, Col, InputNumber, Button, Card, Input, Select, message} from 'antd';
import SystemApi from '../../api/system/index';
import JSONTree from 'react-json-tree';
import './stats.less';

const FormItem = Form.Item;

export interface IConfigProps {
}

export interface IConfigState {
    data: any;
    theme: any;
}

class Stats extends React.Component<IConfigProps, IConfigState> {
    constructor(props: IConfigProps) {
        super(props);
        this.state = {
            data: {},
            theme: {
                scheme: 'monokai',
                author: '',
                base00: '#000000',
                base01: '#383830',
                base02: '#49483e',
                base03: '#75715e',
                base04: '#a59f85',
                base05: '#f8f8f2',
                base06: '#f5f4f1',
                base07: '#f9f8f5',
                base08: '#f92672',
                base09: '#fd971f',
                base0A: '#f4bf75',
                base0B: '#a6e22e',
                base0C: '#a1efe4',
                base0D: '#66d9ef',
                base0E: '#ae81ff',
                base0F: '#cc6633',
              },
        };
    }

    componentDidMount() {
        this.SystemApi = new SystemApi();
        this.GetData();
    }

    GetData() {
        this.SystemApi.getStats().then((result) => {
            // console.log(result);
            this.setState({
                data: result
            });
        }).catch((error) => {
            console.log('error', error);
        });
    }


    render() {
        return (
            <div className='stats-container'>
                <Row type='flex' align='middle' className='scene-head'>
                    <h2>Stats</h2>
                </Row>
                <JSONTree data={this.state.data} theme={this.state.theme}/>
            </div>
        );
    }
}

function mapStateToProps(state: any) {
    return {};
}

function mapDispatchToProps(dispatch: IDispatch) {
    return {};
}


const WrappedTimeRelatedForm = Form.create()(connect(
    mapStateToProps,
    mapDispatchToProps
)(Stats));

export default WrappedTimeRelatedForm;
