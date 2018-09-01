import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import logger from 'loglevel';

import { UNLOCK_ROUTE, INITIALIZE_ROUTE } from '../../routes';

const AuthenticatedRoute = props => {
  const { isUnlocked, isInitialized } = props;
  
  switch (true) {
    case isUnlocked && isInitialized:
      return <Route {...props} />;
    case !isInitialized:
      return <Redirect to={{pathname: INITIALIZE_ROUTE }} />
    default:
      return <Redirect to={{pathname: UNLOCK_ROUTE }} />
  }
}

AuthenticatedRoute.propTypes = {
  isUnlocked: PropTypes.bool,
  isInitialized: PropTypes.bool,
}

const mapStateToProps = state => {
  const { metamask: { isUnlocked, isInitialized } } = state
  return {
    isUnlocked,
    isInitialized,
  }
}

export default connect(mapStateToProps)(AuthenticatedRoute)
