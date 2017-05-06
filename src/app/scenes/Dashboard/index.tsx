import * as React from 'react';
import {IDispatch} from '~react-redux~redux';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';



interface IAppProps { }

interface IAppState { }

class DashboardComponent extends React.Component<IAppProps, IAppState> {
    static propTypes = {};

    render() {
        return (
            <div>
                Welcome To Nested Dashboard: )
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
)(DashboardComponent);
