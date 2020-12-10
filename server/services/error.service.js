const db = require('../models/db');
const Error = db.Error;

module.exports = {
    create
};

async function create(errorParams) {
    const error = new Error(errorParams);
    error.save();
}
