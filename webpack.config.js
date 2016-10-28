/**
 * Created by Baskoro Indrayana on 10/28/2016.
 */
switch (process.env.NODE_ENV) {
    case 'dev':
    case 'development':
    case 'prod':
    case 'production':
    default:
        module.exports = require('./config/webpack.dev.config');
        break;
}