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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
const node_ssh_1 = require("node-ssh");
const fs = __importStar(require("fs"));
const inquirer = __importStar(require("inquirer"));
const promisify_child_process_1 = require("promisify-child-process");
const config_1 = __importDefault(require("./config"));
const helpers_1 = require("./helpers");
const logging_1 = require("./helpers/logging");
const currentSpinnerInstance = null;
function deployServer(ssh, config) {
    return __awaiter(this, void 0, void 0, function* () {
        logging_1.log('server', 'Собираем проект ...', currentSpinnerInstance);
        yield promisify_child_process_1.exec('npm run build-server');
        logging_1.log('server', 'Сборка завершена', currentSpinnerInstance);
        logging_1.log('server', 'Удаляем файлы старой сборки ...', currentSpinnerInstance);
        yield ssh.execCommand(`rm -rf /var/www/api`, { cwd: '/' });
        logging_1.log('server', 'Файлы старой сборки удалены успешно', currentSpinnerInstance);
        logging_1.log('server', 'Размещаем файлы новой сборки ...', currentSpinnerInstance);
        yield ssh.putDirectory(config.folders.buildedServer, config.server.serverFolder, {
            recursive: true,
            concurrency: 10,
        });
        logging_1.log('server', 'Файлы новой сборки размещены успешно', currentSpinnerInstance);
        logging_1.log('server', 'Устанавливаем зависимости на сервере ...', currentSpinnerInstance);
        yield ssh.putFile(config.folders.buildedServerPackage, config.server.serverFolderPackage);
        yield ssh.execCommand('npm i', { cwd: config.server.serverFolder });
        logging_1.log('server', 'Зависимости установлены успешно', currentSpinnerInstance);
        logging_1.log('server', 'Удаляем временные файлы проекта ...', currentSpinnerInstance);
        fs.rmdirSync(config.folders.buildedServer, { recursive: true });
        logging_1.log('server', 'Временные файлы удалены успешно', currentSpinnerInstance);
        return Promise.resolve(true);
    });
}
function deployBackupSystem(ssh, config) {
    return __awaiter(this, void 0, void 0, function* () {
        logging_1.log('backup system', 'Собираем проект ...', currentSpinnerInstance);
        yield promisify_child_process_1.exec('npm run build-backup-system');
        logging_1.log('backup system', 'Проект собран успешно', currentSpinnerInstance);
        logging_1.log('backup system', 'Удаляем файлы старой сборки ...', currentSpinnerInstance);
        yield ssh.execCommand(`rm -rf /var/uggsm-backup`, { cwd: '/' });
        logging_1.log('backup system', 'Файлы старой сборки удалены успешно', currentSpinnerInstance);
        logging_1.log('backup system', 'Размещаем файлы новой сборки ...', currentSpinnerInstance);
        yield ssh.putDirectory(config.folders.buildedBackupSystem, config.server.backupSystemFolder, {
            recursive: true,
            concurrency: 10,
        });
        logging_1.log('backup system', 'Файлы новой сборки размещены успешно', currentSpinnerInstance);
        logging_1.log('backup system', 'Устанавливаем зависимости на сервере ...', currentSpinnerInstance);
        yield ssh.putFile(config.folders.buildedBackupSystemPackage, config.server.backupSystemFolderPackage);
        yield ssh.execCommand('npm i', { cwd: config.server.backupSystemFolder });
        logging_1.log('backup system', 'Зависимости установлены успешно', currentSpinnerInstance);
        logging_1.log('backup system', 'Удаляем временные файлы проекта ...', currentSpinnerInstance);
        fs.rmdirSync(config.folders.buildedBackupSystem, { recursive: true });
        logging_1.log('backup system', 'Временные файлы удалены успешно', currentSpinnerInstance);
        return Promise.resolve(true);
    });
}
function deployClient(ssh, config) {
    return __awaiter(this, void 0, void 0, function* () {
        logging_1.log('backup system', 'Собираем проект ...', currentSpinnerInstance);
        yield promisify_child_process_1.exec('npm run build-client');
        logging_1.log('backup system', 'Проект собран успешно', currentSpinnerInstance);
        logging_1.log('backup system', 'Размещаем файлы новой сборки ...', currentSpinnerInstance);
        yield ssh.putDirectory(config.folders.buildedClient, config.server.clientFolder, {
            recursive: true,
            concurrency: 10,
        });
        logging_1.log('backup system', 'Файлы новой сборки размещены успешно', currentSpinnerInstance);
        logging_1.log('backup system', 'Удаляем временные файлы проекта ...', currentSpinnerInstance);
        fs.rmdirSync(config.folders.buildedClient, { recursive: true });
        logging_1.log('backup system', 'Временные файлы удалены успешно', currentSpinnerInstance);
        return Promise.resolve(true);
    });
}
function run(scope) {
    return __awaiter(this, void 0, void 0, function* () {
        const ssh = yield helpers_1.connectSSH(new node_ssh_1.NodeSSH(), {
            host: process.env.DEPLOY_HOST,
            username: process.env.DEPLOY_USER,
            password: process.env.DEPLOY_PASSWD,
        });
        if (scope === 'deploy-only-server') {
            yield deployServer(ssh, config_1.default);
            logging_1.log('global', 'Сервер успешно собран и выгружен', currentSpinnerInstance);
        }
        if (scope === 'deploy-only-client') {
            yield deployClient(ssh, config_1.default);
            logging_1.log('global', 'Клиент успешно собран и выгружен', currentSpinnerInstance);
        }
        if (scope === 'deploy-client-and-server') {
            yield deployServer(ssh, config_1.default);
            yield deployClient(ssh, config_1.default);
            logging_1.log('global', 'Клиент и Сервер успешно собраны и выгружены', currentSpinnerInstance);
        }
        if (scope === 'deploy-backup-system') {
            yield deployBackupSystem(ssh, config_1.default);
            logging_1.log('global', 'Система бэкапов успешно собрана и выгружена', currentSpinnerInstance);
        }
        process.exit();
    });
}
function runCommands(command) {
    return __awaiter(this, void 0, void 0, function* () {
        const ssh = yield helpers_1.connectSSH(new node_ssh_1.NodeSSH(), {
            host: process.env.DEPLOY_HOST,
            username: process.env.ROOT_USERNAME,
            password: process.env.ROOT_PASSWORD,
        });
        let result;
        if (command === 'restart') {
            logging_1.log('command', 'Запуск рестарта демонов ...', currentSpinnerInstance);
            yield ssh.execCommand('systemctl restart uggsm-api && systemctl restart mongod && systemctl restart nginx');
            logging_1.log('command', 'Успешный рестарт', currentSpinnerInstance);
            logging_1.log('command', 'Ожидаем запуска ...', currentSpinnerInstance);
            yield helpers_1.sleep(10000);
            logging_1.log('command', 'Получаем текущий статус ...', currentSpinnerInstance);
            result = {
                api: (yield ssh.execCommand('systemctl status uggsm-api')).stdout,
                mongod: (yield ssh.execCommand('systemctl status mongod')).stdout,
                nginx: (yield ssh.execCommand('systemctl status nginx')).stdout,
            };
            logging_1.log('command', 'Текущий статус успешно получен', currentSpinnerInstance);
        }
        else if (command === 'restart-server') {
            logging_1.log('command', 'Запуск рестарта сервера ...', currentSpinnerInstance);
            yield ssh.execCommand('systemctl restart uggsm-api');
            logging_1.log('command', 'Успешный рестарт', currentSpinnerInstance);
            logging_1.log('command', 'Ожидаем запуска ...', currentSpinnerInstance);
            yield helpers_1.sleep(10000);
            logging_1.log('command', 'Получаем текущий статус ...', currentSpinnerInstance);
            result = {
                api: (yield ssh.execCommand('systemctl status uggsm-api')).stdout,
            };
            logging_1.log('command', 'Текущий статус успешно получен', currentSpinnerInstance);
        }
        else if (command === 'restart-mongod') {
            logging_1.log('command', 'Запуск рестарта базы данных ...', currentSpinnerInstance);
            yield ssh.execCommand('systemctl restart mongod');
            logging_1.log('command', 'Успешный рестарт', currentSpinnerInstance);
            logging_1.log('command', 'Ожидаем запуска ...', currentSpinnerInstance);
            yield helpers_1.sleep(10000);
            logging_1.log('command', 'Получаем текущий статус ...', currentSpinnerInstance);
            result = {
                mongod: (yield ssh.execCommand('systemctl status mongod')).stdout,
            };
            logging_1.log('command', 'Текущий статус успешно получен', currentSpinnerInstance);
        }
        else if (command === 'restart-nginx') {
            logging_1.log('command', 'Запуск рестарта сервера статики ...', currentSpinnerInstance);
            yield ssh.execCommand('systemctl restart nginx');
            logging_1.log('command', 'Успешный рестарт', currentSpinnerInstance);
            logging_1.log('command', 'Ожидаем запуска ...', currentSpinnerInstance);
            yield helpers_1.sleep(10000);
            logging_1.log('command', 'Получаем текущий статус ...', currentSpinnerInstance);
            result = {
                nginx: (yield ssh.execCommand('systemctl status nginx')).stdout,
            };
            logging_1.log('command', 'Текущий статус успешно получен', currentSpinnerInstance);
        }
        else if (command === 'restart-backup') {
            logging_1.log('command', 'Запуск рестарта сервиса резервного копирования ...', currentSpinnerInstance);
            yield ssh.execCommand('systemctl restart uggsm-backup');
            logging_1.log('command', 'Успешный рестарт', currentSpinnerInstance);
            logging_1.log('command', 'Ожидаем запуска ...', currentSpinnerInstance);
            yield helpers_1.sleep(10000);
            logging_1.log('command', 'Получаем текущий статус ...', currentSpinnerInstance);
            result = {
                uggsmBackup: (yield ssh.execCommand('systemctl status uggsm-backup')).stdout,
            };
            logging_1.log('command', 'Текущий статус успешно получен', currentSpinnerInstance);
        }
        else if (command === 'create-backup') {
            logging_1.log('command', 'Запускаем внеплановую резервную копию базы данных ...', currentSpinnerInstance);
            yield ssh.execCommand('cd /var/uggsm-backup && /usr/bin/node index.js --dump');
            logging_1.log('command', 'Резервная копия успешно создана', currentSpinnerInstance);
            result = false;
        }
        if (result) {
            for (const key in result) {
                console.log(`[${key.toUpperCase()}]`);
                console.log(result[key]);
            }
        }
        process.exit();
    });
}
function cli() {
    return __awaiter(this, void 0, void 0, function* () {
        const firstQuestion = yield inquirer.prompt([
            {
                type: 'list',
                name: 'mode',
                message: 'Режим работы',
                default: 'Сборка и выгрузка',
                choices: [
                    {
                        name: 'Сборка и выгрузка',
                        value: 'deploy',
                    },
                    {
                        name: 'Комманды серверу',
                        value: 'commands',
                    },
                ],
            },
        ]);
        if (firstQuestion.mode === 'deploy') {
            const secondQuestion = yield inquirer.prompt([
                {
                    type: 'list',
                    name: 'scope',
                    message: 'Что собрать и выгрузить',
                    default: 'Только клиент',
                    choices: [
                        {
                            name: 'Клиент и Сервер',
                            value: 'deploy-client-and-server',
                        },
                        {
                            name: 'Только клиент',
                            value: 'deploy-only-client',
                        },
                        {
                            name: 'Только сервер',
                            value: 'deploy-only-server',
                        },
                        {
                            name: 'Только система бэкапов',
                            value: 'deploy-backup-system',
                        },
                    ],
                },
            ]);
            if (secondQuestion.scope) {
                run(secondQuestion.scope);
            }
        }
        else if (firstQuestion.mode === 'commands') {
            const secondQuestion = yield inquirer.prompt([
                {
                    type: 'list',
                    name: 'command',
                    message: 'Что делаем',
                    choices: [
                        {
                            name: 'Рестарт сервера, базы данных, сервера статики',
                            value: 'restart',
                        },
                        {
                            name: 'Создать внеплановую резервную копию базы данных',
                            value: 'create-backup',
                        },
                        {
                            name: 'Рестарт сервера',
                            value: 'restart-server',
                        },
                        {
                            name: 'Рестарт базы',
                            value: 'restart-mongod',
                        },
                        {
                            name: 'Рестарт сервера статики',
                            value: 'restart-nginx',
                        },
                        {
                            name: 'Рестарт бэкап системы',
                            value: 'restart-backup',
                        },
                    ],
                },
            ]);
            if (secondQuestion.command) {
                runCommands(secondQuestion.command);
            }
        }
    });
}
cli();
