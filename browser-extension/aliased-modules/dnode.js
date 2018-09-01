var dnode = require('__original_dnode__');

/**
 * This is a patched version of Dnode that forces the `weak` option to be false no matter
 * what. This effectively prevents dnode from trying to use the [Weak library](https://github.com/TooTallNate/node-weak).
 * Dnode still seems to works fine without weak (it's likely used for performance).
 * 
 * The need for this patch emerges from the fact that weak requires native C/C++ bindings, and these bindings
 * are not available (and don't make sense) in the browser. This patch eliminates the need for the
 * [node-bindings](https://github.com/TooTallNate/node-bindings) library, which is not designed to work
 * in a browser and fails when included in a Webpack bundle.
 */
var dnodePatch = function(cons, opts) {
  const overriddenOpts = {...opts, weak: false};
  return dnode(cons, overriddenOpts);
}

module.exports = dnodePatch;
