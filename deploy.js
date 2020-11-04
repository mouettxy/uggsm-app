"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
/* eslint-disable @typescript-eslint/no-var-requires */
var dotenv = __importStar(require("dotenv"));
var node_ssh_1 = require("node-ssh");
var fs = __importStar(require("fs"));
var inquirer = __importStar(require("inquirer"));
var promisify_child_process_1 = require("promisify-child-process");
var ora_1 = __importDefault(require("ora"));
var chalk_1 = __importDefault(require("chalk"));
dotenv.config();
var config = {
    b: {
        app: __dirname + "/packages/uggsm-client/dist",
        appPckg: __dirname + "/packages/uggsm-client/package.json",
        srv: __dirname + "/packages/uggsm-server/dist",
        srvPckg: __dirname + "/packages/uggsm-server/package.json",
        bckp: __dirname + "/packages/uggsm-backup-system/dist",
        bckpPckg: __dirname + "/packages/uggsm-backup-system/package.json",
        cli: __dirname + "/packages/uggsm-cli/dist",
        cliPckg: __dirname + "/packages/uggsm-cli/package.json"
    },
    d: {
        srv: '/var/www/api',
        srvPckg: '/var/www/api/package.json',
        app: '/var/www/app',
        bckp: '/var/uggsm-backup',
        bckpPckg: '/var/uggsm-backup/package.json'
    }
};
var Deploy = /** @class */ (function () {
    function Deploy(ssh) {
        this.spinner = null;
        this.scope = '';
        this.commentsShortcuts = {
            buildStart: 'Собираем проект...',
            buildEnd: 'Проект успешно собран!',
            putBuildFolderStart: 'Размещаем проект на сервере...',
            putBuildFolderEnd: 'Проект успешно размещён!',
            putDependenciesFileStart: 'Размещаем файл зависимостей на сервере...',
            putDependenciesFileEnd: 'Файл успешно размещён!',
            setupDependenciesStart: 'Устанавливаем зависимости...',
            setupDependenciesEnd: 'Зависимости установлены!',
            deleteLocalStart: 'Удаляем локальную копию сборки...',
            deleteLocalEnd: 'Локальная копия успешно удалена!'
        };
        this.sshConnection = ssh;
        this.queue = Promise.resolve();
    }
    Deploy.prototype.then = function (callback) {
        callback(this.queue);
    };
    Deploy.prototype.chain = function (callback) {
        return (this.queue = this.queue.then(callback));
    };
    Deploy.prototype.setScope = function (scope) {
        this.scope = scope.toUpperCase();
        return this;
    };
    Deploy.prototype.start = function () {
        console.time('Скрипт завершил работу за:');
        return this;
    };
    Deploy.prototype.end = function () {
        console.timeEnd('Скрипт завершил работу за:');
        return this;
    };
    Deploy.prototype.log = function (message) {
        var _this = this;
        this.chain(function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        if (_this.commentsShortcuts[message]) {
                            message = _this.commentsShortcuts[message];
                        }
                        message = chalk_1["default"].white.bold.bgBlackBright("" + _this.scope) + " " + chalk_1["default"].white(message) + "|" + console.timeLog('Скрипт завершил работу за:');
                        if (!_this.spinner) {
                            console.log(message);
                            _this.spinner = ora_1["default"](message).start();
                        }
                        else {
                            _this.spinner.stop();
                            console.log(message);
                            _this.spinner = ora_1["default"](message).start();
                        }
                        resolve(message);
                    })];
            });
        }); });
        return this;
    };
    Deploy.prototype.exec = function (command, logBefore, logAfter) {
        var _this = this;
        if (logBefore) {
            this.log(logBefore);
        }
        this.chain(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promisify_child_process_1.exec(command)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        if (logAfter) {
            this.log(logAfter);
        }
        return this;
    };
    Deploy.prototype.sshExec = function (command, cwd, logBefore, logAfter) {
        var _this = this;
        if (logBefore) {
            this.log(logBefore);
        }
        this.chain(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sshConnection.execCommand(command, { cwd: cwd })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        if (logAfter) {
            this.log(logAfter);
        }
        return this;
    };
    Deploy.prototype.sshPutDir = function (origin, destination, logBefore, logAfter) {
        var _this = this;
        if (logBefore) {
            this.log(logBefore);
        }
        this.chain(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sshConnection.putDirectory(origin, destination, {
                            recursive: true,
                            concurrency: 10
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        if (logAfter) {
            this.log(logAfter);
        }
        return this;
    };
    Deploy.prototype.sshPutFile = function (origin, destination, logBefore, logAfter) {
        var _this = this;
        if (logBefore) {
            this.log(logBefore);
        }
        this.chain(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sshConnection.putFile(origin, destination)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        if (logAfter) {
            this.log(logAfter);
        }
        return this;
    };
    Deploy.prototype.rmDir = function (path, logBefore, logAfter) {
        if (logBefore) {
            this.log(logBefore);
        }
        this.chain(function () {
            return new Promise(function (resolve) {
                fs.rmdirSync(path, { recursive: true });
                resolve(path);
            });
        });
        if (logAfter) {
            this.log(logAfter);
        }
        return this;
    };
    return Deploy;
}());
function deployment(deploy, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, {
                    server: function () {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, deploy
                                            .start()
                                            .setScope('server')
                                            .exec('yarn build:server', 'buildStart', 'buildEnd')
                                            .sshPutDir(config.b.srv, config.d.srv, 'putBuildFolderStart', 'putBuildFolderEnd')
                                            .sshPutFile(config.b.srvPckg, config.d.srvPckg, 'putDependenciesFileStart', 'putDependenciesFileEnd')
                                            .sshExec('npm i', config.d.srv, 'setupDependenciesStart', 'setupDependenciesEnd')
                                            .rmDir(config.b.srv, 'deleteLocalStart', 'deleteLocalEnd')
                                            .end()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    },
                    client: function () {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, deploy
                                            .start()
                                            .setScope('application')
                                            .exec('yarn build:app', 'buildStart', 'buildEnd')
                                            .sshPutDir(config.b.app, config.d.app, 'putBuildFolderStart', 'putBuildFolderEnd')
                                            .rmDir(config.b.app, 'deleteLocalStart', 'deleteLocalEnd')
                                            .end()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    },
                    bckpSystem: function () {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, deploy
                                            .start()
                                            .setScope('backup system')
                                            .exec('yarn build:backup-system', 'buildStart', 'buildEnd')
                                            .sshPutDir(config.b.bckp, config.d.bckp, 'putBuildFolderStart', 'putBuildFolderEnd')
                                            .sshPutFile(config.b.bckpPckg, config.d.bckpPckg, 'putDependenciesFileStart', 'putDependenciesFileEnd')
                                            .sshExec('npm i', config.d.bckp, 'setupDependenciesStart', 'setupDependenciesEnd')
                                            .rmDir(config.b.bckp, 'deleteLocalStart', 'deleteLocalEnd')
                                            .end()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    }
                }];
        });
    });
}
function run(scope) {
    return __awaiter(this, void 0, void 0, function () {
        var ssh, deploy, d, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, new node_ssh_1.NodeSSH().connect({
                        host: process.env.DEPLOY_HOST,
                        username: process.env.DEPLOY_USER,
                        password: process.env.DEPLOY_PASSWD
                    })];
                case 1:
                    ssh = _b.sent();
                    deploy = new Deploy(ssh);
                    return [4 /*yield*/, deployment(deploy, config)];
                case 2:
                    d = _b.sent();
                    _a = scope;
                    switch (_a) {
                        case 'deploy-only-server': return [3 /*break*/, 3];
                        case 'deploy-only-client': return [3 /*break*/, 5];
                        case 'deploy-backup-system': return [3 /*break*/, 7];
                        case 'deploy-client-and-server': return [3 /*break*/, 9];
                    }
                    return [3 /*break*/, 12];
                case 3: return [4 /*yield*/, d.server()];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 12];
                case 5: return [4 /*yield*/, d.client()];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 12];
                case 7: return [4 /*yield*/, d.bckpSystem()];
                case 8:
                    _b.sent();
                    return [3 /*break*/, 12];
                case 9: return [4 /*yield*/, d.client()];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, d.server()];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 12];
                case 12:
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
}
function cli() {
    return __awaiter(this, void 0, void 0, function () {
        var secondQuestion;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt([
                        {
                            type: 'list',
                            name: 'scope',
                            message: 'Что деплоим?',
                            "default": 'Только клиент',
                            choices: [
                                {
                                    name: 'Клиент и Сервер',
                                    value: 'deploy-client-and-server'
                                },
                                {
                                    name: 'Только клиент',
                                    value: 'deploy-only-client'
                                },
                                {
                                    name: 'Только сервер',
                                    value: 'deploy-only-server'
                                },
                                {
                                    name: 'Только система бэкапов',
                                    value: 'deploy-backup-system'
                                },
                            ]
                        },
                    ])];
                case 1:
                    secondQuestion = _a.sent();
                    if (secondQuestion.scope) {
                        run(secondQuestion.scope);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
cli();
