const injectCss = require('inject-css')
const extension = require('extensionizer')
const log = require('loglevel')

// const OldMetaMaskUiCss = require('./old-ui/css')
// const NewMetaMaskUiCss = require('./ui/css')
const startPopup = require('./popup-core')

const PortStream = require('metamask-crx/app/scripts/lib/port-stream.js')
const { getEnvironmentType } = require('metamask-crx/app/scripts/lib/util')
const { ENVIRONMENT_TYPE_NOTIFICATION } = require('metamask-crx/app/scripts/lib/enums')
const ExtensionPlatform = require('metamask-crx/app/scripts/platforms/extension')
const NotificationManager = require('metamask-crx/app/scripts/lib/notification-manager')
// const setupRaven = require('metamask-crx/app/scripts/lib/setupRaven')

const notificationManager = new NotificationManager()


start().catch(log.error)

async function start() {

  // create platform global
  global.platform = new ExtensionPlatform()

  // setup sentry error reporting
  const release = global.platform.getVersion()
  // setupRaven({ release })

  // inject css
  // const css = MetaMaskUiCss()
  // injectCss(css)

  // identify window type (popup, notification)
  const windowType = getEnvironmentType(window.location.href)
  global.METAMASK_UI_TYPE = windowType
  closePopupIfOpen(windowType)

  // setup stream to background
  const extensionPort = extension.runtime.connect({ name: windowType })
  const connectionStream = new PortStream(extensionPort)

  // start ui
  const container = document.getElementById('app-content')
  startPopup({ container, connectionStream }, (err, store) => {
    if (err) return displayCriticalError(err)

    // Code commented out until we begin auto adding users to NewUI
    // const { isMascara, identities = {}, featureFlags = {} } = store.getState().metamask
    // const firstTime = Object.keys(identities).length === 0
    const { isMascara, featureFlags = {} } = store.getState().metamask
    
    if (!featureFlags.betaUI) {
      // store.dispatch(actions.setFeatureFlag('betaUI', true));
    }
    
    // let betaUIState = true;
    
    // Code commented out until we begin auto adding users to NewUI
    // const useBetaCss = isMascara || firstTime || betaUIState
    // const useBetaCss = isMascara || betaUIState
    
    // let css = useBetaCss ? NewMetaMaskUiCss() : OldMetaMaskUiCss()
    // let deleteInjectedCss = injectCss(css)
    // let newBetaUIState

    store.subscribe(() => {
      const state = store.getState()
      // newBetaUIState = state.metamask.featureFlags.betaUI
      // if (newBetaUIState !== betaUIState) {
        // deleteInjectedCss()
        // betaUIState = newBetaUIState
        // css = betaUIState ? NewMetaMaskUiCss() : OldMetaMaskUiCss()
        // deleteInjectedCss = injectCss(css)
      // }

      // TODO https://trello.com/c/sGxQdr0a/141-if-stateappstateshouldclose-notificationmanagerclosepopup
      // if (state.appState.shouldClose) notificationManager.closePopup()
    })
  })


  function closePopupIfOpen (windowType) {
    if (windowType !== ENVIRONMENT_TYPE_NOTIFICATION) {
      // should close only chrome popup
      notificationManager.closePopup()
    }
  }

  function displayCriticalError (err) {
    container.innerHTML = '<div class="critical-error">The MetaMask app failed to load: please open and close MetaMask again to restart.</div>'
    container.style.height = '80px'
    log.error(err.stack)
    throw err
  }

}
