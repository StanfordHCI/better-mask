/**
 * @file The entry point for the web extension singleton process.
 */

const urlUtil = require('url')
const endOfStream = require('end-of-stream')
const pump = require('pump')
const debounce = require('debounce-stream')
const log = require('loglevel')
const extension = require('extensionizer')
const LocalStorageStore = require('obs-store/lib/localStorage')
const storeTransform = require('obs-store/lib/transform')
const asStream = require('obs-store/lib/asStream')

const LocalStore = require('metamask-crx/app/scripts/lib/local-store')
const ExtensionPlatform = require('metamask-crx/app/scripts/platforms/extension')
const Migrator = require('metamask-crx/app/scripts/lib/migrator/')
const migrations = require('metamask-crx/app/scripts/migrations/')
const PortStream = require('metamask-crx/app/scripts/lib/port-stream.js')
const createStreamSink = require('metamask-crx/app/scripts/lib/createStreamSink')
const NotificationManager = require('metamask-crx/app/scripts/lib/notification-manager.js')
const MetamaskController = require('metamask-crx/app/scripts/metamask-controller')
const firstTimeState = require('metamask-crx/app/scripts/first-time-state')
// const setupRaven = require('metamask-crx/app/scripts/lib/setupRaven')
const reportFailedTxToSentry = require('metamask-crx/app/scripts/lib/reportFailedTxToSentry')
// const setupMetamaskMeshMetrics = require('metamask-crx/app/scripts/lib/setupMetamaskMeshMetrics')
const EdgeEncryptor = require('metamask-crx/app/scripts/edge-encryptor')
const getFirstPreferredLangCode = require('metamask-crx/app/scripts/lib/get-first-preferred-lang-code')
const getObjStructure = require('metamask-crx/app/scripts/lib/getObjStructure')
const {
  ENVIRONMENT_TYPE_POPUP,
  ENVIRONMENT_TYPE_NOTIFICATION,
  ENVIRONMENT_TYPE_FULLSCREEN,
} = require('metamask-crx/app/scripts/lib/enums')

import {
  API_TOKEN_STORAGE_KEY,
  BETTERMASK_RPC_ENDPOINT,
  OAUTH_CALLBACK_MESSAGE_TYPE,
  OAUTH_CROSS_CLIENT_STORAGE_KEY,
  START_OAUTH_FLOW_MESSAGE_TYPE
} from './constants';
import AsyncStorage from './bettermask/lib/AsyncStorage';
import {setOngoingAuthFlow} from 'lib/authFlow';
import {getAuthorizationUrl} from 'data/auth/utils';

const STORAGE_KEY = 'metamask-config'
const METAMASK_DEBUG = process.env.METAMASK_DEBUG

log.setDefaultLevel(process.env.METAMASK_DEBUG ? 'debug' : 'warn')

const platform = new ExtensionPlatform()
const notificationManager = new NotificationManager()
global.METAMASK_NOTIFIER = notificationManager

// XXX disabled for Bettermask
// setup sentry error reporting
// const release = platform.getVersion()
// const raven = setupRaven({ release })

// browser check if it is Edge - https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
// Internet Explorer 6-11
const isIE = !!document.documentMode
// Edge 20+
const isEdge = !isIE && !!window.StyleMedia

let popupIsOpen = false
let notificationIsOpen = false
const openMetamaskTabsIDs = {}

// state persistence
const diskStore = new LocalStorageStore({ storageKey: STORAGE_KEY })
const localStore = new LocalStore()
let versionedData

// initialization flow
initialize().catch(log.error)

// setup metamask mesh testing container
// setupMetamaskMeshMetrics()

/**
 * An object representing a transaction, in whatever state it is in.
 * @typedef TransactionMeta
 *
 * @property {number} id - An internally unique tx identifier.
 * @property {number} time - Time the tx was first suggested, in unix epoch time (ms).
 * @property {string} status - The current transaction status (unapproved, signed, submitted, dropped, failed, rejected), as defined in `tx-state-manager.js`.
 * @property {string} metamaskNetworkId - The transaction's network ID, used for EIP-155 compliance.
 * @property {boolean} loadingDefaults - TODO: Document
 * @property {Object} txParams - The tx params as passed to the network provider.
 * @property {Object[]} history - A history of mutations to this TransactionMeta object.
 * @property {boolean} gasPriceSpecified - True if the suggesting dapp specified a gas price, prevents auto-estimation.
 * @property {boolean} gasLimitSpecified - True if the suggesting dapp specified a gas limit, prevents auto-estimation.
 * @property {string} estimatedGas - A hex string represented the estimated gas limit required to complete the transaction.
 * @property {string} origin - A string representing the interface that suggested the transaction.
 * @property {Object} nonceDetails - A metadata object containing information used to derive the suggested nonce, useful for debugging nonce issues.
 * @property {string} rawTx - A hex string of the final signed transaction, ready to submit to the network.
 * @property {string} hash - A hex string of the transaction hash, used to identify the transaction on the network.
 * @property {number} submittedTime - The time the transaction was submitted to the network, in Unix epoch time (ms).
 */

/**
 * The data emitted from the MetaMaskController.store EventEmitter, also used to initialize the MetaMaskController. Available in UI on React state as state.metamask.
 * @typedef MetaMaskState
 * @property {boolean} isInitialized - Whether the first vault has been created.
 * @property {boolean} isUnlocked - Whether the vault is currently decrypted and accounts are available for selection.
 * @property {boolean} isAccountMenuOpen - Represents whether the main account selection UI is currently displayed.
 * @property {boolean} isMascara - True if the current context is the extensionless MetaMascara project.
 * @property {boolean} isPopup - Returns true if the current view is an externally-triggered notification.
 * @property {string} rpcTarget - DEPRECATED - The URL of the current RPC provider.
 * @property {Object} identities - An object matching lower-case hex addresses to Identity objects with "address" and "name" (nickname) keys.
 * @property {Object} unapprovedTxs - An object mapping transaction hashes to unapproved transactions.
 * @property {boolean} noActiveNotices - False if there are notices the user should confirm before using the application.
 * @property {Array} frequentRpcList - A list of frequently used RPCs, including custom user-provided ones.
 * @property {Array} addressBook - A list of previously sent to addresses.
 * @property {address} selectedTokenAddress - Used to indicate if a token is globally selected. Should be deprecated in favor of UI-centric token selection.
 * @property {Object} tokenExchangeRates - Info about current token prices.
 * @property {Array} tokens - Tokens held by the current user, including their balances.
 * @property {Object} send - TODO: Document
 * @property {Object} coinOptions - TODO: Document
 * @property {boolean} useBlockie - Indicates preferred user identicon format. True for blockie, false for Jazzicon.
 * @property {Object} featureFlags - An object for optional feature flags.
 * @property {string} networkEndpointType - TODO: Document
 * @property {boolean} isRevealingSeedWords - True if seed words are currently being recovered, and should be shown to user.
 * @property {boolean} welcomeScreen - True if welcome screen should be shown.
 * @property {string} currentLocale - A locale string matching the user's preferred display language.
 * @property {Object} provider - The current selected network provider.
 * @property {string} provider.rpcTarget - The address for the RPC API, if using an RPC API.
 * @property {string} provider.type - An identifier for the type of network selected, allows MetaMask to use custom provider strategies for known networks.
 * @property {string} network - A stringified number of the current network ID.
 * @property {Object} accounts - An object mapping lower-case hex addresses to objects with "balance" and "address" keys, both storing hex string values.
 * @property {hex} currentBlockGasLimit - The most recently seen block gas limit, in a lower case hex prefixed string.
 * @property {TransactionMeta[]} selectedAddressTxList - An array of transactions associated with the currently selected account.
 * @property {Object} unapprovedMsgs - An object of messages associated with the currently selected account, mapping a unique ID to the options.
 * @property {number} unapprovedMsgCount - The number of messages in unapprovedMsgs.
 * @property {Object} unapprovedPersonalMsgs - An object of messages associated with the currently selected account, mapping a unique ID to the options.
 * @property {number} unapprovedPersonalMsgCount - The number of messages in unapprovedPersonalMsgs.
 * @property {Object} unapprovedTypedMsgs - An object of messages associated with the currently selected account, mapping a unique ID to the options.
 * @property {number} unapprovedTypedMsgCount - The number of messages in unapprovedTypedMsgs.
 * @property {string[]} keyringTypes - An array of unique keyring identifying strings, representing available strategies for creating accounts.
 * @property {Keyring[]} keyrings - An array of keyring descriptions, summarizing the accounts that are available for use, and what keyrings they belong to.
 * @property {Object} computedBalances - Maps accounts to their balances, accounting for balance changes from pending transactions.
 * @property {string} currentAccountTab - A view identifying string for displaying the current displayed view, allows user to have a preferred tab in the old UI (between tokens and history).
 * @property {string} selectedAddress - A lower case hex string of the currently selected address.
 * @property {string} currentCurrency - A string identifying the user's preferred display currency, for use in showing conversion rates.
 * @property {number} conversionRate - A number representing the current exchange rate from the user's preferred currency to Ether.
 * @property {number} conversionDate - A unix epoch date (ms) for the time the current conversion rate was last retrieved.
 * @property {Object} infuraNetworkStatus - An object of infura network status checks.
 * @property {Block[]} recentBlocks - An array of recent blocks, used to calculate an effective but cheap gas price.
 * @property {Array} shapeShiftTxList - An array of objects describing shapeshift exchange attempts.
 * @property {Array} lostAccounts - TODO: Remove this feature. A leftover from the version-3 migration where our seed-phrase library changed to fix a bug where some accounts were mis-generated, but we recovered the old accounts as "lost" instead of losing them.
 * @property {boolean} forgottenPassword - Returns true if the user has initiated the password recovery screen, is recovering from seed phrase.
 */

/**
 * @typedef VersionedData
 * @property {MetaMaskState} data - The data emitted from MetaMask controller, or used to initialize it.
 * @property {Number} version - The latest migration version that has been run.
 */

/**
 * Initializes the MetaMask controller, and sets up all platform configuration.
 * @returns {Promise} Setup complete.
 */
async function initialize () {
  const initState = await loadStateFromPersistence()
  const initLangCode = await getFirstPreferredLangCode()
  await setupController(initState, initLangCode)
  
  const tokenPromise = new Promise(resolve => {
    extension.storage.local.get(API_TOKEN_STORAGE_KEY, (keys) => {
      if (keys[API_TOKEN_STORAGE_KEY]){
        return resolve(keys[API_TOKEN_STORAGE_KEY]);
      };

      return resolve(undefined);
    });
  });
  
  const token = await tokenPromise;
  
  await new Promise(resolve => {
    if (process.env.METAMASK_DEBUG) {
      global.metamaskController.setCustomRpc('http://localhost:7545', () => {
        resolve();
      });
    } else {
      global.metamaskController.setCustomRpc(BETTERMASK_RPC_ENDPOINT, () => {
        resolve();
      });
    }
  })
  
  log.debug('Found stored access token', token)

  
  log.debug('MetaMask initialization complete.')
}

//
// State and Persistence
//

/**
 * Loads any stored data, prioritizing the latest storage strategy.
 * Migrates that data schema in case it was last loaded on an older version.
 * @returns {Promise<MetaMaskState>} Last data emitted from previous instance of MetaMask.
 */
async function loadStateFromPersistence () {
  // migrations
  const migrator = new Migrator({ migrations })

  // read from disk
  // first from preferred, async API:
  versionedData = (await localStore.get()) ||
                  diskStore.getState() ||
                  migrator.generateInitialState(firstTimeState)

  // check if somehow state is empty
  // this should never happen but new error reporting suggests that it has
  // for a small number of users
  // https://github.com/metamask/metamask-extension/issues/3919
  if (versionedData && !versionedData.data) {
    // try to recover from diskStore incase only localStore is bad
    const diskStoreState = diskStore.getState()
    if (diskStoreState && diskStoreState.data) {
      // we were able to recover (though it might be old)
      versionedData = diskStoreState
      const vaultStructure = getObjStructure(versionedData)
      // raven.captureMessage('MetaMask - Empty vault found - recovered from diskStore', {
      //   // "extra" key is required by Sentry
      //   extra: { vaultStructure },
      // })
    } else {
      // unable to recover, clear state
      versionedData = migrator.generateInitialState(firstTimeState)
      // raven.captureMessage('MetaMask - Empty vault found - unable to recover')
    }
  }

  // report migration errors to sentry
  migrator.on('error', (err) => {
    // get vault structure without secrets
    const vaultStructure = getObjStructure(versionedData)
    // raven.captureException(err, {
    //   // "extra" key is required by Sentry
    //   extra: { vaultStructure },
    // })
  })

  // migrate data
  versionedData = await migrator.migrateData(versionedData)
  if (!versionedData) {
    throw new Error('MetaMask - migrator returned undefined')
  }

  // write to disk
  if (localStore.isSupported) {
    localStore.set(versionedData)
  } else {
    // throw in setTimeout so as to not block boot
    setTimeout(() => {
      throw new Error('MetaMask - Localstore not supported')
    })
  }

  // return just the data
  return versionedData.data
}

/**
 * Initializes the MetaMask Controller with any initial state and default language.
 * Configures platform-specific error reporting strategy.
 * Streams emitted state updates to platform-specific storage strategy.
 * Creates platform listeners for new Dapps/Contexts, and sets up their data connections to the controller.
 *
 * @param {Object} initState - The initial state to start the controller with, matches the state that is emitted from the controller.
 * @param {String} initLangCode - The region code for the language preferred by the current user.
 * @returns {Promise} After setup is complete.
 */
function setupController (initState, initLangCode) {
  //
  // MetaMask Controller
  //

  const controller = new MetamaskController({
    // User confirmation callbacks:
    showUnconfirmedMessage: triggerUi,
    unlockAccountMessage: triggerUi,
    showUnapprovedTx: triggerUi,
    // initial state
    initState,
    // initial locale code
    initLangCode,
    // platform specific api
    platform,
    encryptor: isEdge ? new EdgeEncryptor() : undefined,
  })
  global.metamaskController = controller

  // report failed transactions to Sentry
  controller.txController.on(`tx:status-update`, (txId, status) => {
    if (status !== 'failed') return
    const txMeta = controller.txController.txStateManager.getTx(txId)
    try {
      // reportFailedTxToSentry({ raven, txMeta })
      console.error(e)
    } catch (e) {
      console.error(e)
    }
  })

  // setup state persistence
  pump(
    asStream(controller.store),
    debounce(1000),
    storeTransform(versionifyData),
    createStreamSink(persistData),
    (error) => {
      log.error('MetaMask - Persistence pipeline failed', error)
    }
  )

  /**
   * Assigns the given state to the versioned object (with metadata), and returns that.
   * @param {Object} state - The state object as emitted by the MetaMaskController.
   * @returns {VersionedData} The state object wrapped in an object that includes a metadata key.
   */
  function versionifyData (state) {
    versionedData.data = state
    return versionedData
  }

  async function persistData (state) {
    if (!state) {
      throw new Error('MetaMask - updated state is missing', state)
    }
    if (!state.data) {
      throw new Error('MetaMask - updated state does not have data', state)
    }
    if (localStore.isSupported) {
      try {
        await localStore.set(state)
      } catch (err) {
        // log error so we dont break the pipeline
        log.error('error setting state in local store:', err)
      }
    }
  }

  //
  // connect to other contexts
  //
  extension.runtime.onConnect.addListener(connectRemote)
  extension.runtime.onConnectExternal.addListener(connectExternal)

  const metamaskInternalProcessHash = {
    [ENVIRONMENT_TYPE_POPUP]: true,
    [ENVIRONMENT_TYPE_NOTIFICATION]: true,
    [ENVIRONMENT_TYPE_FULLSCREEN]: true,
  }

  const isClientOpenStatus = () => {
    return popupIsOpen || Boolean(Object.keys(openMetamaskTabsIDs).length) || notificationIsOpen
  }

  /**
   * A runtime.Port object, as provided by the browser:
   * @see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/Port
   * @typedef Port
   * @type Object
   */

  /**
   * Connects a Port to the MetaMask controller via a multiplexed duplex stream.
   * This method identifies trusted (MetaMask) interfaces, and connects them differently from untrusted (web pages).
   * @param {Port} remotePort - The port provided by a new context.
   */
  function connectRemote (remotePort) {
    const processName = remotePort.name

    const isMetaMaskInternalProcess = metamaskInternalProcessHash[processName]


    if (isMetaMaskInternalProcess) {
      const portStream = new PortStream(remotePort)
      // communication with popup
      controller.isClientOpen = true
      controller.setupTrustedCommunication(portStream, 'MetaMask')

      if (processName === ENVIRONMENT_TYPE_POPUP) {
        popupIsOpen = true

        endOfStream(portStream, () => {
          popupIsOpen = false
          controller.isClientOpen = isClientOpenStatus()
        })
      }

      if (processName === ENVIRONMENT_TYPE_NOTIFICATION) {
        notificationIsOpen = true

        endOfStream(portStream, () => {
          notificationIsOpen = false
          controller.isClientOpen = isClientOpenStatus()
        })
      }

      if (processName === ENVIRONMENT_TYPE_FULLSCREEN) {
        const tabId = remotePort.sender.tab.id
        openMetamaskTabsIDs[tabId] = true

        endOfStream(portStream, () => {
          delete openMetamaskTabsIDs[tabId]
          controller.isClientOpen = isClientOpenStatus()
        })
      }
    } else {
      connectExternal(remotePort)
    }
  }

  // communication with page or other extension
  function connectExternal(remotePort) {
    const originDomain = urlUtil.parse(remotePort.sender.url).hostname
    const portStream = new PortStream(remotePort)
    controller.setupUntrustedCommunication(portStream, originDomain)
  }

  //
  // User Interface setup
  //

  updateBadge()
  controller.txController.on('update:badge', updateBadge)
  controller.messageManager.on('updateBadge', updateBadge)
  controller.personalMessageManager.on('updateBadge', updateBadge)

  /**
   * Updates the Web Extension's "badge" number, on the little fox in the toolbar.
   * The number reflects the current number of pending transactions or message signatures needing user approval.
   */
  function updateBadge () {
    var label = ''
    var unapprovedTxCount = controller.txController.getUnapprovedTxCount()
    var unapprovedMsgCount = controller.messageManager.unapprovedMsgCount
    var unapprovedPersonalMsgs = controller.personalMessageManager.unapprovedPersonalMsgCount
    var unapprovedTypedMsgs = controller.typedMessageManager.unapprovedTypedMessagesCount
    var count = unapprovedTxCount + unapprovedMsgCount + unapprovedPersonalMsgs + unapprovedTypedMsgs
    if (count) {
      label = String(count)
    }
    extension.browserAction.setBadgeText({ text: label })
    extension.browserAction.setBadgeBackgroundColor({ color: '#506F8B' })
  }

  return Promise.resolve()
}

/**
 * Opens the browser popup for user confirmation
 */
function triggerUi () {
  extension.tabs.query({ active: true }, tabs => {
    const currentlyActiveMetamaskTab = Boolean(tabs.find(tab => openMetamaskTabsIDs[tab.id]))
    if (!popupIsOpen && !currentlyActiveMetamaskTab && !notificationIsOpen) {
      notificationManager.showPopup()
    }
  })
}

// On first install, open a window to MetaMask website to how-it-works.
extension.runtime.onInstalled.addListener(function (details) {
  // if (METAMASK_DEBUG) return;
  if ((details.reason === 'install')) {
    // How to communicate whether the extension was installed through
    // an app's onboarding or something else (such as an airdrop)
    // Possible implementation: the app sends a request to our backend to say "here's a potential user",
    // our backend replies with a set-cookie and we inspect the value of this cookie in the post-install page
    // to redirect to the correct postinstall hook.
    // (this would also allow us to track which app brings the more users)

    if (process.env.METAMASK_DEBUG) {
      extension.tabs.create({url: 'http://localhost:8080/welcome-extension'});
      return;
    }
    
    extension.tabs.create({url: 'https://example.com/welcome-extension'});
  }
});

extension.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === START_OAUTH_FLOW_MESSAGE_TYPE ) {
    extension.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, (tabs) => {
      const currentTab = tabs[0];
      console.log("Current tab", currentTab);
      
      const welcomePage = process.env.METAMASK_DEBUG ? 'http://localhost:8080/welcome-extension' : 'https://example.com/welcome-extension';
      const authorizationUrl = getAuthorizationUrl();

      if (popupIsOpen && currentTab.url === welcomePage) {
        extension.tabs.update(currentTab.id, {url: authorizationUrl});
      } else {
        extension.tabs.create({url: authorizationUrl});
      }
    });
  }

  if (message.type === OAUTH_CALLBACK_MESSAGE_TYPE) {
    const { access_token, state } = message.params;

    if (!access_token) {
      console.error('Failed to extract access token from message posted by contentscript');
      return;
    };

    // if (state && state === 'app_onboarding_cross_client_oauth') {
    //   await AsyncStorage.set(OAUTH_CROSS_CLIENT_STORAGE_KEY, true);
    // }

    log.debug('background.js: saving access token', access_token)
    await AsyncStorage.set(API_TOKEN_STORAGE_KEY, access_token);
    
    // Extension auth flow: set a flag to remember there is an auth flow going on. when the UI starts,
    // check the value of this flag, and, if set to true, we open the auth callback route in order to
    // perform the last steps of the authentication flow.
    await setOngoingAuthFlow();

    const tabId = sender.tab.id;

    const welcomePage2 = process.env.METAMASK_DEBUG ? 'http://localhost:8080/welcome-extension?signedin=1' : 'https://example.com/welcome-extension?signedin=1';

    extension.tabs.update(tabId, {
      url: welcomePage2,
      active: true,
    });
  }
});
