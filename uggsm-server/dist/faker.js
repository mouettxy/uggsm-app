"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const faker_1 = __importDefault(require("faker"));
const models_1 = require("./models");
const helpers_1 = require("./utils/helpers");
const enums_1 = require("./utils/enums");
faker_1.default.locale = 'ru';
faker_1.default.seed(12345);
const roles = ['administrator', 'master', 'manager'];
const officeTemplates = [
    '1{C:4}',
    '2{C:4}',
    '3{C:4}',
    '4{C:4}',
    '5{C:4}',
    '6{C:4}',
    '7{C:4}',
    '8{C:4}',
    '9{C:4}',
    '11{C:4}',
    '12{C:4}',
    '13{C:4}',
    '14{C:4}',
    '15{C:4}',
    '16{C:4}',
    '17{C:4}',
    '18{C:4}',
    '19{C:4}',
    '22{C:4}',
    '23{C:4}',
    '24{C:4}',
    '25{C:4}',
    '26{C:4}',
    '27{C:4}',
    '28{C:4}',
    '29{C:4}',
    '33{C:4}',
    '34{C:4}',
    '35{C:4}',
    '36{C:4}',
    '37{C:4}',
    '38{C:4}',
    '39{C:4}',
    '44{C:4}',
    '45{C:4}',
    '46{C:4}',
    '47{C:4}',
    '48{C:4}',
    '49{C:4}',
    '55{C:4}',
];
const savedMasterIds = [];
const savedManagerIds = [];
const savedOfficeIds = [];
function createOffices() {
    return __awaiter(this, void 0, void 0, function* () {
        const offices = [];
        for (let i = 0; i < 10; i += 1) {
            const office = new models_1.OfficeModel({
                code: faker_1.default.address.stateAbbr(),
                name: faker_1.default.address.timeZone(),
                ordersTemplate: faker_1.default.random.arrayElement(officeTemplates),
                docsTemplate: faker_1.default.random.arrayElement(officeTemplates),
                address: faker_1.default.address.streetAddress(),
            });
            offices.push(office);
        }
        return offices;
    });
}
function createUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = [];
        for (let i = 0; i < 100; i += 1) {
            const user = new models_1.UserModel({
                username: faker_1.default.internet.userName(),
                password: faker_1.default.internet.password(),
                credentials: faker_1.default.name.findName(),
                role: faker_1.default.random.arrayElement(roles),
                office: faker_1.default.random.arrayElement(savedOfficeIds),
            });
            users.push(user);
        }
        return users;
    });
}
// create orders
function createOrders() {
    return __awaiter(this, void 0, void 0, function* () {
        const orders = [];
        console.time();
        for (let i = 0; i < 1000; i += 1) {
            const officeId = faker_1.default.random.arrayElement(savedOfficeIds);
            const office = yield models_1.OfficeModel.findById(officeId);
            const date = new Date();
            date.setDate(date.getDate() + 7);
            const order = new models_1.OrderModel({
                customerName: faker_1.default.name.findName(),
                customerPhone: faker_1.default.phone.phoneNumber(),
                office: officeId,
                master: faker_1.default.random.arrayElement(savedMasterIds),
                manager: faker_1.default.random.arrayElement(savedManagerIds),
                status: faker_1.default.random.arrayElement(enums_1.statuses),
                phoneBrand: faker_1.default.vehicle.manufacturer(),
                phoneModel: faker_1.default.vehicle.model(),
                quick: faker_1.default.random.boolean(),
                password: faker_1.default.internet.password(),
                serialNumber: faker_1.default.random.alphaNumeric(15),
                declaredDefect: faker_1.default.random.words(5),
                kit: faker_1.default.random.words(2),
                declaredPrice: faker_1.default.random.number(5000),
                estimatedCloseAt: date,
            });
            const firstIteration = yield order.save();
            // @ts-ignore
            firstIteration.setNext('order_id', (_err, doc) => __awaiter(this, void 0, void 0, function* () {
                const generatedId = helpers_1.generateOrderId(office.ordersTemplateParsed, firstIteration.id);
                firstIteration.id = generatedId;
                const secondIteration = yield firstIteration.save();
                orders.push(secondIteration.id);
                //console.log(`Order created ${secondIteration.id}`)
            }));
            console.log(orders.length);
        }
        console.timeEnd();
        return orders;
    });
}
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const offices = yield createOffices();
        for (const office in offices) {
            const saved = yield offices[office].save();
            savedOfficeIds.push(saved._id);
        }
        const users = yield createUsers();
        for (const user in users) {
            const saved = yield users[user].save();
            if (saved.role === 'master') {
                savedMasterIds.push(saved._id);
            }
            if (saved.role === 'manager') {
                savedManagerIds.push(saved._id);
            }
        }
        yield createOrders();
    });
}
exports.seedDatabase = seedDatabase;
