"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = exports.connectWithRetry = exports.initializePlugins = exports.AutoIncrement = void 0;
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_sequence_1 = __importDefault(require("mongoose-sequence"));
// @ts-ignore
exports.AutoIncrement = mongoose_sequence_1.default(mongoose_1.default);
mongoose_1.default.set('useNewUrlParser', true);
mongoose_1.default.set('useFindAndModify', false);
mongoose_1.default.set('useCreateIndex', true);
mongoose_1.default.set('useUnifiedTopology', true);
const { MONGO_USER, MONGO_PASSWORD, DB_CONNECTION_STRING, DB_SERVER } = process.env;
function initializePlugins(_connection) {
    // do nothing right now
}
exports.initializePlugins = initializePlugins;
function connectWithRetry(uri) {
    return mongoose_1.default.connect(uri, function (err) {
        if (err) {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec');
            setTimeout(() => {
                connectWithRetry(uri);
            }, 5000);
        }
        else {
            console.log('MongoDB connected succesefuly');
        }
    });
}
exports.connectWithRetry = connectWithRetry;
function connectToDatabase() {
    const DB_URL = `${DB_CONNECTION_STRING}${MONGO_USER}:${MONGO_PASSWORD}${DB_SERVER}?connectTimeoutMS=1000&bufferCommands=false&authSource=admin`;
    connectWithRetry(DB_URL);
}
exports.connectToDatabase = connectToDatabase;
