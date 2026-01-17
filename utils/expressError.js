class expressError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode; // capital C (important)
  }
}

module.exports = expressError;
