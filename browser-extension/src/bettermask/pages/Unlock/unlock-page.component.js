import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import styled from 'styled-components';

import {getAuthorizationUrl} from 'data/auth/utils';

import {colors} from 'theme';

const getCaretCoordinates = require('textarea-caret')
const EventEmitter = require('events').EventEmitter
import { DEFAULT_ROUTE } from 'routes';
import {FlatHtmlLink} from 'components/FlatLink';

const Container = styled.div`
  height: calc(100vh - 64px);
  alignItems: center;
  flexDirection: column;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 0 auto;
`;

const BUTTON_STYLE = {
  backgroundColor: colors.primary,
  backgroundColor: colors.primary,
  color: 'white',
  marginTop: '20px',
  height: '60px',
  fontWeight: '400',
  boxShadow: 'none',
  borderRadius: '4px',
};

class UnlockPage extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      password: '',
      error: null,
    }

    this.animationEventEmitter = new EventEmitter()
  }

  componentWillReceiveProps(props) {
    const { isUnlocked, history, isAuthenticated } = props;

    if (isUnlocked && isAuthenticated) {
      history.push(DEFAULT_ROUTE)
    }
  }

  handleInputChange ({ target }) {
    this.setState({ password: target.value, error: null })

    // tell mascot to look at page action
    const element = target
    const boundingRect = element.getBoundingClientRect()
    const coordinates = getCaretCoordinates(element, element.selectionEnd)
    this.animationEventEmitter.emit('point', {
      x: boundingRect.left + coordinates.left - element.scrollLeft,
      y: boundingRect.top + coordinates.top - element.scrollTop,
    })
  }

  renderLoginWithFacebookButton = () => {
    const t = (key) => key;
    return (
      <FlatHtmlLink href={getAuthorizationUrl()} target={this.props.isPopup ? '_blank' : '_self'} rel="noopener noreferrer">
        <Button
          style={BUTTON_STYLE}
          fullWidth
          variant="raised"
          size="large"
          disableRipple>
          Unlock with Facebook
        </Button>
      </FlatHtmlLink>
    )
  }

  render () {
    const { error } = this.state

    // const {t} = this.context;
    const t = (key) => key;

    if (this.props.loading) return null;

    return (
      <Container>
        <div className="unlock-page">
          <div style={{textAlign: 'center'}}>
            <img src={'/images/logo.png'} alt="Logo" style={{width: '90%', maxWidth: 300, marginBottom: 32}} />
          </div>

          <h1 style={{textAlign: 'center'}}>
            Welcome back!
          </h1>
          
          <div style={{textAlign: 'center'}}>For your safety, your vault is locked.</div>

          {this.renderLoginWithFacebookButton()}
        </div>
      </Container>
    )
  }
}

UnlockPage.propTypes = {
  isUnlocked: PropTypes.bool,
  isPopup: PropTypes.bool,
  history: PropTypes.object,
  t: PropTypes.func,
  useOldInterface: PropTypes.func,
}

export default UnlockPage
