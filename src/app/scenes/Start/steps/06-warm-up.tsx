import { type } from 'os';
import * as React from 'react';
import {Row, Input, Button} from 'antd';
import {Loading} from '../../../components/Loading/index';

interface IActivityProps {
    domain: string;
}

interface IActivityState {
}

class WarmUp extends React.Component < IActivityProps,
IActivityState > {
    constructor(props : IActivityProps) {
        super(props);
    }

    render() {
        return (
            <div className='boxPage-content'>
                {/* <h2>Warm-up “{this.props.domain}” Nested Platform</h2> */}
                <p>
                    Drink some coffee or beer! It's maybe took up 5 minutes!
                </p>
                <Row type='flex' justify='center'>
                    <Loading active={true}/>
                </Row>
            </div>
        );
    }

}

export default WarmUp;
