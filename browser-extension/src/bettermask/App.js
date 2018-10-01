import React from 'react';
import {Provider} from 'react-redux';

import {injectGlobal} from 'styled-components';

import Layout from './Layout';

// Boilerplate:
// import './index.css';

// Redux-synchronized router:
// import { ConnectedRouter } from 'react-router-redux';
import {HashRouter} from 'react-router-dom';

// Routing-aware redux store:
// import {store} from './store';

// Theme providers:
import {ThemeProvider} from 'styled-components';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {muiTheme, styledComponentsTheme} from './theme';

// Inject reboot.css as a global style:
import './reboot.css.js';

// Pages:
import Routes from './components/router/Routes';
import {loadAuthStatus} from 'data/auth';

injectGlobal`
  @import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500);
  @import url(https://use.fontawesome.com/releases/v5.2.0/css/all.css);

  body {
    margin: 0;
    padding: 0;
    font-family: Roboto, sans-serif;
  }
`;

export default class App extends React.Component {
  componentDidMount() {
    this.props.store.dispatch(loadAuthStatus());
  }

  render() {
    const {store} = this.props;
    return (
      <Provider store={store}>
        <HashRouter hashType="noslash">
          <ThemeProvider theme={styledComponentsTheme}>
            <MuiThemeProvider theme={muiTheme}>
              <Layout>
                <Routes />
              </Layout>
            </MuiThemeProvider>
          </ThemeProvider>
        </HashRouter>
      </Provider>
    );
  }
}
