"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const light_1 = __importDefault(require("./light"));
const dark_1 = __importDefault(require("./dark"));
const themes = {
    light: light_1.default,
    dark: dark_1.default,
};
function getTheme(theme) {
    return themes[theme];
}
exports.default = getTheme;
