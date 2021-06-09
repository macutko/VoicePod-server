let instance = null;

export class Config {
    constructor() {
        if (!instance) {
            instance = this;
            if (process.env.NODE_ENV === 'production') {
                this.PORT = 12345;
                // TODO: need to add mail options to production
                // TODO: need to add stripe options to production
                this.secret = process.env.SECRET;
                this.baseURL = 'http://localhost:5001/';
                this.connectionString =
          '';
            } else if (process.env.NODE_ENV === 'development') {
                this.PORT = 12345;
                this.baseURL = 'http://localhost:5001/';
                this.mailConfig = {
                    service: 'gmail',
                    auth: {
                        user: '',
                        pass: '',
                    },
                };
                this.mailBugOptions = {
                    from: '',
                    to:
            '',
                };
                this.connectionString =
          '';
                this.stripe = require('stripe')(
                    // eslint-disable-next-line max-len
                    ''
                );
                this.secret =
          'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING';
            } else {
                throw 'Please set up your environment variables properly';
            }
        }

        return instance;
    }
}
