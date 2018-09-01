# Blockchain explorer browser extension

## Developing on Blockchain Explorer

1. Setup backend first

2. Copy paste `env.prod.json` into `env.json` and make relevant changes:

* "OAUTH_CLIENT_ID": shoulbe doorkeeper's Application UID
* "OAUTH_REDIRECT_URI": shoulbe doorkeeper's Callback urls
* BACKEND_URL: http://localhost:8080

3. Install dependencies: we use [Yarn](https://yarnpkg.com/)!

`yarn`

4. Start your development server:

`yarn start`

5. Install unpacked extension on Chrome: choose the `build` directory.


## Releasing a new version of the extension

* Check the version number in `package.json` (it should follow [semver](https://semver.org/))
* Build the unpacked extension with prod config: `yarn release`
* Zip the resulting `build` directory: `cd build && zip -r ../build ./*`
* Upload the resulting build.zip to the chrome web store
* Commit and push a bump of the version number on master (e.g if
    you just released v0.0.4, you would typically update to 0.0.5)

## Coding practices

### Naming convention

Metamask uses `kebab-case` naming for their files. We made the decision to use `camelCase` for any new file we create.
Any kebab-case-named metamask file that gets heavily refactored can be renamed to camelCase. This gives us a way to get
a sense of whether a file is our own home-grown code or whether we can still refer to the Metamask codebase to understand
its behaviour.

### Redux reducers and action naming

Use the [duck pattern](https://github.com/erikras/ducks-modular-redux). The duck for the reducer responsible for `store.foo` should be placed in `ducks/foo/index.js`

Generally, action creator `expandSnibbit` located in `ducks/foo/index.js` should dispatch an action of type `foo/EXPAND_SNIBBIT`.
Even though this action might not trigger a state change, this is a good practice for auditability (allows to get a better
understanding of what's happening when looking at the devtools, and provides a backup point for time-travel debugging). The performance
overhead is minimal if the reducer returns a reference to the unmodified state (e.g `return state`, and not `return {...state}`, which does
not trigger a re-render of the subscribed components).


## Forked metamask: a few attention points

### `eth-keyring-controller` dependency

Marked as a devDependency of metamask. Had to add it as a dependency of this project. We have to keep track of the right version. See https://github.com/MetaMask/metamask-extension/blob/master/package.json.

### `old-ui` and `mascara`

// TODO(aurelienshz)


## Bootstrapped with Chrome Extension Webpack Boilerplate

See https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate
