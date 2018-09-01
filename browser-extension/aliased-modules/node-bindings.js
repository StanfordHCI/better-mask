/**
 * Patch overriding the [node-bindings library](https://github.com/TooTallNate/node-bindings),
 * because native C/C++ bindings don't really make sense in a browser extension.
 *
 * Some of our transitive dependencies (through metamask-crx) are designed to work *both* in the
 * browser and in Node. Node-binding doesn't behave well when included in a webpack bundle,
 * so we're overriding it with an instant-throw function.
 * 
 * This has two possible effective outcomes:
 *  * Some libraries designed to work both in Node and in the browser are wrapping the call to
 *    node-bindings in a try/catch structure and falling back to a JS-only implementation if
 *    an error is caught. These are perfectly suited for our instant-throw solution.
 *    Here's an example: https://github.com/cryptocoinjs/keccak/blob/8de80ff3b9518fcbb0a0f3173144baa17c5c9f5d/index.js
 *  * Some libraries are badly designed and rely on some userland magic in order to work in a browser bundle.
 *    For these, you'll likely have to figure out a fix on your own, and use Webpack's aliasing
 *    feature to trick the modules into requiring your fixed version. For example, check
 *    dnode-patch.js, which is used to fix the Dnode library (on which metamask heavily depends).
 *    You may also consider sending a PR to the library.
 */
module.exports = function() {
  const message = `
    This is not the real node-bindings library. Node-bindings doesn't make sense in a webpack
    bundle. This is a mock that is aliased by webpack, and is nothing but a function that
    throws an error. This probably happens because you're trying to include in the Webpack bundle
    a library that requires native bindings and is not designed to work in the browser.
  `;
  throw new Error(message);
}