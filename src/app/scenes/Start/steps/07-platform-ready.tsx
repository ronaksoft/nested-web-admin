import * as React from 'react';
import {Row, Input, Button} from 'antd';

interface IActivityProps {
    onComplete : () => void;
    domain: string;
}

interface IActivityState {
}

class PlatformReady extends React.Component < IActivityProps,
IActivityState > {
    constructor(props : IActivityProps) {
        super(props);
    }

    render() {
        return (
            <div className='boxPage-content'>
                <h2>“{this.props.domain}” Nested Platform is Ready 👌</h2>
                <p>
                    Setup is completed. Now is time to understand some nested features.
                </p>
                <Button onClick={this.props.onComplete} type=' butn butn-green full-width'>Start</Button>
            </div>
        );
    }

}

export default PlatformReady;
