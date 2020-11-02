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
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = exports.remove = exports.writeFile = exports.readdir = void 0;
const fs = __importStar(require("fs"));
function readdir(disk, path) {
    return new Promise((resolve, reject) => {
        disk.readdir(path, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
}
exports.readdir = readdir;
function writeFile(disk, pathDisk, pathLocal) {
    return new Promise((resolve, reject) => {
        disk.writeFile(pathDisk, fs.readFileSync(pathLocal), 'utf-8', (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
}
exports.writeFile = writeFile;
function remove(disk, path) {
    return new Promise((resolve, reject) => {
        disk.remove(path, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
}
exports.remove = remove;
function download(disk, pathDisk, pathLocal) {
    return new Promise((resolve, reject) => {
        disk.downloadFile(pathDisk, pathLocal, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
}
exports.download = download;
