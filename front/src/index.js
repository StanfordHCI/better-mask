import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {injectGlobal} from 'styled-components';

import Layout from './Layout';

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

// Inject reboot.css as a global style:
import './reboot.css.js';

// Pages:
import Routes from './routes';

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
    <Router>
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
