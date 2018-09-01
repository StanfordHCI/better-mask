import React from 'react';
import EventEmitter from 'events'
import {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {compose} from 'recompose'
import {closeWelcomeScreen} from '../../../../actions'
import {INITIALIZE_GENERATE_VAULT_ROUTE} from '../routes'
import {INITIALIZE_NOTICE_ROUTE} from '../routes';

import Button from '../components/Button';

class WelcomeScreen extends Component {
  static propTypes = {
    noActiveNotices: PropTypes.bool.isRequired,
    closeWelcomeScreen: PropTypes.func.isRequired,
    welcomeScreenSeen: PropTypes.bool,
    history: PropTypes.object,
    t: PropTypes.func,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.animationEventEmitter = new EventEmitter()
  }

  componentWillMount() {
    const {history, welcomeScreenSeen, authenticated, noActiveNotices} = this.props;

    if (welcomeScreenSeen && !noActiveNotices) {
      return history.push(INITIALIZE_NOTICE_ROUTE);
    }

    if (authenticated) {
      return history.push(INITIALIZE_GENERATE_VAULT_ROUTE);
    }

    if (welcomeScreenSeen) {
      return history.push(INITIALIZE_NOTICE_ROUTE);
    }
  }

  componentWillReceiveProps(props) {
    const {history, authenticated} = props;

    // Loading the auth status is an asynchronous operation. That's why we need to
    // perform this check in componentWillReceiveProps as well.
    // This component will stay invisible if the auth status is unknown
    // TODO the parent component (InitializationFlow) should handle the auth status and not mount its children if it's still unknown
    // this would allow to write children components with the authenticated prop required
    if (authenticated) {
      history.push(INITIALIZE_GENERATE_VAULT_ROUTE);
    }
  }

  initiateAccountCreation = () => {
    this.props.closeWelcomeScreen()
    this.props.history.push(INITIALIZE_NOTICE_ROUTE)
  }

  render() {
    // Make sure the component stays invisible if the auth status is still unknown
    // (avoids the UI flickering because of a component rendering then instantly
    // disappearing)
    if (this.props.authenticated == null) {
      return null;
    }

    return (
      <div className="welcome-screen">
        <div className="welcome-screen__info">
          {/* <Mascot animationEventEmitter={this.animationEventEmitter} width={225} height={225} /> */}

          <div className="welcome-screen__info__header">{this.context.t('welcomeBeta')}</div>
          <div className="welcome-screen__info__copy">{this.context.t('metamaskDescription')}</div>
          <div className="welcome-screen__info__copy">{this.context.t('holdEther')}</div>

          <Button onClick={this.initiateAccountCreation}>{this.context.t('continue')}</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {metamask, auth} = state;
  return {
    noActiveNotices: metamask.noActiveNotices,
    welcomeScreenSeen: metamask.welcomeScreenSeen,
    authenticated: auth.authenticated,
  }
}

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    dispatch => ({
      closeWelcomeScreen: () => dispatch(closeWelcomeScreen()),
    })
  )
)(WelcomeScreen)
