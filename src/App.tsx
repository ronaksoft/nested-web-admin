import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {IStore} from '~react-redux~redux';
import {Provider} from 'react-redux';
import App from './app/scenes/index';
import configureStore from './app/services/store/configureStore';
import {Router, Route, browserHistory} from 'react-router';


// import Components
import Dashboard from './app/scenes/Dashboard/index';


const store: IStore<any> = configureStore({});

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/accounts' component={Dashboard} />
        <Route path='/places' component={Dashboard} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
