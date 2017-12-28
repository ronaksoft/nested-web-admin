import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {IStore} from '~react-redux~redux';
import {Provider} from 'react-redux';
import App from './app/scenes/index';
import infoBoxes from './app/scenes/index';
import configureStore from './app/services/store/configureStore';
import {Router, Route, browserHistory, IndexRoute, Redirect, hashHistory} from 'react-router';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

// import Components
import StaticPages from './app/scenes/StaicPages/index';
import BoxPages from './app/scenes/BoxPages/index';
import NotFoundPage from './app/scenes/StaicPages/scense/404/index';
import ForbiddenPage from './app/scenes/StaicPages/scense/403/index';
import SignInPage from './app/scenes/StaicPages/scense/Signin/index';
import Introduction from './app/scenes/Introduction/index';
import Start from './app/scenes/Start/index';
import Dashboard from './app/scenes/Dashboard/index';
import Accounts from './app/scenes/Accounts/index';
import Places from './app/scenes/Places/index';
import Config from './app/scenes/Config/index';
import Charts from './app/scenes/Charts/index';
import Stats from './app/scenes/Stats/index';

const store: IStore<any> = configureStore({});

ReactDOM.render(
    <LocaleProvider locale={enUS}>
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path='/' component={App}>
                    <IndexRoute component={Dashboard}/>
                    <Route path='/dashboard' component={Dashboard}/>
                    <Route path='/accounts' component={Accounts}/>
                    <Route path='/places' component={Places}/>
                    <Route path='/config' component={Config}/>
                    <Route path='/charts' component={Charts}/>
                    <Route path='/stats' component={Stats}/>
                </Route>
                {/* <Route component={BoxPages}>
                    <Route path='/intro' component={Introduction}/>
                    <Route path='/start' component={Start}/>
                </Route> */}
                <Route component={StaticPages}>
                    <Route path='/404' component={ForbiddenPage}/>
                    <Route path='/signin' component={SignInPage}/>
                    <Route path='*' component={NotFoundPage} />
                </Route>
                <Redirect from='*' to='/404' />
            </Router>
        </Provider>
    </LocaleProvider>,
    document.getElementById('root')
);
