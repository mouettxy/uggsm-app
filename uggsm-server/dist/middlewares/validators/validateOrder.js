"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.order = exports.office = exports.manager = exports.master = exports.payed = exports.status = exports.workflow = exports.managerComment = exports.masterComment = exports.completedWork = exports.sms = void 0;
const check_1 = require("express-validator/check");
const requiredFieldsHelper = (...args) => {
    const fields = [];
    args.forEach((e) => {
        fields.push(check_1.body(e).not().isEmpty().withMessage('Необходимое поле'));
    });
    return fields;
};
const badRequestHelper = () => {
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
exports.sms = [...requiredFieldsHelper('message'), badRequestHelper()];
exports.completedWork = [...requiredFieldsHelper('message'), badRequestHelper()];
exports.masterComment = [...requiredFieldsHelper('message'), badRequestHelper()];
exports.managerComment = [...requiredFieldsHelper('message'), badRequestHelper()];
exports.workflow = [...requiredFieldsHelper('message'), badRequestHelper()];
exports.status = [...requiredFieldsHelper('status'), badRequestHelper()];
exports.payed = [...requiredFieldsHelper('payed'), badRequestHelper()];
exports.master = [...requiredFieldsHelper('master'), badRequestHelper()];
exports.manager = [...requiredFieldsHelper('manager'), badRequestHelper()];
exports.office = [...requiredFieldsHelper('office'), badRequestHelper()];
exports.order = [
    ...requiredFieldsHelper('customerName', 'customerPhone', 'phoneModel', 'serialNumber', 'declaredDefect', 'kit'),
    badRequestHelper(),
];
