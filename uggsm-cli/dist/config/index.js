"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    githubToken: 'cb558a31c39373bd7867eee0376d9e907f0d41a9',
    folders: {
        buildedServer: `${__dirname}/uggsm-server/dist`,
        buildedServerPackage: `${__dirname}/uggsm-server/package.json`,
        buildedClient: `${__dirname}/uggsm-client/dist`,
        buildedBackupSystem: `${__dirname}/uggsm-backup-system/dist`,
        buildedBackupSystemPackage: `${__dirname}/uggsm-backup-system/package.json`,
    },
    server: {
        serverFolder: '/var/www/api',
        serverFolderPackage: '/var/www/api/package.json',
        clientFolder: '/var/www/app',
        backupSystemFolder: '/var/uggsm-backup',
        backupSystemFolderPackage: '/var/uggsm-backup/package.json',
    },
};
exports.default = exports.config;
