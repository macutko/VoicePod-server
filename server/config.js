let instance = null

export class Config {

    constructor() {
        if (!instance) {
            instance = this
            if (process.env.NODE_ENV === 'production') {
                this.PORT = 12345
                //TODO: need to add mail options to production
                //TODO: need to add stripe options to production
                this.secret = process.env.SECRET
                this.baseURL = "http://localhost:5001/"
                this.connectionString = "mongodb+srv://admin:TAGAdmin@server-v3-1-wnt86.mongodb.net/CONZLT_production?retryWrites=true&w=majority"
            } else if (process.env.NODE_ENV === 'development') {
                this.PORT = 12345
                this.baseURL = "http://localhost:5001/"
                this.mailConfig = {
                    service: 'gmail',
                    auth: {
                        user: 'conzlttestmail@gmail.com',
                        pass: 'conzlt123'
                    }
                }
                this.mailBugOptions = {
                    from: 'conzlttestmail@gmail.com',
                    to: 'incoming+macutko-tldl-client-22930948-issue-@incoming.gitlab.com',
                };
                this.connectionString = "mongodb+srv://admin:TAGAdmin@server-v3-1-wnt86.mongodb.net/CONZLT_dev?retryWrites=true&w=majority"
                this.stripe = require('stripe')('rk_test_51IDSTZECU7HrwjM1CctplX9fQXrLB635qNpBL6QpCyKXHQUXlMFyDCjbggdyvoqzhqBCthsR1rBbBDvIRjDVZXwK00BZo1zUxg')
                this.secret = "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING"
            } else {
                throw 'Please set up your environment variables properly'
            }
        }

        return instance
    }

}
