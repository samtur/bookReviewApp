class expressError extends Error {
    constructor(message, statusCode) {
        constructor(message, statusCode)
        super();
        this.message = message;
        this.statusCode = statusCode;

    }

}

module.exports = expressError;