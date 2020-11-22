// Dependencies
const mongoose = require('mongoose')

/**
 * Setting up mongoose
 */
function setupMongoose() {
    // Setup bluebird as a promise engine
    mongoose.Promise = global.Promise
    // use new implementations instead of deprecated ones
    mongoose.set('useCreateIndex', true);
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);
    // Connect to the db
    mongoose.connect(process.env.MONGO_URL, {
        // DB gets huge, so setting up custom timeouts
        socketTimeoutMS: 10000,
        connectTimeoutMS: 50000,
    })
    // Reconnect on disconnect
    mongoose.connection.on('disconnected', () => {
        mongoose.connect(process.env.MONGO_URL, {
            // DB gets huge, so setting up custom timeouts
            socketTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        })
    })
}

// Exports
module.exports = setupMongoose
