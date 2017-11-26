import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import {IcoN} from '../../components/icon/index';

import {Row, Col, Icon, Input, Tabs, Button} from 'antd';


export interface IIntroductionProps {
}

export interface IIntroductionState {
    page: number;
}

class Introduction extends React.Component<IIntroductionProps, IIntroductionState> {
    constructor(props: IIntroductionProps) {
        super(props);
        this.state = {
            page: 1,
        };
    }

    nextPage() {
        if (this.state.page === 2) {
            return 'finish';
        }
        this.setState({
            page: this.state.page + 1,
        });
    }

    // componentDidMount() {}

    render() {

        return (
            <div className='introduction'>
                <div className='boxPage-container'>
                    {this.state.page === 1 && (
                        <div className='gradient-bg frame1'>
                            <h1>Accounts is Your Team Ingredients!</h1>
                            <div className='image'>
                                <IcoN size={24} name='personWire24'/>
                            </div>
                        </div>
                    )}
                    {this.state.page === 2 && (
                        <div className='gradient-bg frame2'>
                            <h1>Places for Fragment Company</h1>
                            <div className='image'>
                                <IcoN size={24} name='placesRelationWire24'/>
                            </div>
                        </div>
                    )}
                    <div className='boxPage-content'>
                        {this.state.page === 1 && (
                            <p>
                                <b>Accounts</b><br/>
                                Now you can create your team accounts. They can send/recieve messages or attachments from each other as secure internal post. Every account have emails too.
                                Also they can create tasks and assigned them to each others for doing projects.
                            </p>
                        )}
                        {this.state.page === 2 && (
                            <p>
                                <b>Places</b><br/>
                                You’ve most powerfull places for communication.
                            </p>
                        )}
                        {this.state.page === 1 && <Button size='large' type=' butn butn-green full-with'>Create Accounts</Button>}
                        {this.state.page === 2 && <Button size='large' type=' butn butn-green full-with'>Create First Grand Place</Button>}
                    </div>
                </div>
                <div className='boxPage-note' onClick={this.nextPage.bind(this)}>
                    Do it Later
                </div>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Introduction);
