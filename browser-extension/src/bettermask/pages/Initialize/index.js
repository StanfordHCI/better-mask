import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import { compose } from 'recompose'
import classnames from 'classnames'

import {loadAuthStatus} from 'data/auth';

import {
  DEFAULT_ROUTE,
  INITIALIZE_ROUTE,
} from '../../routes';

import {INITIALIZE_GENERATE_VAULT_ROUTE, INITIALIZE_SOCIAL_LOGIN_ROUTE, INITIALIZE_NOTICE_ROUTE} from './routes';

import GenerateVault from './pages/GenerateVault';
import SocialLogin from './pages/SocialLogin';
import Notice from './pages/Notice';

import {colors} from 'theme';

class InitializationFlow extends Component {
  static propTypes = {
    isInitialized: PropTypes.bool,
    seedWords: PropTypes.string,
    address: PropTypes.string,
    noActiveNotices: PropTypes.bool,
    goToBuyEtherView: PropTypes.func,
    isUnlocked: PropTypes.bool,
    history: PropTypes.object,
    welcomeScreenSeen: PropTypes.bool,
    isPopup: PropTypes.bool,
  };

  static defaultProps = {
    isInitialized: false,
    seedWords: '',
    noActiveNotices: false,
  };

  componentDidMount() {
    const { history, loadAuthStatus, isInitialized } = this.props;

    loadAuthStatus();

    if (isInitialized) return history.push(DEFAULT_ROUTE);
  }

  renderAppBar() {
    return (
      <div style={{textAlign: 'center', background: colors.darkgray, padding: 4}}>
        <h2 style={{color: 'white', fontSize: '1em'}} >
          Please be aware that this version is still under development
        </h2>
      </div>
    )
  }

  render () {
    const { isPopup } = this.props

    // TODO don't mount any children if we are still waiting for the authentication status promise to resolve (triggered in componentDidMount)
    // this would allow us to stop handling this in each children individually and make the authenticated prop a required prop of all children

    // Auth status unknown yet (still being fetched)
    if (this.props.authenticated == null) {
      return null;
    }

    return (
      <div style={{height: 'calc(100vh - 64px)'}}>
        <Switch>
          {/* <Route exact path={INITIALIZE_IMPORT_ACCOUNT_ROUTE} component={ImportAccountScreen} />
          <Route
            exact
            path={INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE}
            component={ImportSeedPhraseScreen} /> */}
          {/* <Route exact path={INITIALIZE_UNIQUE_IMAGE_ROUTE} component={UniqueImageScreen} />
          <Route exact path={INITIALIZE_BACKUP_PHRASE_ROUTE} component={BackupPhraseScreen} />
          <Route exact path={INITIALIZE_CONFIRM_SEED_ROUTE} component={ConfirmSeed} />
          <Route exact path={INITIALIZE_CREATE_PASSWORD_ROUTE} component={CreatePasswordScreen} /> */}
          
          <Route exact path={INITIALIZE_NOTICE_ROUTE} component={Notice} />
          <Route exact path={INITIALIZE_SOCIAL_LOGIN_ROUTE} component={SocialLogin} />
          <Route exact path={INITIALIZE_GENERATE_VAULT_ROUTE} component={GenerateVault} />

          <Route exact path={INITIALIZE_ROUTE} render={() => <Redirect to={INITIALIZE_NOTICE_ROUTE} />} />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {metamask, auth} = state;
  
  const {
    isInitialized,
    seedWords,
    noActiveNotices,
    selectedAddress,
    forgottenPassword,
    isMascara,
    isUnlocked,
    welcomeScreenSeen,
    isPopup,
  } = metamask;

  return {
    isMascara,
    isInitialized,
    seedWords,
    noActiveNotices,
    address: selectedAddress,
    forgottenPassword,
    isUnlocked,
    welcomeScreenSeen,
    isPopup,
    authenticated: auth.authenticated,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadAuthStatus: () => dispatch(loadAuthStatus()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(InitializationFlow)
