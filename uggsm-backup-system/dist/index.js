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
const config_1 = __importDefault(require("./config"));
const yandex_disk_1 = require("yandex-disk");
const helpers_1 = require("./helpers");
const promisify_child_process_1 = require("promisify-child-process");
const moment_1 = __importDefault(require("moment"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const lodash_1 = require("lodash");
const logger_1 = __importDefault(require("./helpers/logger"));
const node_cron_1 = __importDefault(require("node-cron"));
const dotenv = __importStar(require("dotenv"));
const yargs_1 = __importDefault(require("yargs"));
// @ts-ignore
const helpers_2 = require("yargs/helpers");
yargs_1.default.help('h').alias('h', 'help').argv;
const argv = yargs_1.default(helpers_2.hideBin(process.argv)).argv;
dotenv.config();
moment_1.default.locale('ru');
const disk = new yandex_disk_1.YandexDisk(config_1.default.token);
function createDatabaseDump(credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const datetime = moment_1.default().format('DDMMYYYY_HHmmss');
            const archiveName = `${datetime}.gz`;
            if (credentials) {
                yield promisify_child_process_1.exec(`mongodump --authenticationDatabase admin --username ${credentials.username} --password ${credentials.password} -d uggsm -h localhost --gzip --archive=${archiveName}`, { cwd: __dirname });
            }
            else {
                yield promisify_child_process_1.exec(`mongodump -d uggsm -h localhost --gzip --archive=${archiveName}`, { cwd: __dirname });
            }
            return {
                name: archiveName,
                file: path.join(__dirname, archiveName),
            };
        }
        catch (error) {
            logger_1.default.error(`Error in "createDatabaseDump" creating backup`, {
                additional: error.message,
            });
            return {
                name: false,
                file: false,
            };
        }
    });
}
function downloadLastestDatabaseDump() {
    return __awaiter(this, void 0, void 0, function* () {
        let backups;
        try {
            const dailyBackups = yield helpers_1.readdir(disk, config_1.default.paths.fullAutomaticDaily);
            const weeklyBackups = yield helpers_1.readdir(disk, config_1.default.paths.fullAutomaticWeekly);
            const monthlyBackups = yield helpers_1.readdir(disk, config_1.default.paths.fullAutomaticMonthly);
            backups = [...dailyBackups, ...weeklyBackups, ...monthlyBackups];
        }
        catch (error) {
            logger_1.default.error(`Error in "downloadLastestDatabaseDump" when reading backups list`, {
                additional: error.message,
            });
        }
        if (backups) {
            const lastest = lodash_1.first(backups.sort((a, b) => {
                const dateA = moment_1.default(a.displayName, 'DDMMYYYY_HHmmss');
                const dateB = moment_1.default(b.displayName, 'DDMMYYYY_HHmmss');
                return moment_1.default.utc(dateB).diff(moment_1.default.utc(dateA));
            }));
            try {
                yield helpers_1.download(disk, lastest.href, path.join(__dirname, lastest.displayName));
            }
            catch (error) {
                logger_1.default.error(`Error in "downloadLastestDatabaseDump" when downloading backup`, {
                    additional: error.message,
                });
                return false;
            }
            return {
                name: lastest.displayName,
                path: path.join(__dirname, lastest.displayName),
            };
        }
    });
}
function restoreDatabaseFromDump(path, credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!path) {
            path = yield downloadLastestDatabaseDump();
        }
        try {
            if (path) {
                if (credentials) {
                    yield promisify_child_process_1.exec(`mongorestore --authenticationDatabase admin --username ${credentials.username} --password ${credentials.password} ${path.path}`);
                }
                else {
                    yield promisify_child_process_1.exec(`mongorestore --drop --gzip --archive=${path.path}`);
                }
                logger_1.default.info(`Database restored from ${path}`);
                fs.unlinkSync(path.path);
            }
        }
        catch (error) {
            logger_1.default.error(`Error in "restoreDatabaseFromDump" when restoring database from path ${path}`, {
                additional: error.message,
            });
        }
    });
}
function uploadDatabaseDump(type, custom) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, file } = yield createDatabaseDump({
            username: 'admin',
            password: 'qas87W5jfxD4GR6r',
        });
        if (custom) {
            try {
                if (name && file && typeof name !== 'boolean' && typeof file !== 'boolean') {
                    yield helpers_1.writeFile(disk, `${config_1.default.paths.fullCustom}/${name}`, file);
                    logger_1.default.info(`Database custom dump created ${name}`);
                    fs.unlinkSync(file);
                }
            }
            catch (error) {
                logger_1.default.error(`Error in "uploadDatabaseDump" when uploading custom backup`, {
                    additional: error.message,
                });
            }
        }
        else {
            if (name && file && typeof name !== 'boolean' && typeof file !== 'boolean') {
                let diskPath = config_1.default.paths.fullAutomaticDaily;
                if (type === 'daily') {
                    diskPath = config_1.default.paths.fullAutomaticDaily;
                }
                else if (type === 'weekly') {
                    diskPath = config_1.default.paths.fullAutomaticWeekly;
                    try {
                        const dailyBackups = yield helpers_1.readdir(disk, config_1.default.paths.fullAutomaticDaily);
                        for (const key in dailyBackups) {
                            yield helpers_1.remove(disk, dailyBackups[key].href);
                        }
                    }
                    catch (error) {
                        logger_1.default.error(`Error in "uploadDatabaseDump" when read & remove daily backups`, {
                            additional: error.message,
                        });
                    }
                }
                else if (type === 'monthly') {
                    diskPath = config_1.default.paths.fullAutomaticMonthly;
                    try {
                        const weeklyBackups = yield helpers_1.readdir(disk, config_1.default.paths.fullAutomaticWeekly);
                        for (const key in weeklyBackups) {
                            yield helpers_1.remove(disk, weeklyBackups[key].href);
                        }
                    }
                    catch (error) {
                        logger_1.default.error(`Error in "uploadDatabaseDump" when read & remove weekly backups`, {
                            additional: error.message,
                        });
                    }
                    try {
                        const monthlyBackups = yield helpers_1.readdir(disk, config_1.default.paths.fullAutomaticMonthly);
                        if (monthlyBackups.length + 1 > 2) {
                            const sliced = monthlyBackups.slice(1);
                            for (const key in sliced) {
                                yield helpers_1.remove(disk, sliced[key].href);
                            }
                        }
                    }
                    catch (error) {
                        logger_1.default.error(`Error in "uploadDatabaseDump" when read & remove monthly backups`, {
                            additional: error.message,
                        });
                    }
                }
                try {
                    yield helpers_1.writeFile(disk, `${diskPath}/${name}`, file);
                    logger_1.default.info(`Database ${type} dump created ${name}`);
                    fs.unlinkSync(file);
                }
                catch (error) {
                    logger_1.default.error(`Error in "uploadDatabaseDump" when uploading ${type} backup`, {
                        additional: error.message,
                    });
                }
            }
        }
    });
}
function schedule() {
    node_cron_1.default.schedule('00 00 * * *', function () {
        uploadDatabaseDump('daily');
    });
    node_cron_1.default.schedule('00 00 * * 0', function () {
        uploadDatabaseDump('weekly');
    });
    node_cron_1.default.schedule('00 00 1 * *', function () {
        uploadDatabaseDump('monthly');
    });
}
if (argv.daemon) {
    schedule();
}
else if (argv.backup && argv.file) {
    console.log('restore from backup with file');
}
else if (argv.backup) {
    restoreDatabaseFromDump(false, {
        username: 'admin',
        password: 'qas87W5jfxD4GR6r',
    });
}
else if (argv.dump) {
    uploadDatabaseDump('none', true);
}
else {
    schedule();
}
