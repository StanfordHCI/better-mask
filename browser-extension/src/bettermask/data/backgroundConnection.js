/**
 * Stateful module used to store the connection to the background page instanciated in xxx
 */

var backgroundConnection = null;

export function setBackgroundConnection(bg) {
  backgroundConnection = bg;
}

function getBackgroundConnection() {
  return backgroundConnection;
}

export default getBackgroundConnection;
