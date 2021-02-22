class CustomError {
    constructor(message, name, code) {
        this.message = message;
        this.name = name; // (different names for different built-in error classes)
    }
}

class NoKeyInDB extends CustomError {
    constructor(message, code) {
        super(message, 'NoKeyInDB', code);
    }
}

module.exports = {
    NoKeyInDB,
    CustomError,
};
