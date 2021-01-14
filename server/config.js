let instance = null

export class Config {
    constructor() {
        if (!instance) {
            instance = this
            if (process.env.NODE_ENV === 'production') {
                this.PORT = 12345
                this.secret = process.env.SECRET
                this.connectionString = "mongodb+srv://admin:TAGAdmin@server-v3-1-wnt86.mongodb.net/TLDL_production?retryWrites=true&w=majority"
            } else if (process.env.NODE_ENV === 'development') {
                this.PORT = 12345
                this.connectionString = "mongodb+srv://admin:TAGAdmin@server-v3-1-wnt86.mongodb.net/TLDL_dev?retryWrites=true&w=majority"
                this.secret = "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING"
            } else {
                throw 'Please set up your environment variables properly'
            }
        }

        return instance
    }

}
