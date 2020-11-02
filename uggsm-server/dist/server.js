"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
require("reflect-metadata");
const RestApi_1 = __importDefault(require("./RestApi"));
const routes_1 = require("./routes");
const clientRoutes_1 = require("./routes/clientRoutes");
const utils_1 = require("./utils");
require("./services/jobs");
utils_1.validateEnv();
exports.api = new RestApi_1.default([
    new routes_1.AuthenticationRouter(),
    new routes_1.OrdersRouter(),
    new routes_1.UsersRouter(),
    new routes_1.OfficeRouter(),
    new routes_1.CashRouter(),
    new clientRoutes_1.ClientRouter(),
    new routes_1.AdversitementRouter(),
    new routes_1.AutocompleteRouter(),
    new routes_1.EmailSubscriptionRouter(),
]);
exports.api.io.on('connection', () => {
    //
});
exports.api.listen();
/* async function seed() {
  await mongoose.connection.dropDatabase()

  seedDatabase()
}

seed() */
