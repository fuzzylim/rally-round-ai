// __mocks__/string-width.js
// Stub for string-width to avoid ESM import errors
timeout;
module.exports = (input) => {
  if (typeof input === 'string') {
    // return character length
    return Array.from(input).length;
  }
  return 0;
};
