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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePaginateResponse = exports.generateOrderId = exports.badRequestHelper = exports.requiredFieldsHelper = exports.processWorkflowData = exports.extendArrayWithId = exports.getAnonymousAnimal = void 0;
const lodash_1 = require("lodash");
const models_1 = require("../models");
const check_1 = require("express-validator/check");
function getAnonymousAnimal() {
    const animals = [
        'Неопознанный аллигатор',
        'Неопознанный муравьед',
        'Неопознанный броненосец',
        'Неопознанный зубр',
        'Неопознанный аксолотль',
        'Неопознанный барсук',
        'Неопознанная летучая мышь',
        'Неопознанный бобр',
        'Неопознанный буйвол',
        'Неопознанный верблюд',
        'Неопознанный хамелеон',
        'Неопознанный гепард',
        'Неопознанный бурундук',
        'Неопознанная шиншилла',
        'Неопознанная чупакабра',
        'Неопознанный баклан',
        'Неопознанный койот',
        'Неопознанная ворона',
        'Неопознанный динго',
        'Неопознанный динозавр',
        'Неопознанная собака',
        'Неопознанный дельфин',
        'Неопознанный дракон',
        'Неопознанная утка',
        'Неопознанный думбо',
        'Неопознанный слон',
        'Неопознанный хорек',
        'Неопознанная лиса',
        'Неопознанная лягушка',
        'Неопознанный жираф',
        'Неопознанный гусь',
        'Неопознанный суслик',
        'Неопознанный гризли',
        'Неопознанный хомяк',
        'Неопознанный еж',
        'Неопознанный бегемот',
        'Неопознанная гиена',
        'Неопознанный шакал',
        'Неопознанный горный козел',
        'Неопознанный ифрит',
        'Неопознанный игуана',
        'Неопознанный кенгуру',
        'Неопознанная коала',
        'Неопознанный кракен',
        'Неопознанный лемур',
        'Неопознанный леопард',
        'Неопознанный лев',
        'Неопознанная лама',
        'Неопознанный ламантин',
        'Неопознанная норка',
        'Неопознанная обезьяна',
        'Неопознанный лось',
        'Неопознанный нарвал',
        'Неопознанный орангутанг',
        'Неопознанная выдра',
        'Неопознанная панда',
        'Неопознанный пингвин',
        'Неопознанный утконос',
        'Неопознанный питон',
        'Неопознанная тыква',
        'Неопознанная квагга',
        'Неопознанный кролик',
        'Неопознанный енот',
        'Неопознанный носорог',
        'Неопознанная овца',
        'Неопознанная землеройка',
        'Неопознанный скунс',
        'Неопознанный медленный лори',
        'Неопознанная белка',
        'Неопознанный тигр',
        'Неопознанная черепаха',
        'Неопознанный единорог',
        'Неопознанный морж',
        'Неопознанный волк',
        'Неопознанный росомаха',
        'Неопознанный вомбат',
    ];
    return animals[Math.floor(Math.random() * animals.length)];
}
exports.getAnonymousAnimal = getAnonymousAnimal;
function extendArrayWithId(extend, data) {
    let data_ = lodash_1.cloneDeep(data);
    if (extend.length === 0) {
        data_ = Object.assign({ id: 1 }, data_);
    }
    else {
        const lastIdInc = lodash_1.last(extend).id + 1;
        data_ = Object.assign(Object.assign({}, data_), { id: lastIdInc });
    }
    return data_;
}
exports.extendArrayWithId = extendArrayWithId;
function processWorkflowData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const data_ = lodash_1.cloneDeep(data);
        if (data_.userid) {
            try {
                const user = yield models_1.UserModel.findOne({ id: data_.userid });
                if (user) {
                    data_.username = user.credentials;
                }
                else {
                    data_.username = getAnonymousAnimal();
                }
            }
            catch (e) {
                data_.username = getAnonymousAnimal();
            }
        }
        else {
            data_.username = getAnonymousAnimal();
        }
        return data_;
    });
}
exports.processWorkflowData = processWorkflowData;
exports.requiredFieldsHelper = (...args) => {
    const fields = [];
    args.forEach((e) => {
        fields.push(check_1.body(e).not().isEmpty().withMessage('Необходимое поле'));
    });
    return fields;
};
exports.badRequestHelper = () => {
    return (req, res, next) => {
        const validationErrors = check_1.validationResult(req);
        if (!validationErrors.isEmpty()) {
            res.status(400).json({
                status: 400,
                message: 'Bad Request',
                errors: validationErrors.array(),
            });
        }
        else {
            next();
        }
    };
};
exports.generateOrderId = (parsed, identifier) => {
    if (parsed.modifier === 'C') {
        return parseInt(`${parsed.start}${identifier.toString().length >= parsed.modifierCount
            ? ''
            : '0'.repeat(parsed.modifierCount - identifier.toString().length)}${identifier.toString()}`);
    }
};
exports.parsePaginateResponse = (requestQuery, needOffice = false, model = undefined) => {
    let query = {};
    if (needOffice) {
        query.office = requestQuery.office;
    }
    const page = requestQuery.page;
    const limit = requestQuery.limit;
    const options = {
        page,
        limit,
    };
    if (requestQuery.sort) {
        try {
            options.sort = JSON.parse(`${requestQuery.sort}`);
        }
        catch (e) {
            // do nothing
        }
    }
    if (requestQuery.search) {
        if (model) {
            const searchQuery = model.searchBuilder(requestQuery.search);
            if (parseInt(requestQuery.search)) {
                searchQuery.$and[0].$or.push({ id: { $gte: requestQuery.search, $lte: requestQuery.search } });
            }
            query = Object.assign(Object.assign({}, query), searchQuery);
        }
    }
    if (requestQuery.filter) {
        const filter = JSON.parse(requestQuery.filter);
        const newFilter = {};
        for (const k in filter) {
            if (filter[k]) {
                if (parseInt(filter[k])) {
                    newFilter[k] = { $gte: filter[k] };
                }
                else {
                    newFilter[k] = { $regex: new RegExp(filter[k], 'i') };
                }
            }
        }
        Object.assign(query, newFilter);
    }
    if (requestQuery.master) {
        query.master = requestQuery.master;
    }
    if (requestQuery.hideStatuses) {
        query.status = { $not: { $in: requestQuery.hideStatuses } };
    }
    return {
        query,
        options,
    };
};
