import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {IStore} from '~react-redux~redux';
import {Provider} from 'react-redux';
import App from './app/scenes/index';
import configureStore from './app/services/store/configureStore';
import {Router, Route, browserHistory} from 'react-router';


// import Components
import StaticPages from './app/scenes/StaicPages/index';
import NotFoundPage from './app/scenes/StaicPages/scense/404/index';
import ForbiddenPage from './app/scenes/StaicPages/scense/403/index';
import Dashboard from './app/scenes/Dashboard/index';
import Accounts from './app/scenes/Accounts/index';
import Places from './app/scenes/Places/index';
import Create from './app/scenes/Accounts/components/Create/Form/index';


const store: IStore<any> = configureStore({});

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path='/' component={App}>
                <Route path='/dashboard' component={Dashboard}/>
                <Route path='/accounts' component={Accounts}/>
                <Route path='/create' component={Create}/>
                <Route path='/places' component={Places}/>
            </Route>
            <Route component={StaticPages}>
                <Route path='/404' component={NotFoundPage}/>
                <Route path='/403' component={ForbiddenPage}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);
