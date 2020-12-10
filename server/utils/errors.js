class CustomError {
    constructor(message, name) {
        this.message = message;
        this.name = name; // (different names for different built-in error classes)
    }
}

class NoKeyInDB extends CustomError{
    constructor(message) {
        super(message, "NoKeyInDB");
    }
}

module.exports = {
    NoKeyInDB,
    CustomError
};
