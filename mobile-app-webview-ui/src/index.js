// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();


import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {injectGlobal} from 'styled-components';

// Boilerplate:
// import './index.css';

// "There are only two hard things in Computer Science: cache invalidation and naming things." --Phil Karlton
import {unregister} from './registerServiceWorker'; // TODO do we really want to unregister it?
// import registerServiceWorker from './registerServiceWorker'; //TODO dis instead

// Redux-synchronized router:
// import { ConnectedRouter } from 'react-router-redux';
import {BrowserRouter as Router} from 'react-router-dom';

// Routing-aware redux store:
import {store} from './store';

// Theme providers:
import {ThemeProvider} from 'styled-components';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {muiTheme, styledComponentsTheme} from './theme';

import Layout from './components/Layout';

// Inject reboot.css as a global style:
import './reboot.css';

// Pages:
import Routes from './components/Routes';

injectGlobal`
  @import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500);
  @import url(https://use.fontawesome.com/releases/v5.2.0/css/all.css);

  body {
    margin: 0;
    padding: 0;
    font-family: Roboto, sans-serif;
  }
`;

ReactDOM.render(
  <Provider store={store}>
    <Router basename="/mobile-app-ui">
      <ThemeProvider theme={styledComponentsTheme}>
        <MuiThemeProvider theme={muiTheme}>
          <Layout>
            <Routes />
          </Layout>
        </MuiThemeProvider>
      </ThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
);

unregister();
