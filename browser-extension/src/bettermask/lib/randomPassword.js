/**
 * Get an ASCII character from any positive integer
 * We're projecting the input onto a subset of the ASCII table (33 to 126,
 * aka the characters that you can't summon a demon with)
 * @see http://lmgtfy.com/?q=ascii+table
 *
 * This does divide the original entropy by ~3 if your input is a Uint8
 */
const toAsciiChar = (n) => {
  const minCharcode = 33;
  const maxCharcode = 126;
  const diff = maxCharcode - minCharcode + 1;

  const charCode = n % diff + minCharcode;
  return String.fromCharCode(charCode);
}

export default function generatePassword(len) {
  var arr = new Uint8Array(len || 64);
  window.crypto.getRandomValues(arr);

  return Array.from(arr, toAsciiChar).join('');
}
